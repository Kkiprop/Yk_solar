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

## Vercel deployment

The repository root is configured for Vercel.

- Install command: `npm install`
- Build command: `npm run build`
- Output directory: `client/dist`

The project deploys both the Vite frontend and the Express API from the same Vercel project.

Required Vercel environment variables:

- `MONGODB_URI`
- `MONGODB_DB_NAME`
- `ADMIN_NAME`
- `ADMIN_EMAIL`
- `ADMIN_PASSWORD`
- `JWT_SECRET`
- `CLIENT_URL`

Notes:

- Leave `VITE_API_URL` unset when the frontend and API are deployed together on the same Vercel project.
- On first backend startup, the API seeds or updates the admin account in MongoDB from `ADMIN_EMAIL`, `ADMIN_PASSWORD`, and `ADMIN_NAME`.
- Admin login uses the MongoDB `Admin` collection, not hardcoded frontend credentials.

## API routes

- `GET /api/posts` - public published posts
- `GET /api/admin/posts` - all posts for admin
- `POST /api/admin/posts` - create post
- `PUT /api/admin/posts/:id` - update post
- `DELETE /api/admin/posts/:id` - delete post
