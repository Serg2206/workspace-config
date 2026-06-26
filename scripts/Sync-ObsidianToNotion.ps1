#requires -Version 5.1
<#
.SYNOPSIS
    Синхронизация заметок Obsidian в Notion.

.DESCRIPTION
    Сканирует папку Obsidian Vault на новые/изменённые .md файлы
    и создаёт страницы в Notion через API. Синхронизируются:
    - Файлы с тегом #publish
    - Файлы в папке 02-Projects/
    - Файлы в папке 03-Academic/

    Конвертация Markdown → Notion blocks:
    - Заголовки H1-H3 → heading blocks
    - Параграфы → paragraph blocks
    - Bullet списки → bulleted_list_item
    - Numbered списки → numbered_list_item
    - Чекбоксы → to_do
    - Код-блоки → code blocks
    - Цитаты → quote blocks
    - Frontmatter игнорируется

    State management: JSON-файл (.sync-state.json) отслеживает
    хэши файлов — неизменённые файлы повторно не синхронизируются.

.PARAMETER NotionToken
    Notion API Integration Token. Если не указан — берётся из $env:NOTION_TOKEN.

.PARAMETER DatabaseId
    ID Notion Database для создания страниц.

.PARAMETER VaultPath
    Путь к Obsidian Vault. По умолчанию: C:\Obsidian

.PARAMETER DryRun
    Режим просмотра: показать что будет синхронизировано, но не создавать страницы.

.PARAMETER LogPath
    Путь к файлу лога. По умолчанию: .\Sync-ObsidianToNotion.log

.PARAMETER StateFile
    Путь к файлу состояния синхронизации. По умолчанию: .\.sync-state.json

.EXAMPLE
    .\Sync-ObsidianToNotion.ps1 -DryRun
    $env:NOTION_TOKEN = "secret_xxx"; .\Sync-ObsidianToNotion.ps1
    .\Sync-ObsidianToNotion.ps1 -DatabaseId "12345678-1234-1234-1234-123456789012"

.NOTES
    Требования: $env:NOTION_TOKEN с доступом к указанной Database.
    Rate limiting: задержка 350ms между запросами (Notion: 3 req/sec).
    Кодировка: UTF-8 with BOM для корректного отображения русского текста.
#>
[CmdletBinding()]
param (
    [string]$NotionToken  = $env:NOTION_TOKEN,
    [string]$DatabaseId   = $env:NOTION_DATABASE_ID,
    [string]$VaultPath    = "C:\Obsidian",
    [switch]$DryRun,
    [string]$LogPath      = (Join-Path $PSScriptRoot "Sync-ObsidianToNotion.log"),
    [string]$StateFile    = (Join-Path $PSScriptRoot ".sync-state.json")
)

# ═══════════════════════════════════════════════════════════════
# Константы
# ═══════════════════════════════════════════════════════════════
$ErrorActionPreference = 'Continue'
$script:NotionApiBase = 'https://api.notion.com/v1'
$script:NotionVersion = '2022-06-28'
$script:DelayMs       = 350

# ═══════════════════════════════════════════════════════════════
# Вспомогательные функции
# ═══════════════════════════════════════════════════════════════
function Write-Log {
    <#
    .SYNOPSIS
        Записывает сообщение в лог и выводит в консоль с цветом.
    #>
    param(
        [Parameter(Mandatory)][string]$Message,
        [ValidateSet('INFO','WARN','ERROR','SUCCESS','DRYRUN')][string]$Level = 'INFO'
    )
    $ts    = Get-Date -Format "yyyy-MM-dd HH:mm:ss"
    $color = switch ($Level) {
        'INFO'    { 'White' }
        'WARN'    { 'Yellow' }
        'ERROR'   { 'Red' }
        'SUCCESS' { 'Green' }
        'DRYRUN'  { 'Magenta' }
    }
    $line = "[$ts] [$Level] $Message"
    Write-Host "  $line" -ForegroundColor $color
    try {
        Add-Content -Path $LogPath -Value $line -Encoding UTF8 -ErrorAction SilentlyContinue
    } catch { }
}

