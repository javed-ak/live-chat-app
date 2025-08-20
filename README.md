# Ephemeral Chat Application

A real-time chat application where messages automatically disappear after 5 minutes. No signup required - just visit and start chatting!

## Project Structure

```
/
├── backend/          # Node.js + Socket.IO server
│   ├── server.js     # Main server file
│   ├── package.json  # Backend dependencies
│   └── README.md     # Backend deployment guide
│
└── frontend/         # React + Tailwind frontend
    ├── src/          # React components
    ├── package.json  # Frontend dependencies
    ├── vercel.json   # Vercel deployment config
    └── README.md     # Frontend deployment guide
```

## Features

- **Real-time messaging** with Socket.IO
- **Auto-expiring messages** (disappear after 5 minutes)
- **Guest user system** with random IDs (e.g., CoolTiger123)
- **Responsive design** optimized for mobile and desktop
- **No authentication required** - instant access
- **Live user count** showing online users
- **Message expiration indicators** with countdown timers

## Deployment Guide

### 1. Deploy Backend to Railway

1. Go to [railway.app](https://railway.app) and create account
2. Create new project → Deploy from GitHub
3. Select the `backend` folder or create separate repo for backend
4. Railway will auto-deploy using `npm start`
5. Copy your Railway URL (e.g., `https://your-app.up.railway.app`)

### 2. Deploy Frontend to Vercel

1. Go to [vercel.com](https://vercel.com) and create account
2. Import the `frontend` folder or create separate repo for frontend
3. Set environment variable in Vercel dashboard:
   - `VITE_SERVER_URL` = Your Railway backend URL
4. Deploy

### 3. Update CORS (Important!)

After frontend deployment, update backend environment variable:
- In Railway dashboard, set `ALLOWED_ORIGINS` to your Vercel domain

## Local Development

### Start Backend:
```bash
cd backend
npm install
npm run dev
```

### Start Frontend:
```bash
cd frontend
npm install
npm run dev
```

Visit `http://localhost:5173` to use the chat app locally.

## Technology Stack

- **Backend**: Node.js, Express, Socket.IO
- **Frontend**: React, TypeScript, Tailwind CSS, Vite
- **Deployment**: Railway (backend) + Vercel (frontend)
- **Real-time**: WebSocket connections via Socket.IO

## Security Features

- CORS protection
- Environment variable configuration
- Input validation and sanitization
- Rate limiting ready (can be enabled)

---

**Live Demo**: Deploy both parts and your chat app will be live at your Vercel URL!# live-chat-app
