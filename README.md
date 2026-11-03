# 🏋️ Training App — Backend (API)

REST API built with Node.js, Express and MongoDB to manage users, disciplines and workouts. It powers the [Training App frontend](https://github.com/raulcarrasco8/Training-app-project-frontend).

**🔗 Live API:** https://training-app-project-backend.onrender.com
**🖥️ Live app:** https://app-training.vercel.app/
**⚙️ Frontend repo:** [Training App Frontend](https://github.com/raulcarrasco8/Training-app-project-frontend)

> ⏳ **Heads up:** the API runs on Render's free tier, so the first request may take ~50 seconds while the server wakes up.

---

## 🛠️ Tech stack

| Area | Technologies |
|---|---|
| Runtime & framework | Node.js, Express.js |
| Database | MongoDB Atlas + Mongoose |
| Auth | JSON Web Tokens (JWT), bcrypt |
| Deployment | Render |
| API testing | Postman |

## 📚 API endpoints

### 🔐 Auth

| Method | Endpoint | Description | Auth |
|---|---|---|---|
| POST | `/auth/signup` | Register a new user | — |
| POST | `/auth/login` | Log in and receive a JWT | — |
| GET | `/auth/verify` | Verify the current token | 🔒 |

### 🏁 Disciplines

| Method | Endpoint | Description | Auth |
|---|---|---|---|
| POST | `/api/disciplines` | Create a discipline | 🔒 |
| GET | `/api/disciplines` | Get all disciplines | — |
| DELETE | `/api/disciplines/:disciplineId` | Delete a discipline | 🔒 |

### 💪 Workouts

| Method | Endpoint | Description | Auth |
|---|---|---|---|
| POST | `/api/workouts` | Create a workout | 🔒 |
| GET | `/api/workouts` | Get all workouts (optional filter: `?discipline=<id>`) | — |
| GET | `/api/workouts/:workoutId` | Get a workout by ID | 🔒 |
| PUT | `/api/workouts/:workoutId` | Update a workout | 🔒 |
| DELETE | `/api/workouts/:workoutId` | Delete a workout | 🔒 |

Routes marked with 🔒 are protected by an `express-jwt` middleware and expect the token in the `Authorization` header:

```
Authorization: Bearer <your_token>
```

## 🧠 Technical decisions

- **JWT authentication:** stateless auth that fits a separate frontend and API. The server does not need to store sessions, and an `express-jwt` middleware protects private routes.
- **Secure password handling:** passwords are hashed with bcrypt before being stored and are never returned in any response. Signup validates email format and password strength (min. 6 characters, with uppercase, lowercase and a number).
- **Short-lived tokens:** JWTs are signed with HS256 and expire after 6 hours, limiting the impact of a leaked token.
- **Layered structure:** routes, models, middlewares, config and error handling live in separate folders, so each part has a single responsibility and the codebase is easy to navigate and extend.
- **Centralized error handling:** errors are handled in one place instead of in every route, which keeps responses consistent and the route code clean.
- **CORS restricted by environment variable:** the allowed origin is set in `.env`, so the same code works locally and in production.

## 🔮 What I'd improve today

- [ ] Add tests with Jest + Supertest
- [ ] Set up CI with GitHub Actions
- [ ] Migrate to TypeScript
- [ ] Protect the remaining public `GET` routes and scope data per user (store an `owner` on each discipline and workout, and only return or modify the user's own data)
- [ ] Add input validation on discipline and workout requests
- [ ] Add an endpoint to update disciplines

---

## 🚀 Run it locally

1. Clone the repo

```bash
git clone https://github.com/raulcarrasco8/Training-app-project-backend
cd Training-app-project-backend
```

2. Install dependencies

```bash
npm install
```

3. Create a `.env` file in the project root:

```env
PORT=5005
ORIGIN=http://localhost:5173
MONGODB_URI=your_mongodb_atlas_uri
TOKEN_SECRET=your_jwt_secret
```

To get a MongoDB URI, create a free cluster on [MongoDB Atlas](https://www.mongodb.com/atlas) and copy its connection string.

4. Start the server

```bash
npm run dev
```

The API runs at http://localhost:5005

## 📂 Project structure

```
├── config/
├── db/
├── error-handling/
├── middleware/
├── models/
├── routes/
├── app.js
└── server.js
```

## 👨‍💻 Author

**Raúl Carrasco** — [LinkedIn](https://www.linkedin.com/in/raul-webdeveloper/) · [GitHub](https://github.com/raulcarrasco8)