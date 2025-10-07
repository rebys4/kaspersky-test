# Kaspersky Тестовое задание

Полноценное приложение для управления пользователями и группами.  
Проект состоит из **два микросервиса**:  
- **backend** — API на Fastify + Drizzle ORM + SQLite  
- **frontend** — React + TypeScript + Vite + TailwindCSS  

---

## 🚀 Возможности

1) Просмотр списка пользователей (таблица на Desktop, карточки на Mobile)  
2) Поиск и сортировка по имени / email / дате  
3) Добавление и редактирование пользователя  
4) Привязка пользователей к группам  
5) Адаптивная верстка (TailwindCSS 4 + Vite)  
6) Сервер на Fastify с REST API и SQLite через Drizzle ORM  
7) Скрипты `backup` / `restore` для экспорта и импорта данных

---

## 🧩 Технологический стек

| Слой | Инструменты |
|------|--------------|
| **Frontend** | React 18, TypeScript, Vite, TailwindCSS v4 |
| **Backend** | Node.js 22, Fastify, Drizzle ORM, better-sqlite3 |
| **База данных** | SQLite (встроенная, без внешнего сервера) |
| **Dev Tools** | ESLint, Prettier, TSX, Nodemon |
| **Скрипты** | `seed.ts`, `backup.ts`, `restore.ts` |
| **AI-помощь** | Проект создан с использованием ChatGPT (GPT-5) для генерации структуры, стилей и тестовых данных |

---

## 📂 Структура проекта

```

kaspersky/
├── backend/
│   ├── src/
│   │   ├── db/
│   │   │   ├── schema.ts
│   │   │   ├── migrate.ts
│   │   │   └── seed.ts
│   │   ├── routes/
│   │   │   └── users.ts
│   │   └── server.ts
│   ├── drizzle.config.ts
│   └── package.json
│
├── frontend/
│   ├── src/
│   │   ├── pages/
│   │   │   ├── UsersList.tsx
│   │   │   └── UserPage.tsx
│   │   ├── main.tsx
│   │   ├── index.css
│   │   └── App.tsx
│   ├── tailwind.config.js
│   ├── postcss.config.js
│   └── package.json
│
├── scripts/
│   ├── backup.ts
│   └── restore.ts
└── README.md

````

---

## ⚙️ Установка и запуск

### 1. Склонируйте репозиторий
```bash
git clone https://github.com/<your-username>/kaspersky.git
cd kaspersky
````

### 2. Установите зависимости

```bash
npm install
cd backend && npm install
cd ../frontend && npm install
```

### 3. Сгенерируйте базу данных и тестовые данные

```bash
npm run db:gen        
npm run db:migrate    
npm run seed          
```

### 4. Запустите сервер и фронт в двух терминалах:

Первый терминал
```bash
npm run dev:api
```
Второй терминал
```bash
cd frontend
npm run dev
```

---

## 🗄️ Backup и Restore

### Создать резервную копию данных

```bash
npm run backup
```

### Восстановить данные из backup.jsonl

```bash
npm run restore
```

---

## 🔗 API endpoints

| Метод    | URL              | Описание                                                   |
| -------- | ---------------- | ---------------------------------------------------------- |
| `GET`    | `/api/users`     | Получить список пользователей (с фильтрацией и пагинацией) |
| `GET`    | `/api/users/:id` | Получить данные конкретного пользователя                   |
| `POST`   | `/api/users`     | Добавить нового пользователя                               |
| `PATCH`  | `/api/users/:id` | Изменить данные пользователя                               |
| `DELETE` | `/api/users/:id` | Удалить пользователя                                       |
| `GET`    | `/api/groups`    | Получить список групп                                      |


---

## 🧠 Использованные инструменты и AI

* **AI-помощь:** ChatGPT (GPT-5) помог при:

  * генерации архитектуры проекта
  * написании UI-компонентов
  * создании схем БД и миграций
  * оформлении адаптивных стилей
  * создании документации (этого README)

---

## 🧰 Полезные команды

| Команда              | Описание                             |
| -------------------- | ------------------------------------ |
| `npm run dev:api`    | Запуск backend (Fastify + SQLite)    |
| `npm run dev:web`    | Запуск frontend (Vite)               |
| `npm run db:gen`     | Генерация миграций                   |
| `npm run db:migrate` | Применение миграций                  |
| `npm run seed`       | Заполнение БД тестовыми данными      |
| `npm run backup`     | Экспорт пользователей в backup.jsonl |
| `npm run restore`    | Импорт из backup.jsonl               |

---
