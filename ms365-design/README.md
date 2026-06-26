# MS 365 Design System — Современная дизайн-система для Office

## Шрифты (9 профессиональных семейств)

| Шрифт | Класс | Назначение |
|-------|-------|------------|
| **Montserrat** | Sans-serif | Заголовки, презентации |
| **Inter** | Sans-serif | UI, подписи, слайды |
| **Merriweather** | Serif | Основной текст статей |
| **Crimson Text** | Serif | Цитаты, выделенный текст |
| **Source Code Pro** | Monospace | Код, данные |
| **Playfair Display** | Serif | Титульные слайды |

## Шаблоны

### Word — Academic-Modern.dotx
- **Title**: Montserrat 28pt Bold, центрирование
- **Heading 1-4**: Иерархия с Deep Indigo
- **Normal**: Merriweather 11pt, 1.5 интервал
- **Quote**: Crimson Text Italic
- **Caption**: Montserrat 9pt Italic
- **Reference**: Merriweather 10pt, висячий отступ
- **Abstract**: Merriweather 10.5pt Italic

### PowerPoint — Conference-Pro.potx
8 типов слайдов: Title, Section Divider, Content, Two-Column, Data/Chart, Image+Text, References, Thank You

## Быстрая установка
```powershell
# 1. Шрифты (от администратора)
.\install\Install-Fonts.ps1

# 2. Шаблоны
.\install\Install-Templates.ps1

# 3. Перезапустить Word / PowerPoint
```
