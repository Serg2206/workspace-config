#requires -Version 5.1
<#
.SYNOPSIS
    Ежедневный backup Obsidian vault в GitHub репозиторий.

.DESCRIPTION
    Коммитит Obsidian vault в GitHub с автоматической инициализацией git.
    Создаёт daily commit с датой и количеством файлов в сообщении.
    Проверяет наличие изменений перед коммитом через git diff --quiet.
    Поддерживает авто-инициализацию git-репозитория, проверку remote URL,
    авто-push и подробное логирование.

.PARAMETER VaultPath
    Путь к локальному Vault (или junction). По умолчанию: C:\Obsidian

.PARAMETER Remote
    Имя удалённого репозитория. По умолчанию: origin

.PARAMETER AutoPush
    Автоматически выполнять push после commit.

.PARAMETER CommitMessage
    Кастомное сообщение commit. По умолчанию генерируется автоматически:
    "backup: YYYY-MM-DD daily notes (N files)"

.PARAMETER GitHubRepoUrl
    URL GitHub репозитория для инициализации. Если не указан — используется существующий remote.

.EXAMPLE
    .\Backup-ToGitHub.ps1 -AutoPush
    .\Backup-ToGitHub.ps1 -VaultPath "D:\Obsidian" -AutoPush
    .\Backup-ToGitHub.ps1 -GitHubRepoUrl "https://github.com/user/obsidian-vault.git" -AutoPush

.NOTES
    Требования: git должен быть установлен и доступен в PATH.
    Зависимости: MS365 toolkit.
    Кодировка: UTF-8 with BOM для корректного отображения русского текста.
#>
[CmdletBinding(SupportsShouldProcess = $true)]
param (
    [string]$VaultPath      = "C:\Obsidian",
    [string]$Remote         = 'origin',
    [switch]$AutoPush,
    [string]$CommitMessage  = '',
    [string]$GitHubRepoUrl  = $env:GITHUB_VAULT_REPO
)

# ═══════════════════════════════════════════════════════════════
# Константы
# ═══════════════════════════════════════════════════════════════
$ErrorActionPreference = 'Stop'
$script:LogFile        = Join-Path -Path $PSScriptRoot -ChildPath "Backup-ToGitHub.log"
$script:GitExe         = 'git'

# ═══════════════════════════════════════════════════════════════
# Вспомогательные функции
# ═══════════════════════════════════════════════════════════════
function Write-Log {
    <#
    .SYNOPSIS
        Записывает сообщение в лог-файл и выводит в консоль с цветом.
    #>
    param(
        [Parameter(Mandatory)][string]$Message,
        [ValidateSet('INFO','WARN','ERROR','SUCCESS')][string]$Level = 'INFO'
    )
    $ts = Get-Date -Format "yyyy-MM-dd HH:mm:ss"
    $color = switch ($Level) {
        'INFO'    { 'White' }
        'WARN'    { 'Yellow' }
        'ERROR'   { 'Red' }
        'SUCCESS' { 'Green' }
    }
    $line = "[$ts] [$Level] $Message"
    Write-Host $line -ForegroundColor $color
    try {
        Add-Content -Path $script:LogFile -Value $line -Encoding UTF8 -ErrorAction SilentlyContinue
    } catch { }
}

function Invoke-Git {
    <#
    .SYNOPSIS
        Выполняет git команду с таймаутом и перехватом вывода.
    #>
    param(
        [Parameter(Mandatory)][string[]]$Arguments,
        [string]$WorkingDirectory = $VaultPath,
        [int]$TimeoutSec = 60
    )
    $psi                           = New-Object -TypeName System.Diagnostics.ProcessStartInfo
    $psi.FileName                  = $script:GitExe
    $psi.Arguments                 = $Arguments -join ' '
    $psi.WorkingDirectory          = $WorkingDirectory
    $psi.RedirectStandardOutput    = $true
    $psi.RedirectStandardError     = $true
    $psi.UseShellExecute           = $false
    $psi.CreateNoWindow            = $true
    $psi.StandardOutputEncoding    = [System.Text.Encoding]::UTF8
    $psi.StandardErrorEncoding     = [System.Text.Encoding]::UTF8

    $proc   = [System.Diagnostics.Process]::Start($psi)
    $stdout = $proc.StandardOutput.ReadToEnd()
    $stderr = $proc.StandardError.ReadToEnd()

    if (-not $proc.WaitForExit($TimeoutSec * 1000)) {
        $proc.Kill()
        throw "Git timeout: git $($Arguments -join ' ')"
    }

    $exitCode = $proc.ExitCode
    $output   = ($stdout + $stderr).Trim()

    return [PSCustomObject]@{
        ExitCode = $exitCode
        Output   = $output
    }
}

function Test-GitInstalled {
    <#
    .SYNOPSIS
        Проверяет, что git установлен и доступен в PATH.
    #>
    try {
        $result = Invoke-Git -Arguments @('--version') -WorkingDirectory $env:TEMP
        if ($result.ExitCode -eq 0) {
            Write-Log "Git найден: $($result.Output)"
            return $true
        }
    } catch {
        Write-Log "Git не найден в PATH" 'ERROR'
    }
    return $false
}

