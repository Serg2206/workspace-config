# Workspace Config

Оптимальная конфигурация рабочего пространства: Obsidian + Notion + MS 365 + GitHub + Базы данных

## Архитектура

```
Obsidian (локальные заметки) ←→ OneDrive (синхронизация)
    ↓
Notion (команда + проекты) ←→ GitHub (код + версии)
    ↓
Neon (PostgreSQL) + Supabase (auth/storage)
    ↓
MS 365 (Word/VBA + OneDrive)
```

## Компоненты

| Папка | Описание |
|-------|----------|
| `ms365-toolkit/` | PowerShell + VBA автоматизация |
| `obsidian/` | Конфигурация Obsidian vault |
| `notion/` | Notion API интеграции |
| `scripts/` | Интеграционные скрипты |

## Быстрый старт

```powershell
# 1. Установить MS 365 Toolkit
.\ms365-toolkit\Setup-All.ps1

# 2. Настроить Junction для Obsidian
.\scripts\Setup-ObsidianSync.ps1

# 3. Зарегистрировать задачи Task Scheduler
.\scripts\Register-AllTasks.ps1
```

## Ссылки

- [Notion: Research Projects](https://app.notion.com)
- [Notion: Integration Tasks](https://app.notion.com)
- [Neon DB Console](https://console.neon.tech)
