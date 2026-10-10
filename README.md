# Synapse AI — Personal Digital Brain

A full-stack AI memory workspace with authentication, chat, document upload, project tracking, memory search, and Gemini 2.5 Flash integration.

## Tech Stack
- Frontend: React + Vite + TailwindCSS + Framer Motion + Recharts + React Router
- Backend: Node.js + Express + MongoDB + JWT Auth
- AI: Gemini API

## 1. Setup

```bash
cd synapse-ai
npm install
npm run install:all
```

## 2. Backend Environment

Create `backend/.env`:

```env
PORT=5000
MONGO_URI=mongodb+srv://YOUR_USERNAME:YOUR_PASSWORD@YOUR_CLUSTER.mongodb.net/synapse_ai
JWT_SECRET=replace_with_a_long_random_secret
GEMINI_API_KEY=your_gemini_2_5_flash_api_key
CLIENT_URL=http://localhost:5173
```

## 3. Frontend Environment

Create `frontend/.env`:

```env
VITE_API_URL=http://localhost:5000/api
```

## 4. Run Locally

```bash
npm run dev
```

Frontend: http://localhost:5173  
Backend: http://localhost:5000

## 5. Deploy

### Backend
Deploy `backend` to Render/Railway. Add environment variables from `backend/.env`.

### Frontend
Deploy `frontend` to Vercel. Add:

```env
VITE_API_URL=https://your-backend-url.com/api
```

## Important
This project uses MongoDB Atlas. Create a free cluster, allow network access, create a database user, and paste the connection string into `MONGO_URI`.
