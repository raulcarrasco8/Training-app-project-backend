# 🏋️ Training App — Backend (API)

REST API built with Node.js, Express and MongoDB to manage users, disciplines and workouts. Every user only sees and manages their own data. It powers the [Training App frontend](https://github.com/raulcarrasco8/Training-app-project-frontend).

**🔗 Live API:** https://training-app-project-backend.onrender.com
**🖥️ Live app:** https://app-training.vercel.app/ (click **Try the demo** to log in with sample data)
**⚙️ Frontend repo:** [Training App Frontend](https://github.com/raulcarrasco8/Training-app-project-frontend)

---

## ✨ Features

- Sign up and log in with JWT authentication
- Per-user data: disciplines and workouts belong to their owner and are invisible to other users
- 7 default disciplines (Running, Cycling, Swimming, Gym, Yoga, CrossFit, Hyrox) created for every new user
- Full CRUD for disciplines and workouts
- Deleting a discipline that still has workouts is blocked, so no workout is left without a discipline
- Consistent error responses with the right HTTP status codes
- Demo user with realistic sample data, created or reset with one command

## 🛠️ Tech stack

| Area | Technologies |
|---|---|
| Runtime & framework | Node.js, Express 5 |
| Database | MongoDB Atlas + Mongoose |
| Auth | JSON Web Tokens (`express-jwt`, `jsonwebtoken`), bcrypt |
| Deployment | Render (API), UptimeRobot (health checks) |
| API testing | Postman |

## 📚 API endpoints

All `/api` routes except `/api/health` require a JWT in the `Authorization` header:

```
Authorization: Bearer <your_token>
```

### 🔐 Auth

| Method | Endpoint | Description | Auth |
|---|---|---|---|
| POST | `/auth/signup` | Register a new user (and create their default disciplines) | — |
| POST | `/auth/login` | Log in and receive a JWT | — |
| GET | `/auth/verify` | Verify the current token | 🔒 |

### 🏁 Disciplines

| Method | Endpoint | Description | Auth |
|---|---|---|---|
| GET | `/api/disciplines` | Get the user's disciplines | 🔒 |
| POST | `/api/disciplines` | Create a discipline | 🔒 |
| PUT | `/api/disciplines/:disciplineId` | Update a discipline (partial updates allowed) | 🔒 |
| DELETE | `/api/disciplines/:disciplineId` | Delete a discipline (`409` if it still has workouts) | 🔒 |

### 💪 Workouts

| Method | Endpoint | Description | Auth |
|---|---|---|---|
| GET | `/api/workouts` | Get the user's workouts (optional filter: `?discipline=<id>`) | 🔒 |
| GET | `/api/workouts/:workoutId` | Get a workout by ID | 🔒 |
| POST | `/api/workouts` | Create a workout (the discipline must belong to the user) | 🔒 |
| PUT | `/api/workouts/:workoutId` | Update a workout | 🔒 |
| DELETE | `/api/workouts/:workoutId` | Delete a workout | 🔒 |

### 🩺 Health

| Method | Endpoint | Description | Auth |
|---|---|---|---|
| GET | `/api/health` | Checks that the API and the MongoDB connection are up | — |

### ⚠️ Error responses

Errors always return JSON with a `message` field.

| Status | When |
|---|---|
| `400` | Invalid ID, invalid JSON body or validation error (e.g. empty name) |
| `401` | Missing, invalid or expired token (`"Session expired. Please log in again"`) |
| `404` | The resource doesn't exist **or belongs to another user** |
| `409` | Deleting a discipline that still has workouts (includes `workoutCount`) |
| `500` | Unexpected server error |

## 🧠 Technical decisions

- **JWT authentication:** stateless auth that fits a separate frontend and API. The server doesn't store sessions, and an `express-jwt` middleware protects every private router.
- **Data ownership:** each discipline and workout stores an `owner`, and every query filters by the user in the token. Requests for another user's data return `404` instead of `403`, so the API doesn't reveal that the resource exists.
- **Whitelisted fields:** create and update routes only copy the allowed fields from the request body. The `owner` always comes from the token, so clients can't set `_id` or `owner` themselves.
- **Referential integrity:** a workout can only use one of the user's own disciplines, and a discipline with workouts can't be deleted (`409 Conflict`). This avoids workouts pointing to a discipline that no longer exists.
- **Secure password handling:** passwords are hashed with bcrypt and never returned in any response. Signup validates email format and password strength (min. 6 characters, with uppercase, lowercase and a number).
- **Short-lived tokens:** JWTs are signed with HS256 and expire after 6 hours. The API returns a specific `401` message for expired tokens so the frontend can log the user out.
- **Centralized error handling:** one error handler maps JWT, JSON parsing and Mongoose errors to the right status code. Client errors are logged in one line; full stack traces are only logged for `500`s.
- **Configurable CORS:** `ORIGIN` accepts several comma-separated URLs, so the same code works for local development and production.
- **Fail fast on startup:** if MongoDB can't be reached when the server starts, the process exits instead of running without a database (on Render, this triggers an automatic restart).
- **Default data and demo seed:** new users get 7 ready-made disciplines, and a seed script creates a demo user so the live app can be tried without signing up.

## 🔮 What I'd improve today

- [ ] Add tests with Jest + Supertest
- [ ] Set up CI with GitHub Actions
- [ ] Migrate to TypeScript
- [ ] Validate request bodies with a schema library (e.g. Zod) instead of relying only on Mongoose validation
- [ ] Add rate limiting to the auth routes

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
# One or more allowed frontend URLs, separated by commas
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

5. *(Optional)* Create or reset the demo user with sample data

```bash
npm run seed:demo
```

This creates `demo@trainingapp.dev` / `Demo1234` with 7 disciplines and 12 workouts. Running it again resets the demo data without touching other users.

## 📂 Project structure

```
├── config/           # Express middlewares (CORS, JSON, logger)
├── data/             # Default disciplines for new users
├── db/               # MongoDB connection
├── error-handling/   # 404 and centralized error handler
├── middleware/       # JWT authentication
├── models/           # Mongoose models: User, Discipline, Workout
├── routes/           # Auth, disciplines, workouts and health routes
├── scripts/          # Demo data seed
├── app.js
└── server.js
```

## 👨‍💻 Author

**Raúl Carrasco** — [LinkedIn](https://www.linkedin.com/in/raul-webdeveloper/) · [GitHub](https://github.com/raulcarrasco8)
