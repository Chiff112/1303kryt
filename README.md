# Vita Juice — Vue 3

Лендинг сети фреш-баров «Vita Juice».
Стек: **Vue 3 + Vite**, без сторонних UI-фреймворков и внешних API.

## Запуск

```bash
npm install
npm run dev
```

Сайт будет доступен на http://localhost:5173

## Сборка

```bash
npm run build      # production-сборка в /dist
npm run preview    # локальный предпросмотр /dist
```

## Структура

```
public/
├── data/
│   └── content.json        — все данные (категории, товары, навигация и т.д.)
└── images/                  — изображения из дизайна

src/
├── assets/styles/main.css   — CSS-переменные, ресет, утилиты
├── composables/
│   └── useContent.js        — fetch-загрузчик content.json (кешируется)
├── components/
│   ├── ui/                  — переиспользуемые: BaseContainer, IconButton, LogoMark
│   ├── layout/              — AppHeader (далее: AppFooter)
│   └── sections/            — секции главной (будут добавляться по шагам)
├── views/
│   └── HomeView.vue
├── App.vue
└── main.js
```

## Прогресс по секциям

- [x] Шаг 1 — шапка (AppHeader) c адаптивным меню
- [x] Шаг 2 — герой-слайдер «Арбузные дольки»
- [x] Шаг 3 — секция «Наша продукция» (категории)
- [x] Шаг 4 — «Хиты продаж» (слайдер карточек товаров)
- [x] Шаг 5 — «Доставка и оплата»
- [x] Шаг 6 — «Наша система лояльности»
- [x] Шаг 7 — футер + «Присоединяйтесь к Vita Juice»