function Invoke-NotionApi {
    <#
    .SYNOPSIS
        Выполняет запрос к Notion REST API с обработкой rate limiting.
    #>
    param(
        [Parameter(Mandatory)][string]$Method,
        [Parameter(Mandatory)][string]$Uri,
        [string]$Body = $null
    )

    $headers = @{
        'Authorization'  = "Bearer $NotionToken"
        'Notion-Version' = $script:NotionVersion
        'Content-Type'   = 'application/json'
    }

    try {
        Start-Sleep -Milliseconds $script:DelayMs

        if ($Body) {
            $response = Invoke-RestMethod -Method $Method -Uri $Uri -Headers $headers -Body $Body -TimeoutSec 30
        } else {
            $response = Invoke-RestMethod -Method $Method -Uri $Uri -Headers $headers -TimeoutSec 30
        }
        return @{ Success = $true; Data = $response }

    } catch {
        $statusCode = $_.Exception.Response.StatusCode.value__
        if ($statusCode -eq 429) {
            Write-Log "Rate limited, waiting 2 seconds..." 'WARN'
            Start-Sleep -Seconds 2
            return Invoke-NotionApi -Method $Method -Uri $Uri -Body $Body
        }
        return @{ Success = $false; Error = $_.Exception.Message; StatusCode = $statusCode }
    }
}

function Get-FileHash {
    <#
    .SYNOPSIS
        Возвращает MD5 хэш файла для отслеживания изменений.
    #>
    param([string]$FilePath)
    try {
        $stream = [System.IO.File]::OpenRead($FilePath)
        $md5    = [System.Security.Cryptography.MD5]::Create()
        $hash   = [System.BitConverter]::ToString($md5.ComputeHash($stream)).Replace('-', '')
        $stream.Close()
        return $hash
    } catch {
        return $null
    }
}

function Load-SyncState {
    <#
    .SYNOPSIS
        Загружает состояние синхронизации из JSON-файла.
    #>
    if (Test-Path $StateFile) {
        try {
            return Get-Content $StateFile -Raw -Encoding UTF8 | ConvertFrom-Json -AsHashtable
        } catch {
            return @{}
        }
    }
    return @{}
}

function Save-SyncState {
    <#
    .SYNOPSIS
        Сохраняет состояние синхронизации в JSON-файл.
    #>
    param([hashtable]$State)
    $State | ConvertTo-Json -Depth 5 | Set-Content -Path $StateFile -Encoding UTF8
}

