# Blog API — Frontend

A Next.js 14 (App Router) frontend for the Blog API backend.

## Stack

- **Next.js 14** (App Router, JavaScript)
- **React 18**
- **Tailwind CSS 3**
- **JWT auth** stored in `localStorage`

## Setup

From the `frontend/` directory:

```bash
npm install
npm run dev
```

The dev server runs on [http://localhost:3001](http://localhost:3001) by default
(run with `npm run dev -- -p 3001` if port 3000 is taken by the backend).

## Environment

Create `.env.local` (already created for you):

```
NEXT_PUBLIC_API_URL=http://localhost:3000
```

Point this at the backend Express server.

## Pages

| Route                      | Description                          | Auth     |
| -------------------------- | ------------------------------------ | -------- |
| `/`                        | List of all blog posts               | Public   |
| `/blogs/:id`               | View a single post                   | Public   |
| `/blogs/new`               | Create a post                        | Required |
| `/blogs/:id/edit`          | Edit a post                          | Owner    |
| `/login`                   | Login form                           | Public   |
| `/register`                | Register form                        | Public   |
| `/profile`                 | View profile (calls `/profile`)      | Required |

## How auth works

1. The user registers or logs in.
2. The backend returns a JWT (7-day expiry).
3. The token is stored in `localStorage` under the key `blog_token`.
4. `<AuthProvider>` decodes the token to extract the user id and exposes
   `useAuth()` (`{ user, login, register, logout }`).
5. Protected pages are wrapped in `<ProtectedRoute>`, which redirects to
   `/login` if no user is present.
6. The fetch wrapper in `lib/api.js` automatically attaches
   `Authorization: Bearer <token>` when `auth: true` is passed.

## Project structure

```
frontend/
├── app/
│   ├── layout.js            # Root layout, AuthProvider, Navbar
│   ├── page.js              # Home (list of blogs)
│   ├── globals.css          # Tailwind directives
│   ├── login/page.js
│   ├── register/page.js
│   ├── profile/page.js      # Protected
│   └── blogs/
│       ├── [id]/page.js
│       ├── [id]/edit/page.js  # Protected (owner only)
│       └── new/page.js        # Protected
├── components/
│   ├── Navbar.js
│   ├── ProtectedRoute.js
│   ├── BlogCard.js
│   └── BlogForm.js
├── context/
│   └── AuthContext.js
├── lib/
│   └── api.js               # Fetch wrapper + auth/blog/user helpers
├── next.config.js
├── tailwind.config.js
├── postcss.config.js
├── jsconfig.json            # Path alias: @/* -> ./*
└── package.json
```

## Useful scripts

```bash
npm run dev     # Start dev server
npm run build   # Production build
npm run start   # Start production server
npm run lint    # Lint with next lint
```
