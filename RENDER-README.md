# Render Deployment Guide

## Service Settings:
- **Service Type**: Web Service
- **Runtime**: Node.js
- **Build Command**: `npm install`
- **Start Command**: `npm start`

## Environment Variables:
```
NODE_ENV=production
PORT=10000
```

## Advanced Settings:
- **Region**: Any (closest to your users)
- **Instance Type**: Free tier works, upgrade for better performance
- **Health Check Path**: `/allow` (returns 200 OK)

## Why This Works:
- ✅ **Full Node.js runtime** - Runs your Fastify server
- ✅ **Persistent connections** - WebSocket support for WISP
- ✅ **Port flexibility** - Uses $PORT environment variable
- ✅ **Auto-scaling** - Handles traffic spikes
- ✅ **Free tier available** - Good for testing

## Deployment Steps:
1. Connect your GitHub repo to Render
2. Create new Web Service
3. Use settings above
4. Deploy!

Your UV/SJ proxies will work perfectly on Render since it supports full server functionality.