function Convert-MarkdownToNotionBlocks {
    <#
    .SYNOPSIS
        Конвертирует Markdown текст в массив Notion blocks.
    #>
    param([string]$Content)

    $blocks = @()
    $lines  = $Content -split "`r?`n"
    $i      = 0

    while ($i -lt $lines.Count) {
        $line = $lines[$i]

        # Пустые строки — пропускаем
        if ([string]::IsNullOrWhiteSpace($line)) {
            $i++
            continue
        }

        # Frontmatter — пропускаем
        if ($line -match '^---\s*$') {
            $i++
            while ($i -lt $lines.Count -and $lines[$i] -notmatch '^---\s*$') {
                $i++
            }
            $i++
            continue
        }

        # H1
        if ($line -match '^# (.+)$') {
            $blocks += @{
                object = 'block'
                type   = 'heading_1'
                heading_1 = @{ rich_text = @(@{ type = 'text'; text = @{ content = $Matches[1] } }) }
            }
            $i++
            continue
        }

        # H2
        if ($line -match '^## (.+)$') {
            $blocks += @{
                object = 'block'
                type   = 'heading_2'
                heading_2 = @{ rich_text = @(@{ type = 'text'; text = @{ content = $Matches[1] } }) }
            }
            $i++
            continue
        }

        # H3
        if ($line -match '^### (.+)$') {
            $blocks += @{
                object = 'block'
                type   = 'heading_3'
                heading_3 = @{ rich_text = @(@{ type = 'text'; text = @{ content = $Matches[1] } }) }
            }
            $i++
            continue
        }

        # Checkbox
        if ($line -match '^- \[([ x])\] (.+)$') {
            $checked = $Matches[1] -eq 'x'
            $blocks += @{
                object = 'block'
                type   = 'to_do'
                to_do  = @{
                    rich_text = @(@{ type = 'text'; text = @{ content = $Matches[2] } })
                    checked   = $checked
                }
            }
            $i++
            continue
        }

        # Bullet list
        if ($line -match '^(\s*)[-*] (.+)$') {
            $text = $Matches[2]
            $blocks += @{
                object = 'block'
                type   = 'bulleted_list_item'
                bulleted_list_item = @{ rich_text = @(@{ type = 'text'; text = @{ content = $text } }) }
            }
            $i++
            continue
        }

        # Numbered list
        if ($line -match '^\d+\. (.+)$') {
            $blocks += @{
                object = 'block'
                type   = 'numbered_list_item'
                numbered_list_item = @{ rich_text = @(@{ type = 'text'; text = @{ content = $Matches[1] } }) }
            }
            $i++
            continue
        }

        # Code block ( fenced )
        if ($line -match '^```(\w*)\s*$') {
            $lang       = $Matches[1]
            $codeLines  = @()
            $i++
            while ($i -lt $lines.Count -and $lines[$i] -notmatch '^```\s*$') {
                $codeLines += $lines[$i]
                $i++
            }
            $i++
            $blocks += @{
                object = 'block'
                type   = 'code'
                code   = @{
                    rich_text = @(@{ type = 'text'; text = @{ content = ($codeLines -join "`n") } })
                    language  = if ($lang) { $lang } else { 'plain text' }
                }
            }
            continue
        }

        # Quote
        if ($line -match '^>\s?(.+)$') {
            $blocks += @{
                object = 'block'
                type   = 'quote'
                quote  = @{ rich_text = @(@{ type = 'text'; text = @{ content = $Matches[1] } }) }
            }
            $i++
            continue
        }

        # Divider
        if ($line -match '^---\s*$') {
            $blocks += @{ object = 'block'; type = 'divider'; divider = @{} }
            $i++
            continue
        }

        # Paragraph (default)
        $blocks += @{
            object = 'block'
            type   = 'paragraph'
            paragraph = @{ rich_text = @(@{ type = 'text'; text = @{ content = $line } }) }
        }
        $i++
    }

    return $blocks
}

