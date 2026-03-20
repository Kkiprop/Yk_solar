# Yk Solarworks

MERN landing page and admin content manager for a solar installation company.

## Stack

- MongoDB
- Express
- React + Vite
- Node.js

## Project structure

- `client` - landing page and admin UI
- `server` - Express API and MongoDB models

## Environment setup

1. Copy `server/.env.example` to `server/.env`
2. Add your MongoDB connection string to `MONGODB_URI`
3. Set `MONGODB_DB_NAME` to the database your MongoDB user can access, for example `YK_Solar`
4. Adjust `CLIENT_URL` if the frontend runs on a different origin

Optional frontend override:

1. Copy `client/.env.example` to `client/.env`
2. Set `VITE_API_URL` if you do not want to use the Vite proxy

## Install

```bash
npm install
```

## Run locally

From the project root:

```bash
npm run dev
```

This starts:

- API: `http://localhost:5000`
- Frontend: `http://localhost:5173`
- Admin page: `http://localhost:5173/admin`

## Deploy on Vercel

This repository can be deployed as a single Vercel project:

- `client` builds to a static Vite site
- `api/[...path].js` serves the Express API as a Vercel Function

Required Vercel environment variables:

- `MONGODB_URI`
- `MONGODB_DB_NAME`
- `JWT_SECRET`
- `CLIENT_URL` set to your production frontend origin, for example `https://your-project.vercel.app`
- `SMTP_HOST`
- `SMTP_PORT`
- `SMTP_SECURE`
- `SMTP_USER`
- `SMTP_PASS`
- `SMTP_FROM`
- `CONTACT_NOTIFICATION_TO`
- `ADMIN_NAME`
- `ADMIN_EMAIL`
- `ADMIN_PASSWORD`

Notes:

- The root project must be deployed from the repository root so Vercel picks up `vercel.json` and the npm workspaces.
- The frontend uses `/api` by default in production, so `VITE_API_URL` is not required unless you want to call a different backend.
- The `/admin` route is rewritten to `index.html` so the SPA can handle client-side routing.

## API routes

- `GET /api/posts` - public published posts
- `GET /api/admin/posts` - all posts for admin
- `POST /api/admin/posts` - create post
- `PUT /api/admin/posts/:id` - update post
- `DELETE /api/admin/posts/:id` - delete post
