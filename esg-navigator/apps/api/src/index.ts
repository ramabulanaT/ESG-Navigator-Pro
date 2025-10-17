import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import cookieParser from 'cookie-parser';
import claudeRoutes from './routes/claude.routes';
import agentRoutes from './routes/agents.routes';
import authRoutes from './routes/auth.routes';
import supplierRoutes from './routes/suppliers.routes';
import { authenticate } from './middleware/auth.middleware';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5050;

app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:3000',
  credentials: true
}));
app.use(express.json({ limit: '50mb' }));
app.use(cookieParser());

// Public routes
app.get('/health', (req, res) => {
  res.json({ 
    status: 'healthy', 
    timestamp: new Date().toISOString(),
    claude: process.env.ANTHROPIC_API_KEY ? 'configured' : 'missing',
    agents: 9,
    auth: 'enabled',
    suppliers: 5
  });
});

// Auth routes (public)
app.use('/api/auth', authRoutes);

// Protected routes
app.use('/api/claude', authenticate, claudeRoutes);
app.use('/api/agents', authenticate, agentRoutes);
app.use('/api/suppliers', supplierRoutes);

app.listen(PORT, () => {
  console.log(`✅ Backend running on http://localhost:${PORT}`);
  console.log(`🤖 Claude AI: ${process.env.ANTHROPIC_API_KEY ? 'Configured' : 'Not configured'}`);
  console.log(`🔧 9 AI Agents: Active`);
  console.log(`🔐 Authentication: Enabled`);
  console.log(`📊 TIS-IntelliMat Suppliers: 5`);
  console.log(`💰 Portfolio Value: R331M`);
  console.log(``);
  console.log(`📊 Endpoints:`);
  console.log(`   PUBLIC:`);
  console.log(`   - GET  /health`);
  console.log(`   - POST /api/auth/login`);
  console.log(`   - POST /api/auth/register`);
  console.log(``);
  console.log(`   PROTECTED:`);
  console.log(`   - GET  /api/suppliers (all suppliers)`);
  console.log(`   - GET  /api/suppliers/portfolio (portfolio summary)`);
  console.log(`   - GET  /api/suppliers/:id (specific supplier)`);
  console.log(`   - GET  /api/suppliers/risk/:level (by risk level)`);
  console.log(`   - GET  /api/suppliers/filter/high-risk`);
  console.log(`   - GET  /api/suppliers/filter/top-performers`);
  console.log(`   - POST /api/claude/chat`);
  console.log(`   - GET  /api/agents`);
  console.log(``);
  console.log(`🔑 Demo: admin@tisholdings.co.za / admin123`);
});
