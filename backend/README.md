# Ephemeral Chat Backend

Socket.IO server for real-time chat with auto-expiring messages.

## Features
- Real-time messaging with Socket.IO
- Auto-expiring messages (5 minutes)
- Guest user system with random IDs
- CORS configuration for frontend connection

## Deployment to Railway

1. Create new project on Railway
2. Connect this backend folder/repo
3. Set environment variables:
   - `ALLOWED_ORIGINS`: Your frontend domain (e.g., https://your-app.vercel.app)
4. Railway will automatically deploy using `npm start`

## Local Development

```bash
npm install
npm run dev
```

Server runs on port 3001 (or PORT environment variable).

## Environment Variables

- `PORT`: Server port (Railway sets automatically)
- `ALLOWED_ORIGINS`: Comma-separated list of allowed frontend domains
- `NODE_ENV`: Set to 'production' for production deployment