# ═══════════════════════════════════════════════════════════════
# Основная логика
# ═══════════════════════════════════════════════════════════════
try {
    Write-Log "=== Запуск синхронизации Obsidian → Notion ==="
    Write-Log "Vault: $VaultPath"
    Write-Log "State: $StateFile"
    Write-Log "DryRun: $DryRun"

    if ([string]::IsNullOrWhiteSpace($NotionToken)) {
        Write-Log "❌ NOTION_TOKEN не указан. Установите:`n   `$env:NOTION_TOKEN = 'secret_xxx'" 'ERROR'
        exit 1
    }

    if (-not (Test-Path $VaultPath)) {
        Write-Log "❌ Vault не найден: $VaultPath" 'ERROR'
        exit 1
    }

    # Проверка подключения к Notion
    Write-Log "Проверка подключения к Notion API..."
    $me = Invoke-NotionApi -Method GET -Uri "$script:NotionApiBase/users/me"
    if (-not $me.Success) {
        Write-Log "❌ Не удалось подключиться к Notion: $($me.Error)" 'ERROR'
        exit 1
    }
    Write-Log "✅ Подключено как: $($me.Data.name)" 'SUCCESS'

    # Поиск файлов для синхронизации
    Write-Log "Сканирование vault..."
    $allMdFiles = Get-ChildItem -Path $VaultPath -Recurse -File -Filter '*.md' -ErrorAction SilentlyContinue |
        Where-Object {
            $_.FullName -notmatch '\\\.obsidian\\' -and
            $_.FullName -notmatch '\\\.git\\' -and
            $_.FullName -notmatch '\\\.trash\\'
        }

    $filesToSync = @()
    foreach ($file in $allMdFiles) {
        $relativePath = $file.FullName.Substring($VaultPath.Length + 1)
        $content      = Get-Content $file.FullName -Raw -Encoding UTF8

        $shouldSync = $false

        # Тег #publish
        if ($content -match '#publish') {
            $shouldSync = $true
        }

        # Папка 02-Projects
        if ($relativePath -match '^02-Projects[\\/]') {
            $shouldSync = $true
        }

        # Папка 03-Academic
        if ($relativePath -match '^03-Academic[\\/]') {
            $shouldSync = $true
        }

        # Заметки в 01-DailyNotes
        if ($relativePath -match '^01-DailyNotes[\\/]') {
            $shouldSync = $true
        }

        if ($shouldSync) {
            $filesToSync += [PSCustomObject]@{
                FullPath     = $file.FullName
                RelativePath = $relativePath
                Content      = $content
                LastModified = $file.LastWriteTime
                FileHash     = Get-FileHash -FilePath $file.FullName
                Name         = $file.BaseName
            }
        }
    }

    Write-Log "Найдено файлов для синхронизации: $($filesToSync.Count)"

    if ($filesToSync.Count -eq 0) {
        Write-Log "Нет файлов для синхронизации. Выход." 'SUCCESS'
        exit 0
    }

    # Загрузка состояния
    $state = Load-SyncState

    # Определение файлов для синхронизации
    $synced = 0
    $skipped = 0

    foreach ($file in $filesToSync) {
        $fileKey = $file.RelativePath

        # Проверяем хэш
        if ($state.ContainsKey($fileKey) -and $state[$fileKey] -eq $file.FileHash) {
            Write-Log "⏭️  Пропущено (без изменений): $($file.RelativePath)"
            $skipped++
            continue
        }

        Write-Log "🔄 Синхронизация: $($file.RelativePath)"

        if ($DryRun) {
            Write-Log "  [DRY RUN] Будет создана страница: $($file.Name)" 'DRYRUN'
            $synced++
            continue
        }

        try {
            $blocks = Convert-MarkdownToNotionBlocks -Content $file.Content

            if ($blocks.Count -eq 0) {
                Write-Log "  ⚠️  Пустой контент, пропущено" 'WARN'
                continue
            }

            # Ограничение Notion API: max 100 blocks per request
            if ($blocks.Count -gt 100) {
                Write-Log "  ⚠️  Большой файл ($($blocks.Count) blocks), обрезаем до 100" 'WARN'
                $blocks = $blocks[0..99]
            }

            # Создание страницы
            $body = @{
                parent    = @{ database_id = $DatabaseId }
                icon      = @{ emoji = '📝' }
                properties = @{
                    Name = @{
                        title = @(@{ text = @{ content = $file.Name } })
                    }
                }
                children  = $blocks
            } | ConvertTo-Json -Depth 10

            $result = Invoke-NotionApi -Method POST -Uri "$script:NotionApiBase/pages" -Body $body

            if ($result.Success) {
                Write-Log "  ✅ Создана страница: $($result.Data.url)" 'SUCCESS'
                $state[$fileKey] = $file.FileHash
                $synced++
            } else {
                Write-Log "  ❌ Ошибка: $($result.Error)" 'ERROR'
            }

        } catch {
            Write-Log "  ❌ Ошибка: $($_.Exception.Message)" 'ERROR'
        }
    }

    # Сохранение состояния
    Save-SyncState -State $state

    Write-Log ""
    Write-Log "=== Результаты синхронизации ==="
    Write-Log "Синхронизировано: $synced"
    Write-Log "Пропущено:        $skipped"

    if ($DryRun) {
        Write-Log ""
        Write-Log "⚠️  DRY RUN: страницы не созданы. Уберите -DryRun для реальной синхронизации." 'WARN'
    }

    Write-Log "=== Синхронизация завершена ===" 'SUCCESS'

} catch {
    Write-Log "КРИТИЧЕСКАЯ ОШИБКА: $($_.Exception.Message)" 'ERROR'
    exit 1
}
