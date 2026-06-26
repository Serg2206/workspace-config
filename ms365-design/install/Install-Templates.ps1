#requires -Version 5.1
<#
.SYNOPSIS
    Установка шаблонов Word и PowerPoint.
.DESCRIPTION
    Копирует .dotx и .potx в папки шаблонов Office.
    Word: File → New → Personal
    PowerPoint: File → New → Custom
#>
param([string]$TemplatesDir = (Join-Path $PSScriptRoot "..\templates"), [switch]$OpenSamples)
Write-Host "MS 365 Design System — Template Installer" -ForegroundColor Cyan
Write-Host "Templates: $TemplatesDir" -ForegroundColor Gray