function Initialize-GitRepo {
    <#
    .SYNOPSIS
        Инициализирует git-репозиторий в vault директории.
    #>
    param([string]$RepoUrl)

    Write-Log "Инициализация git-репозитория..."

    if ($PSCmdlet.ShouldProcess($VaultPath, 'git init')) {
        $init = Invoke-Git -Arguments @('init')
        if ($init.ExitCode -ne 0) { throw "git init failed: $($init.Output)" }
        Write-Log "git init выполнен"
    }

    $userName  = (Invoke-Git -Arguments @('config', 'user.name')).Output
    $userEmail = (Invoke-Git -Arguments @('config', 'user.email')).Output

    if (-not $userName) {
        Invoke-Git -Arguments @('config', 'user.name', 'Obsidian Backup Bot')
        Write-Log "Установлен user.name"
    }
    if (-not $userEmail) {
        Invoke-Git -Arguments @('config', 'user.email', 'backup@obsidian.local')
        Write-Log "Установлен user.email"
    }

    if ($RepoUrl) {
        $remoteCheck = Invoke-Git -Arguments @('remote', 'get-url', $Remote)
        if ($remoteCheck.ExitCode -ne 0) {
            if ($PSCmdlet.ShouldProcess("$Remote -> $RepoUrl", 'git remote add')) {
                $addRemote = Invoke-Git -Arguments @('remote', 'add', $Remote, $RepoUrl)
                if ($addRemote.ExitCode -ne 0) { throw "git remote add failed: $($addRemote.Output)" }
                Write-Log "Remote добавлен: $Remote -> $RepoUrl" 'SUCCESS'
            }
        } else {
            Write-Log "Remote уже настроен: $($remoteCheck.Output)"
        }
    }

    $logResult = Invoke-Git -Arguments @('log', '--oneline', '-1')
    if ($logResult.ExitCode -ne 0) {
        Write-Log "Создание начального commit..."
        Invoke-Git -Arguments @('add', '.')
        $initialMsg = "initial: Obsidian vault backup setup"
        Invoke-Git -Arguments @('commit', '-m', $initialMsg)
        Write-Log "Начальный commit создан" 'SUCCESS'
    }
}

function Get-TrackedFileCount {
    <#
    .SYNOPSIS
        Возвращает количество отслеживаемых файлов в git-репозитории.
    #>
    try {
        $result = Invoke-Git -Arguments @('ls-files')
        if ($result.ExitCode -eq 0 -and $result.Output) {
            return ($result.Output -split "`r?`n" | Where-Object { $_ }).Count
        }
    } catch { }
    return 0
}

