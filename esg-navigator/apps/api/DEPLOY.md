# 🚀 ESG Navigator API - Deployment Guide

## Quick Start

The REST API has been built and is ready for deployment!

### Prerequisites
- Node.js 20+
- npm or yarn
- API keys (Anthropic Claude)

### Build Status
✅ TypeScript compiled successfully
✅ All dependencies installed
✅ Environment configuration ready

---

## Deployment Options

### Option 1: Vercel (Recommended for Quick Deploy)

```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel --prod
```

Or use the deployment script:
```bash
./deploy.sh
# Select option 1
```

**Environment Variables to set in Vercel:**
- `ANTHROPIC_API_KEY` - Your Claude API key
- `JWT_SECRET` - Random 32-character string
- `FRONTEND_URL` - Your frontend URL
- `NODE_ENV` - production

### Option 2: Railway

```bash
# Install Railway CLI
npm i -g @railway/cli

# Login and deploy
railway login
railway up
```

Or use the deployment script:
```bash
./deploy.sh
# Select option 2
```

### Option 3: Render

1. Go to https://dashboard.render.com
2. Create new Web Service
3. Connect your repository
4. Render will automatically detect `render.yaml`
5. Add environment variables in dashboard

Or use the deployment script:
```bash
./deploy.sh
# Select option 3
```

### Option 4: Docker (Local/VPS)

```bash
# Build image
docker build -t esg-navigator-api .

# Run container
docker run -p 8080:8080 --env-file .env esg-navigator-api
```

### Option 5: Local Development

```bash
# Start development server
npm run dev

# Or use built version
npm start
```

---

## Environment Variables

Create a `.env` file in the `apps/api` directory:

```env
# Required
ANTHROPIC_API_KEY=sk-ant-api03-your-key-here
JWT_SECRET=your-32-character-secret-key-here

# Optional
PORT=8080
NODE_ENV=production
FRONTEND_URL=https://www.esgnavigator.ai
```

---

## Testing Deployment

### Health Check
```bash
curl https://your-api-url.com/health
```

Expected response:
```json
{
  "status": "healthy",
  "timestamp": "2024-11-28T01:27:00.000Z",
  "claude": "configured",
  "agents": 9,
  "auth": "enabled",
  "suppliers": 5
}
```

### Test Authentication
```bash
curl -X POST https://your-api-url.com/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "admin@tisholdings.co.za",
    "password": "admin123"
  }'
```

### Test Suppliers Endpoint
```bash
curl https://your-api-url.com/api/suppliers \
  -H "Authorization: Bearer YOUR_TOKEN"
```

---

## API Endpoints

### Public
- `GET /health` - Health check
- `POST /api/auth/login` - User login
- `POST /api/auth/register` - User registration

### Protected (requires JWT token)
- `GET /api/suppliers` - List all suppliers
- `GET /api/suppliers/:id` - Get supplier details
- `POST /api/claude/chat` - Claude AI chat
- `GET /api/agents` - List AI agents
- `POST /api/agents/:agentName` - Run specific agent

---

## Troubleshooting

### Build Errors
```bash
# Clear node_modules and rebuild
rm -rf node_modules dist
npm install
npm run build
```

### Port Already in Use
```bash
# Change PORT in .env file
PORT=5050
```

### Missing Environment Variables
Check `.env` file exists and contains required values:
- ANTHROPIC_API_KEY
- JWT_SECRET

### CORS Issues
Update FRONTEND_URL in `.env` to match your frontend domain.

---

## Production Checklist

- [ ] Environment variables set correctly
- [ ] ANTHROPIC_API_KEY configured
- [ ] JWT_SECRET is strong and random
- [ ] FRONTEND_URL matches your domain
- [ ] Health endpoint returns 200
- [ ] Authentication working
- [ ] CORS configured for your domain
- [ ] SSL/HTTPS enabled
- [ ] Error logging configured
- [ ] Rate limiting enabled (if needed)

---

## Support

- **Documentation**: See main DEPLOYMENT.md
- **Email**: support@tisholdings.co.za
- **Repository**: https://github.com/ramabulanaT/ESG-Navigator-Pro

---

**Built with ❤️ by TIS Holdings**
