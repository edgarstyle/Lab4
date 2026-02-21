# Web4 Frontend

Frontend приложение для лабораторной работы №4.

## Требования

- Node.js версии 16.x или выше
- npm версии 8.x или выше

## Установка

Если Node.js не установлен, см. инструкцию в `NODEJS_SETUP.md` в корневой папке проекта.

После установки Node.js:

```bash
npm install
```

## Запуск

```bash
npm start
```

Приложение будет доступно на `http://localhost:3000`

## Сборка для production

```bash
npm run build
```

Собранные файлы будут в папке `dist/`

## Конфигурация

Frontend настроен на подключение к backend по адресу:
- Development: `http://localhost:8080/web4/api/*` (через proxy в webpack)
- Production: нужно настроить переменную окружения или изменить `API_URL` в коде

## Структура проекта

```
Web4Frontend/
├── src/
│   ├── components/     # React компоненты
│   │   ├── LoginPage.js
│   │   ├── MainPage.js
│   │   └── Canvas.js
│   ├── store/          # Redux store
│   │   ├── actions/    # Action creators
│   │   └── reducers/   # Reducers
│   ├── App.js          # Главный компонент
│   ├── index.js        # Точка входа
│   └── styles.css      # Стили
├── public/
│   └── index.html      # HTML шаблон
├── webpack.config.js   # Конфигурация Webpack
└── package.json        # Зависимости проекта
```


