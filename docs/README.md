# 🎬 RecApp Backend API

## 🚀 Технологічний стек (Tech Stack)

Проєкт побудований з використанням таких технологій

* **Core:** Node.js, Express.js
* **Database:** MongoDB, Mongoose
* **Authentication:** JWT (JSON Web Tokens), Passport.js (Google OAuth 2.0)
* **Real-time:** Socket.IO
* **Caching & Optimization:** Redis (для кешування запитів до зовнішніх API)
* **Security:** Helmet, Express Rate Limit, Data Sanitization (NoSQL injection & XSS protection), CORS
* **Documentation:** Swagger UI (OpenAPI 3.0)
* **External APIs:** TMDB API (The Movie Database), SendGrid / Mailtrap (для email-розсилок)

---

## 🗄️ Архітектура бази даних (ER-діаграма)
Система побудована на реляційній логіці в рамках NoSQL бази даних MongoDB з використанням проміжних колекцій (зв'язуючих таблиць) для забезпечення консистентності даних.

![RecApp Database Schema](./recapp.drawio.png)

---

## 📚 API Документація (Swagger)
У проєкті реалізована інтерактивна документація всіх ендпоінтів за допомогою Swagger UI.
Після успішного запуску сервера локально, ви можете переглянути документацію, протестувати запити та ознайомитися зі схемами даних, перейшовши у браузері за адресою:

👉 http://localhost:3000/api-docs

---

## ⚙️ Змінні оточення (Environment Variables)

Для коректної роботи бекенду вам необхідно створити файл `.env` у кореневій папці проєкту та додати туди ваші власні ключі та налаштування. 

Для зручності в репозиторії є файл `.env.example`. Скопіюйте його вміст у ваш `.env` та заповніть своїми даними:

```env
# ==========================================
# APP CONFIGURATION
# ==========================================
NODE_ENV=development
PORT=3000
ORIGIN_URL=http://localhost:5173

# ==========================================
# DATABASE (MongoDB)
# ==========================================
DATABASE=mongodb+srv://<USER>:<PASSWORD>@cluster0.5zp63lm.mongodb.net/?appName=Cluster0
DATABASE_PASSWORD=<PASSWORD>
DATABASE_LOCAL=mongodb://localhost:27017/recapp

# ==========================================
# AUTHENTICATION & JWT
# ==========================================
JWT_SECRET=<YOUR_JWT_SECRET>
JWT_EXPIRES_IN=90d
JWT_COOKIE_EXPIRES_IN=90

# ==========================================
# GOOGLE OAUTH 2.0
# ==========================================
GOOGLE_CLIENT_ID=<YOUR_GOOGLE_CLIENT_ID>
GOOGLE_CLIENT_SECRET=<YOUR_GOOGLE_CLIENT_SECRET>
CALLBACK_URL=http://localhost:3000/api/v1/users/auth/google/callback

# ==========================================
# TMDB API (The Movie Database)
# ==========================================
TMDB_API_KEY=<YOUR_TMDB_API_KEY>
TMDB_ACCESS_TOKEN=<YOUR_TMDB_ACCESS_TOKEN>
TMDB_BASIC_URL=https://api.themoviedb.org/3/

# ==========================================
# EMAIL (Development - Mailtrap)
# ==========================================
EMAIL_USERNAME=<YOUR_EMAIL_USERNAME>
EMAIL_PASSWORD=<YOUR_EMAIL_PASSWORD>
EMAIL_HOST=sandbox.smtp.mailtrap.io
EMAIL_PORT=2525
MAILTRAP_TOKEN=<YOUR_MAILTRAP_TOKEN>
EMAIL_FROM=<YOUR_EMAIL_FROM>

# ==========================================
# EMAIL (Production - SendGrid)
# ==========================================
SENDGRID_RESET_CODE=<YOUR_SENDGRID_RESET_CODE>
SENDGRID_USERNAME=apikey
SENDGRID_PASSWORD=<YOUR_SENDGRID_PASSWORD>
