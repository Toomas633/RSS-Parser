# RSS Parser

RSS feed manager with a TypeScript/Express API and a Vue 3 + Vite frontend.

## Features

- Manage RSS feeds and per-feed filters
- Test fetch and filter output
- Swagger API docs
- Version check against a remote repo

## Tech Stack

- Backend: Node.js, Express, TypeScript
- Frontend: Vue 3, Vite, Vuetify

## Project Structure

- backend/ — API server
- frontend/ — web UI
- version — current app version used by the frontend

## Environment Variables

### Backend

Create [backend/.env](backend/.env) from [backend/.env.example](backend/.env.example).

Required:

- API_KEY — API key expected in the X-Api-Key request header

### Frontend

Create [frontend/.env](frontend/.env) from [frontend/.env.example](frontend/.env.example).

Required:

- VITE_API_URL — API base URL (e.g. http://localhost:3000/api)
- VITE_API_KEY — API key sent in requests
- VITE_REPO_URL — base URL that serves the /version file
- VITE_VERSION — current app version displayed in the header

## Setup

### Install dependencies

- Backend: npm install (in backend/)
- Frontend: npm install (in frontend/)

### Run in development

Option 1:
- Backend: npm run dev (in backend/)
- Frontend: npm run dev (in frontend/)

Option 2 (Windows):
- Run dev.bat from the repo root

The API runs on http://localhost:3000/api and Swagger docs are available at http://localhost:3000/api-docs.

## Build

- Backend: npm run build, then npm start
- Frontend: npm run build, then npm run preview

## Data Storage

On first run, the backend creates backend/data/feeds.json and backend/data/filters.json.
