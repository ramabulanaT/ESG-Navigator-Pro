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
    auth: 'enabled'
  });
});

// Auth routes (public)
app.use('/api/auth', authRoutes);

// Protected routes
app.use('/api/claude', authenticate, claudeRoutes);
app.use('/api/agents', authenticate, agentRoutes);
app.use('/api/suppliers', supplierRoutes);

app.listen(PORT, () => {
  console.log(`ESG Navigator API running on http://localhost:${PORT}`);
  console.log(`Claude AI: ${process.env.ANTHROPIC_API_KEY ? 'Configured' : 'Not configured'}`);
  console.log(`Authentication: Enabled`);
});
