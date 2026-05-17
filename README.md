# Electropathy Reference — MERN App

A disease reference app for Electropathy students. List diseases, view formula, symptoms, things to avoid, dosage, and add personal notes.

## Requirements

- Node.js (v18+)
- MongoDB (local install or free Atlas account)

## Setup & Run

### 1. Backend

```bash
cd backend
cp .env.example .env
# Edit .env and set your MONGO_URI
npm install
npm run dev
```

Backend runs on http://localhost:5000

### 2. Frontend

```bash
cd frontend
npm install
npm start
```

Frontend runs on http://localhost:3000

## Folder Structure

```
electropathy/
  backend/
    models/       — Mongoose schemas (Disease, Category, Note)
    routes/       — Express API routes
    server.js     — Entry point
    .env.example  — Environment variables template
  frontend/
    src/
      components/ — Sidebar, DiseaseDetail, DiseaseForm
      pages/      — DashboardPage
      App.js
```

## API Endpoints

| Method | Route | Description |
|--------|-------|-------------|
| GET | /api/diseases | List all diseases |
| POST | /api/diseases | Add new disease |
| PUT | /api/diseases/:id | Update disease |
| DELETE | /api/diseases/:id | Delete disease |
| GET | /api/categories | List categories |
| POST | /api/categories | Add category |
| DELETE | /api/categories/:id | Remove category |
| GET | /api/notes | Get all notes |
| POST | /api/notes/:diseaseId | Save/update note |
