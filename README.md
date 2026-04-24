# GalaxyV6

[![Deploy to Render](https://render.com/images/deploy-to-render-button.svg)](https://render.com/deploy?repo=https://github.com/Reddisred/reddisred.github.io)

A modern web proxy application built with Node.js, featuring Scramjet and Ultraviolet proxy engines for enhanced browsing capabilities.

## Features

- 🚀 **Fastify Server** - High-performance Node.js web framework
- 🛡️ **Scramjet Proxy** - Advanced proxy engine with content rewriting
- 🌐 **Ultraviolet Proxy** - Lightweight proxy solution
- 🔧 **WebSocket Support** - Real-time proxy connections via WISP
- 📱 **Responsive UI** - Modern web interface
- ⚡ **Auto-deployment** - GitHub Actions and Render support

## Quick Deploy

Click the "Deploy to Render" button above to instantly deploy your own instance!

## Local Development

### Prerequisites

- Node.js 22+
- npm or pnpm

### Installation

```bash
# Clone the repository
git clone https://github.com/Reddisred/reddisred.github.io.git
cd reddisred.github.io

# Install dependencies
npm install

# Start development server
npm run dev
```

### Available Scripts

- `npm start` - Start production server
- `npm run dev` - Start development with hot reload
- `npm run start-server` - Start server with file watching
- `npm test` - Run deployment tests

## Deployment

### Render (Recommended)

1. Click the "Deploy to Render" button
2. Connect your GitHub account
3. Deploy automatically

### Manual Deployment

The app supports deployment to any Node.js hosting platform:

- **Vercel**: `vercel --prod`
- **Railway**: Connect GitHub repo
- **Fly.io**: `fly launch`
- **Heroku**: `git push heroku main`

## Architecture

- **Frontend**: HTML/CSS/JavaScript with GSAP animations
- **Backend**: Fastify server with ES modules
- **Proxy Engines**:
  - Scramjet - Advanced content rewriting
  - Ultraviolet - Lightweight proxying
- **WebSocket**: WISP protocol for real-time connections

## API Endpoints

- `GET /` - Main application
- `GET /health` - Health check
- `GET /scramjet/*` - Scramjet proxy routes
- `GET /uv/*` - Ultraviolet proxy routes
- `POST /report-bug` - Bug reporting

## Configuration

Environment variables:

- `PORT` - Server port (auto-assigned on Render)
- `NODE_ENV` - Environment (production/development)
- `WEBHOOK` - Discord webhook for bug reports

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test locally
5. Submit a pull request

## License

ISC License - see LICENSE file for details

## Support

For issues and questions:
- Create an issue on GitHub
- Check the health endpoint: `/health`
- Use the in-app bug reporter