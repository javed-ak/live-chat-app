# Ephemeral Chat Frontend

React frontend for real-time chat application with auto-expiring messages.

## Features
- Real-time messaging interface
- Responsive design (mobile-friendly)
- Auto-scrolling chat
- Message expiration indicators
- Guest user identification

## Deployment to Vercel

1. Deploy backend to Railway first
2. Get your Railway backend URL
3. Set environment variable in Vercel:
   - `VITE_SERVER_URL`: Your Railway backend URL
4. Deploy this frontend folder to Vercel

## Local Development

```bash
npm install
npm run dev
```

Make sure the backend server is running on port 3001.

## Environment Variables

- `VITE_SERVER_URL`: Backend server URL (Railway deployment URL)

## Build for Production

```bash
npm run build
```

The `dist` folder will contain the built application ready for deployment.
</btml:action># live-chat-FE
