# Blog API

A small full-stack blog with **JWT auth**, **public read** access, and **owner-only** create / edit / delete. The backend is a tiny Express + MongoDB API; the frontend is a Next.js 14 (App Router) app.

- **Live frontend:** *blog-api-kappa-sepia.vercel.app*  ← replace with your Vercel URL
- **Live backend:** *https://blog-api-mvob.onrender.com*  ← replace with your Render URL

---

## Table of contents

- [Stack](#stack)
- [Repo layout](#repo-layout)
- [Live demo](#live-demo)
- [API reference](#api-reference)
- [Backend — local setup](#backend--local-setup)
- [Frontend — local setup](#frontend--local-setup)
- [Deployment notes](#deployment-notes)
- [Environment variables](#environment-variables)
- [Project structure](#project-structure)
- [License](#license)

---

## Stack

**Backend** (`backend/`)
- Node.js + Express 5
- MongoDB via Mongoose
- JWT auth (`jsonwebtoken`) with passwords hashed via `bcryptjs`
- CORS enabled for all origins (tighten before going public)

**Frontend** (`frontend/`)
- Next.js 14 (App Router, JavaScript)
- React 18
- Tailwind CSS 3
- JWT stored in `localStorage` (`blog_token`)

---

## Repo layout

```
Blog_API/
├── backend/          # Express + MongoDB API
└── frontend/         # Next.js 14 app
```

---

## Live demo

| Service  | URL                                                              |
| -------- | ---------------------------------------------------------------- |
| Frontend | https://your-frontend.vercel.app                                 |
| Backend  | https://your-backend.onrender.com                                |

Open the frontend URL, click **Register**, create an account, and you can publish / edit / delete posts. Posts are public — anyone can read them.

---

## API reference

Base URL: `https://your-backend.onrender.com`

### Auth

| Method | Path                | Auth   | Body                                     | Response                                    |
| ------ | ------------------- | ------ | ---------------------------------------- | ------------------------------------------- |
| POST   | `/auth/register`    | Public | `{ name, email, password }`              | `{ token, user }`                           |
| POST   | `/auth/login`       | Public | `{ email, password }`                    | `{ token, user }`                           |

### Blogs

| Method | Path           | Auth        | Body                | Response                  |
| ------ | -------------- | ----------- | ------------------- | ------------------------- |
| GET    | `/blogs`       | Public      | —                   | `Blog[]`                  |
| GET    | `/blogs/:id`   | Public      | —                   | `Blog`                    |
| POST   | `/blogs`       | Bearer JWT  | `{ title, content }`| `Blog`                    |
| PUT    | `/blogs/:id`   | Bearer JWT (owner) | `{ title, content }` | `Blog`              |
| DELETE | `/blogs/:id`   | Bearer JWT (owner) | —               | `204 No Content`          |

### Profile

| Method | Path        | Auth       | Response                       |
| ------ | ----------- | ---------- | ------------------------------ |
| GET    | `/profile`  | Bearer JWT | `{ message, user: { id } }`    |

Authenticated requests send `Authorization: Bearer <token>`. The frontend's `lib/api.js` does this for you.

---

## Backend — local setup

Requirements: **Node 18+** and a **MongoDB** connection string (local or Atlas).

```bash
cd backend
npm install
```

Create `backend/.env`:

```env
PORT=3000
MONGO_URI=mongodb://127.0.0.1:27017/blog_api
JWT_SECRET=replace-me-with-a-long-random-string
```

Run the dev server:

```bash
npm run dev          # nodemon
# or
npm start            # plain node
```

The API listens on `http://localhost:3000` by default.

Quick smoke test:

```bash
curl http://localhost:3000/blogs
```

---

## Frontend — local setup

Requirements: **Node 18+**.

```bash
cd frontend
npm install
```

Create `frontend/.env.local`:

```env
NEXT_PUBLIC_API_URL=http://localhost:3000
```

> Next.js only exposes env vars to the browser if they're prefixed with `NEXT_PUBLIC_`. This is what `lib/api.js` reads.

Run the dev server:

```bash
npm run dev          # http://localhost:3001
```

`3001` is used so the backend (on `3000`) and frontend don't collide. The Vercel deploy uses Next.js defaults, not these scripts.

### Frontend pages

| Route             | Description                  | Auth          |
| ----------------- | ---------------------------- | ------------- |
| `/`               | List of all posts            | Public        |
| `/blogs/:id`      | View a single post           | Public        |
| `/blogs/new`      | Create a post                | Required      |
| `/blogs/:id/edit` | Edit a post                  | Owner         |
| `/login`          | Log in                       | Public        |
| `/register`       | Register                     | Public        |
| `/profile`        | View profile (`/profile`)    | Required      |

---

## Deployment notes

### Backend (Render)

- **Root Directory:** `backend`
- **Build Command:** `npm install`
- **Start Command:** `npm start`
- **Environment:** `PORT` (Render sets this), `MONGO_URI`, `JWT_SECRET`
- Free-tier services sleep after ~15 min of inactivity, so the first request can take 30–60s.

### Frontend (Vercel)

- **Root Directory:** `frontend`
- **Framework Preset:** Next.js (auto-detected)
- **Environment Variables:** `NEXT_PUBLIC_API_URL = https://your-backend.onrender.com`
- No `vercel.json` is required.

### CORS

`backend/server.js` calls `app.use(cors())` with no options, so all origins are allowed. Before going public, replace it with a whitelist of your Vercel domain:

```js
app.use(cors({
  origin: ['https://your-frontend.vercel.app']
}));
```

---

## Environment variables

### Backend (`backend/.env`)

| Key          | Required | Example                                          | Notes                                      |
| ------------ | -------- | ------------------------------------------------ | ------------------------------------------ |
| `PORT`       | Yes      | `3000`                                           | Render sets this automatically             |
| `MONGO_URI`  | Yes      | `mongodb+srv://user:pass@cluster.mongodb.net/db` | Local or Atlas connection string           |
| `JWT_SECRET` | Yes      | `a-long-random-string`                           | Used to sign and verify auth tokens        |

### Frontend (`frontend/.env.local`)

| Key                  | Required | Example                              | Notes                              |
| -------------------- | -------- | ------------------------------------ | ---------------------------------- |
| `NEXT_PUBLIC_API_URL`| Yes      | `https://your-backend.onrender.com`  | Must start with `NEXT_PUBLIC_`     |

Both `.env` files are listed in `.gitignore` — never commit secrets.

---

## Project structure

```
Blog_API/
├── backend/
│   ├── config/db.js              # Mongoose connection
│   ├── controllers/
│   │   ├── authController.js      # register, login
│   │   └── blogController.js      # CRUD
│   ├── middleware/
│   │   └── authMiddleware.js      # JWT verification
│   ├── models/
│   │   ├── blog.js
│   │   └── user.js
│   ├── routes/
│   │   ├── authRoutes.js          # /auth/*
│   │   └── blogRoutes.js          # /blogs/*
│   ├── server.js
│   └── package.json
└── frontend/
    ├── app/
    │   ├── layout.js              # AuthProvider, Navbar
    │   ├── page.js                # Home (post list)
    │   ├── login/page.js
    │   ├── register/page.js
    │   ├── profile/page.js
    │   ├── globals.css
    │   └── blogs/
    │       ├── new/page.js
    │       └── [id]/
    │           ├── page.js
    │           └── edit/page.js
    ├── components/
    │   ├── Navbar.js
    │   ├── ProtectedRoute.js
    │   ├── AuthShell.js
    │   ├── BlogCard.js
    │   └── BlogForm.js
    ├── context/
    │   └── AuthContext.js
    ├── lib/
    │   └── api.js                 # fetch wrapper + auth/blog/user helpers
    ├── next.config.js
    ├── tailwind.config.js
    ├── postcss.config.js
    ├── jsconfig.json              # @/* path alias
    └── package.json
```

---

## License

MIT — do whatever you like.
