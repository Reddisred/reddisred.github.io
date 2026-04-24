# Netlify Deployment Notes

## What Works on Netlify:
- ✅ Static HTML pages (onboarding, settings, etc.)
- ✅ Basic routing to proxy pages (`/scramjet/*` → `/a/index.html`)
- ✅ Simple API endpoints (`/api/allow`, `/api/report-bug`)

## What WON'T Work on Netlify:
- ❌ **WebSocket proxying** (WISP server connections)
- ❌ **Real-time proxy functionality** (UV/SJ client ↔ server communication)
- ❌ **Bare server routing** (`/baremux/`, `/epoxy/`, `/wisp/`)
- ❌ **Server-side request handling**

## Why UV/SJ Proxies Need Full Server:

Your proxies require:
1. **WebSocket upgrades** for real-time proxying
2. **Server-side routing** with Node.js
3. **Bare server** for handling proxy requests
4. **WISP protocol** for tunneling

## Recommended Solutions:

### 1. Vercel (Easiest)
```bash
npm i -g vercel
vercel --prod
```

### 2. Railway (Best for Node.js)
- Connect GitHub repo
- Auto-deploys with full Node.js support

### 3. Render
- Free tier available
- Full Node.js server support

### 4. Fly.io
- Great performance
- Full server control

## Current Netlify Setup:
- Static files served from `public/`
- Basic redirects for `/scramjet/*` and `/uv/*`
- Simple API functions for basic endpoints
- **Proxy functionality will NOT work**