# ═══════════════════════════════════════════════════════════════
# Основная логика
# ═══════════════════════════════════════════════════════════════
try {
    Write-Log "=== Запуск Backup-ToGitHub ==="
    Write-Log "Vault: $VaultPath"

    if (-not (Test-Path -Path $VaultPath)) {
        throw "Vault не найден: $VaultPath. Запустите Setup-ObsidianSync.ps1"
    }

    if (-not (Test-GitInstalled)) {
        throw "Git не установлен. Установите: https://git-scm.com/download/win"
    }

    $gitDir = Join-Path -Path $VaultPath -ChildPath '.git'
    if (-not (Test-Path -Path $gitDir)) {
        Write-Log "Git-репозиторий не найден, инициализируем..."
        Initialize-GitRepo -RepoUrl $GitHubRepoUrl
    } else {
        Write-Log "Git-репозиторий найден"

        $remoteCheck = Invoke-Git -Arguments @('remote', '-v')
        if ($remoteCheck.ExitCode -ne 0 -or [string]::IsNullOrWhiteSpace($remoteCheck.Output)) {
            if ($GitHubRepoUrl) {
                Write-Log "Remote не настроен, добавляем: $GitHubRepoUrl"
                $addRemote = Invoke-Git -Arguments @('remote', 'add', $Remote, $GitHubRepoUrl)
                if ($addRemote.ExitCode -ne 0) { throw "git remote add failed: $($addRemote.Output)" }
                Write-Log "Remote добавлен: $Remote -> $GitHubRepoUrl" 'SUCCESS'
            } else {
                Write-Log "Remote не настроен и GitHubRepoUrl не указан — push будет невозможен" 'WARN'
            }
        } else {
            Write-Log "Remote URL:`n$($remoteCheck.Output)"
        }
    }

    Write-Log "Проверка изменений (git diff --quiet)..."

    $diffResult = Invoke-Git -Arguments @('diff', '--quiet')
    $hasDiffChanges = $diffResult.ExitCode -ne 0

    $statusResult = Invoke-Git -Arguments @('status', '--porcelain')
    $hasStatusChanges = $statusResult.ExitCode -eq 0 -and -not [string]::IsNullOrWhiteSpace($statusResult.Output)

    if (-not $hasDiffChanges -and -not $hasStatusChanges) {
        Write-Log "Нет изменений для backup. Выход." 'SUCCESS'
        exit 0
    }

    $changedFiles = $statusResult.Output -split "`r?`n" | Where-Object { $_ }
    $addedCount   = ($changedFiles | Where-Object { $_ -match '^\?\?' }).Count
    $modCount     = ($changedFiles | Where-Object { $_ -match '^ M|^M|^ D|^D|^[R,A]' }).Count

    Write-Log "Изменённые файлы: $($changedFiles.Count) (добавлено: $addedCount, изменено/удалено: $modCount)"
    foreach ($f in $changedFiles | Select-Object -First 10) {
        Write-Log "  $f"
    }
    if ($changedFiles.Count -gt 10) {
        Write-Log "  ... и ещё $($changedFiles.Count - 10) файлов"
    }

    $fileCount = Get-TrackedFileCount
    if ($fileCount -eq 0) {
        $mdFiles   = Get-ChildItem -Path $VaultPath -Recurse -File -Filter '*.md' -ErrorAction SilentlyContinue |
            Where-Object { $_.FullName -notmatch '\\\.obsidian\\' -and $_.FullName -notmatch '\\\.git\\' }
        $fileCount = $mdFiles.Count
    }

    if ($PSCmdlet.ShouldProcess($VaultPath, 'git add .')) {
        $addResult = Invoke-Git -Arguments @('add', '.')
        if ($addResult.ExitCode -ne 0) {
            throw "git add failed: $($addResult.Output)"
        }
        Write-Log "Файлы добавлены в индекс"
    }

    $today       = Get-Date -Format 'yyyy-MM-dd'
    $msg         = if ($CommitMessage) {
        $CommitMessage
    } else {
        "backup: $today daily notes ($fileCount files)"
    }

    if ($PSCmdlet.ShouldProcess($msg, 'git commit')) {
        $commitResult = Invoke-Git -Arguments @('commit', '-m', $msg)
        if ($commitResult.ExitCode -ne 0) {
            if ($commitResult.Output -match 'nothing to commit') {
                Write-Log "Нет изменений для commit (возможно, все файлы в .gitignore)" 'WARN'
                exit 0
            }
            throw "git commit failed: $($commitResult.Output)"
        }

        $hashResult = Invoke-Git -Arguments @('log', '-1', '--format=%H')
        $commitHash = $hashResult.Output
        Write-Log "Commit создан: $commitHash" 'SUCCESS'
        Write-Log "Сообщение: $msg"
    }

    if ($AutoPush) {
        $remoteUrl = (Invoke-Git -Arguments @('remote', 'get-url', $Remote)).Output
        if ([string]::IsNullOrWhiteSpace($remoteUrl)) {
            Write-Log "Remote '$Remote' не настроен, push пропущен" 'WARN'
        } else {
            if ($PSCmdlet.ShouldProcess($Remote, 'git push')) {
                Write-Log "Push на $Remote ($remoteUrl)..."
                $pushResult = Invoke-Git -Arguments @('push', $Remote, 'HEAD') -TimeoutSec 120

                if ($pushResult.ExitCode -ne 0) {
                    if ($pushResult.Output -match 'current branch master|current branch main') {
                        $branch     = (Invoke-Git -Arguments @('branch', '--show-current')).Output
                        $pushResult = Invoke-Git -Arguments @('push', '-u', $Remote, $branch) -TimeoutSec 120
                    }

                    if ($pushResult.ExitCode -ne 0) {
                        Write-Log "Push не удался: $($pushResult.Output)" 'ERROR'
                        Write-Log "Возможные причины: нет доступа, конфликты, или требуется авторизация" 'WARN'
                        Write-Log "Для авторизации используйте: git credential-manager configure" 'WARN'
                    } else {
                        Write-Log "Push выполнен успешно" 'SUCCESS'
                    }
                } else {
                    Write-Log "Push выполнен успешно" 'SUCCESS'
                }
            }
        }
    } else {
        Write-Log "Push пропущен (используйте -AutoPush для автопуша)"
    }

    $logShort = Invoke-Git -Arguments @('log', '--oneline', '-5')
    Write-Log "Последние commits:`n$($logShort.Output)"

    $summary = [PSCustomObject]@{
        VaultPath       = $VaultPath
        FilesCommitted  = $fileCount
        ChangesAdded    = $addedCount
        ChangesModified = $modCount
        CommitMessage   = $msg
        Pushed          = $AutoPush
    }
    Write-Host ""
    $summary | Format-Table -AutoSize | Out-String | ForEach-Object { Write-Host "  $_" -ForegroundColor Cyan }

    Write-Log "=== Backup завершён ===" 'SUCCESS'

} catch {
    Write-Log "КРИТИЧЕСКАЯ ОШИБКА: $($_.Exception.Message)" 'ERROR'
    if ($_.ScriptStackTrace) {
        Write-Log "Stack: $($_.ScriptStackTrace)" 'ERROR'
    }
    exit 1
}
