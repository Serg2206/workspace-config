#requires -Version 5.1
#requires -RunAsAdministrator
<#
.SYNOPSIS
    Установка современных шрифтов для MS 365.
.DESCRIPTION
    Скачивает и устанавливает 9 профессиональных шрифтов.
    Шрифты устанавливаются в C:\Windows\Fonts и регистрируются в реестре.
#>
param([string]$FontsDir = (Join-Path $PSScriptRoot "..\fonts"), [switch]$DownloadOnly)
# Полный скрипт см. в архиве
Write-Host "MS 365 Design System — Font Installer" -ForegroundColor Cyan
Write-Host "Fonts dir: $FontsDir" -ForegroundColor Gray
