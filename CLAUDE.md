# CLAUDE.md - AI Assistant Guide for ESG-Navigator-Pro

> **Last Updated**: 2025-11-23
> **Purpose**: Comprehensive guide for AI assistants working with the ESG-Navigator-Pro codebase

---

## Table of Contents

1. [Repository Overview](#repository-overview)
2. [Architecture & Structure](#architecture--structure)
3. [Technology Stack](#technology-stack)
4. [Development Environment Setup](#development-environment-setup)
5. [Code Conventions & Patterns](#code-conventions--patterns)
6. [Key Components & Services](#key-components--services)
7. [API Patterns](#api-patterns)
8. [Authentication & Security](#authentication--security)
9. [AI Integration Patterns](#ai-integration-patterns)
10. [Database Schema](#database-schema)
11. [Development Workflows](#development-workflows)
12. [Deployment Strategy](#deployment-strategy)
13. [Important File Locations](#important-file-locations)
14. [Common Tasks & Commands](#common-tasks--commands)
15. [Guidelines for AI Assistants](#guidelines-for-ai-assistants)

---

## Repository Overview

**ESG-Navigator-Pro** is a production-ready ESG (Environmental, Social, Governance) compliance and supplier management platform with dual applications and comprehensive AI-powered features for ESG assessment, reporting, and supplier screening.

### Key Features
- **Multi-tenant SaaS platform** for ESG compliance management
- **AI-powered analysis** using Anthropic's Claude for ESG assessments
- **Supplier screening and management** with 493+ supplier database
- **Interactive dashboards** with real-time metrics and charts
- **Automated compliance reporting** and board briefings
- **Email scheduling and notifications** system
- **Interactive training and assessments** modules
- **AI-Powered Education Platform** - Personalized learning for students, staff, and communities in agriculture and sustainability (see `/docs/AI-TRAINING-EDUCATION-SYSTEM.md`)

### Repository Structure
This is a **dual-application monorepo** containing:

1. **TIS-Platform**: Lightweight ESG intelligence platform
2. **esg-navigator**: Full-featured ESG navigator with advanced AI capabilities

Both applications share similar architecture but serve different use cases and deployment scenarios.

---

## Architecture & Structure

### High-Level Architecture

```
ESG-Navigator-Pro/
├── middleware.ts                 # Root-level Next.js middleware (domain handling)
├── vercel.json                  # Vercel deployment configuration
├── TIS-Platform/                # Application 1: TIS Intelligence Platform
│   ├── apps/
│   │   ├── api/                # Express.js API (lightweight)
│   │   │   ├── public/
│   │   │   └── src/
│   │   │       └── index.js
│   │   └── web/                # Next.js 14 web application
│   │       ├── app/            # App Router (Next.js 14)
│   │       │   ├── api/       # Next.js API routes
│   │       │   ├── components/
│   │       │   ├── dashboard/
│   │       │   ├── registration/
│   │       │   ├── training/
│   │       │   ├── layout.tsx
│   │       │   ├── page.tsx
│   │       │   └── globals.css
│   │       ├── lib/
│   │       ├── package.json
│   │       ├── tsconfig.json
│   │       └── next.config.js
│   ├── database/
│   │   └── 01-init.sql         # PostgreSQL schema
│   └── docker-compose.yml
│
└── esg-navigator/              # Application 2: ESG Navigator (Primary)
    ├── apps/
    │   ├── api/               # Express.js API with TypeScript
    │   │   ├── src/
    │   │   │   ├── agents/   # AI agent implementations (9 specialized agents)
    │   │   │   │   ├── base.agent.ts
    │   │   │   │   ├── assurance-copilot.agent.ts
    │   │   │   │   ├── board-briefing-bot.agent.ts
    │   │   │   │   ├── emissions-accountant.agent.ts
    │   │   │   │   ├── energy-optimizer.agent.ts
    │   │   │   │   ├── esg-assessor.agent.ts
    │   │   │   │   ├── iso50001-coach.agent.ts
    │   │   │   │   ├── standards-mapper.agent.ts
    │   │   │   │   ├── supplier-screener.agent.ts
    │   │   │   │   └── tsf-watch.agent.ts
    │   │   │   ├── config/
    │   │   │   │   └── database.ts
    │   │   │   ├── data/
    │   │   │   │   └── suppliers.data.ts  # 493 supplier records
    │   │   │   ├── middleware/
    │   │   │   │   └── auth.middleware.ts
    │   │   │   ├── models/
    │   │   │   ├── routes/
    │   │   │   │   ├── auth.routes.ts
    │   │   │   │   ├── supplier.routes.ts
    │   │   │   │   └── ...
    │   │   │   ├── services/
    │   │   │   │   ├── auth.service.ts
    │   │   │   │   ├── claude.service.ts
    │   │   │   │   ├── anthropic.service.ts
    │   │   │   │   └── supplier.service.ts
    │   │   │   └── index.ts
    │   │   ├── scripts/
    │   │   ├── tools/
    │   │   ├── package.json
    │   │   └── tsconfig.json
    │   │
    │   └── web/              # Next.js 14 application
    │       ├── src/
    │       │   ├── app/      # App Router pages
    │       │   │   ├── ai-insights/
    │       │   │   ├── assessments/
    │       │   │   ├── dashboard/
    │       │   │   ├── login/
    │       │   │   ├── training/
    │       │   │   ├── layout.tsx
    │       │   │   ├── page.tsx
    │       │   │   └── globals.css
    │       │   ├── components/
    │       │   │   ├── dashboard/
    │       │   │   │   ├── MetricsGrid.tsx
    │       │   │   │   ├── EmissionsChart.tsx
    │       │   │   │   ├── AgentStatus.tsx
    │       │   │   │   └── RecentActivity.tsx
    │       │   │   └── layout/
    │       │   │       ├── Navigation.tsx
    │       │   │       └── Footer.tsx
    │       │   ├── hooks/
    │       │   │   └── useWebSocket.ts
    │       │   └── lib/
    │       ├── components/     # Legacy components
    │       ├── lib/
    │       ├── pages/          # Legacy pages router
    │       ├── styles/
    │       ├── .env
    │       ├── .env.local
    │       ├── .env.production
    │       ├── .env.test
    │       ├── package.json
    │       ├── tsconfig.json
    │       ├── tailwind.config.js
    │       ├── postcss.config.js
    │       └── next.config.js
    │
    ├── docs/
    ├── infrastructure/
    │   ├── nginx.conf
    │   ├── schema.sql
    │   └── deploy-aws.sh
    ├── scripts/
    ├── docker-compose.yml
    └── package.json          # Root workspace package
```

### Application Layers

#### Frontend Layer (Next.js 14)
- **App Router** architecture (Next.js 14+)
- Server and client components
- API routes for backend integration
- Real-time WebSocket connections
- Chart.js visualizations

#### API Layer (Express.js)
- RESTful API endpoints
- JWT authentication middleware
- Service layer pattern
- AI agent orchestration
- WebSocket server for real-time updates

#### Data Layer
- PostgreSQL for persistent storage
- Redis for caching and sessions
- Static data files for suppliers
- Service classes for data access

#### Infrastructure Layer
- Docker containers for all services
- Nginx reverse proxy
- Health checks and monitoring
- SSL/TLS termination

---

## Technology Stack

### Frontend Technologies

| Category | Technology | Version | Purpose |
|----------|-----------|---------|---------|
| Framework | Next.js | 14.x | React framework with App Router |
| React | React | 18.3.x | UI library |
| Language | TypeScript | 5.x | Type-safe JavaScript |
| Styling | Tailwind CSS | 3.4.x | Utility-first CSS (esg-navigator) |
| Charts | Chart.js | 4.5.x | Data visualization |
| Charts | react-chartjs-2 | 5.x | React wrapper for Chart.js |
| Icons | Lucide React | Latest | Icon library |
| HTTP Client | Axios | 1.x | API requests with interceptors |

### Backend Technologies

| Category | Technology | Version | Purpose |
|----------|-----------|---------|---------|
| Runtime | Node.js | Latest LTS | JavaScript runtime |
| Framework | Express.js | 4.18.x | Web server framework |
| Language | TypeScript | 5.x | Type-safe server code |
| AI SDK | Anthropic SDK | 0.27.3 | Claude AI integration |
| Auth | JWT | jsonwebtoken 9.0.x | Token-based authentication |
| Passwords | bcryptjs | 3.0.x | Password hashing |
| WebSocket | ws | 8.16.x | Real-time communication |
| CORS | cors | 2.8.x | Cross-origin resource sharing |
| Logging | Winston | 3.11.x | Application logging |
| Dev Tools | ts-node-dev | 2.0.x | TypeScript dev server |

### Database & Infrastructure

| Category | Technology | Version | Purpose |
|----------|-----------|---------|---------|
| Database | PostgreSQL | 15 (Alpine) | Primary data store |
| Cache | Redis | 7 (Alpine) | Session & cache store |
| DB Client | pg | 8.11.x | PostgreSQL client |
| Container | Docker | Latest | Containerization |
| Orchestration | Docker Compose | Latest | Multi-container apps |
| Proxy | Nginx | Alpine | Reverse proxy & SSL |
| Deployment | Vercel | N/A | Frontend hosting |
| Cloud | AWS | N/A | Alternative deployment |

### Development Tools

| Tool | Purpose |
|------|---------|
| npm workspaces | Monorepo management |
| Concurrently | Run multiple dev servers |
| ESLint | Code linting |
| TypeScript Compiler | Type checking |

---

## Development Environment Setup

### Prerequisites

```bash
# Required software
- Node.js 18+ LTS
- npm 9+
- Docker 20+
- Docker Compose 2+
- PostgreSQL 15+ (if running locally)
- Redis 7+ (if running locally)
```

### Environment Variables

Create the following environment files:

**esg-navigator/apps/web/.env.local**
```bash
NEXT_PUBLIC_API_URL=http://localhost:8080
NEXT_PUBLIC_ENV=development
```

**esg-navigator/apps/api/.env**
```bash
NODE_ENV=development
PORT=8080
DATABASE_URL=postgresql://esguser:password@localhost:5432/esgnavigator
REDIS_URL=redis://localhost:6379
ANTHROPIC_API_KEY=sk-ant-xxxxx
JWT_SECRET=your-secret-key-here
FRONTEND_URL=http://localhost:3000
```

### Installation & Startup

#### Option 1: Docker Compose (Recommended)

```bash
# Navigate to esg-navigator
cd esg-navigator

# Start all services
docker-compose up -d

# View logs
docker-compose logs -f

# Services will be available at:
# - Frontend: http://localhost:3000
# - API: http://localhost:8080
# - PostgreSQL: localhost:5432
# - Redis: localhost:6379
# - Nginx: http://localhost:80
```

#### Option 2: Local Development

```bash
# esg-navigator (uses npm workspaces)
cd esg-navigator

# Install all dependencies
npm install

# Start both API and Web concurrently
npm run dev

# Or start individually
npm run dev:api   # API on :8080
npm run dev:web   # Web on :3000
```

```bash
# TIS-Platform
cd TIS-Platform

# API
cd apps/api
npm install
npm start         # Runs on :5050

# Web (in another terminal)
cd apps/web
npm install
npm run dev       # Runs on :3000
```

### Database Setup

```bash
# Using Docker Compose (automatic)
docker-compose up -d postgres

# Manual setup
psql -U postgres -c "CREATE DATABASE esgnavigator;"
psql -U esguser -d esgnavigator -f TIS-Platform/database/01-init.sql
psql -U esguser -d esgnavigator -f esg-navigator/infrastructure/schema.sql
```

---

## Code Conventions & Patterns

### File Naming Conventions

| Type | Convention | Example |
|------|-----------|---------|
| Components | PascalCase | `MetricsGrid.tsx`, `Navigation.tsx` |
| Routes (App Router) | kebab-case | `ai-insights/`, `dashboard/` |
| API Routes | kebab-case | `auth.routes.ts`, `supplier.routes.ts` |
| Services | kebab-case + .service | `claude.service.ts`, `auth.service.ts` |
| Middleware | kebab-case + .middleware | `auth.middleware.ts` |
| Agents | kebab-case + .agent | `esg-assessor.agent.ts` |
| Hooks | camelCase with `use` | `useWebSocket.ts` |
| Utilities | kebab-case | `database.ts`, `config.ts` |
| Types/Interfaces | PascalCase | `AgentConfig`, `ClaudeMessage` |

### Component Patterns

#### Functional Components (Preferred)

```typescript
// esg-navigator/apps/web/src/components/dashboard/MetricsGrid.tsx
export default function MetricsGrid({ metrics }: { metrics: any }) {
  const m = metrics ?? {
    coverageRate: 0,
    daysToInventory: 0,
    auditPrepTimeSaved: 0,
    activeAlerts: 0
  }

  const box = (title: string, value: any) => (
    <div className='card'>
      <div style={{ fontSize: '28px', fontWeight: '700' }}>{value}</div>
      <div style={{ color: '#6b7280', marginTop: '6px' }}>{title}</div>
    </div>
  )

  return (
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 16 }}>
      {box('Coverage Rate', m.coverageRate + '%')}
      {box('Days to Inventory', m.daysToInventory)}
      {box('Audit Prep Saved', m.auditPrepTimeSaved + '%')}
      {box('Active Alerts', m.activeAlerts)}
    </div>
  )
}
```

**Key Patterns:**
- Default exports for page/component files
- Inline type definitions for simple props
- Default parameter values for optional data
- Helper functions within component scope
- Mix of Tailwind classes and inline styles

### TypeScript Conventions

#### Interface Definitions

```typescript
// Always export interfaces
export interface AgentConfig {
  name: string;
  role: string;
  systemPrompt: string;
  capabilities: string[];
}

export interface ClaudeMessage {
  role: 'user' | 'assistant';
  content: string;
}

// Extend Express Request for auth
export interface AuthRequest extends Request {
  user?: {
    userId: string;
    email: string;
    role: string;
  };
}
```

#### Type Safety

```typescript
// Strict TypeScript configuration
{
  "compilerOptions": {
    "strict": true,
    "strictNullChecks": true,
    "noImplicitAny": true,
    "target": "ES2020",
    "module": "ESNext",
    "moduleResolution": "bundler"
  }
}
```

**Important Notes:**
- Build configuration **ignores TypeScript errors** (`ignoreBuildErrors: true`)
- This is intentional for rapid development
- AI assistants should still write type-safe code
- Fix TypeScript errors when encountered, but don't block builds

### Styling Conventions

#### esg-navigator (Tailwind CSS)

```tsx
// Use Tailwind utility classes
<div className="flex items-center justify-between p-4 bg-white rounded-lg shadow">
  <h2 className="text-xl font-semibold text-gray-800">Dashboard</h2>
</div>

// Custom CSS utilities in globals.css
.card {
  @apply bg-white rounded-lg shadow-sm p-6 border border-gray-200;
}

.btn-primary {
  @apply bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700;
}
```

#### TIS-Platform (Custom CSS)

```tsx
// Use semantic class names
<div className="card">
  <div className="card-header">Title</div>
  <div className="card-body">Content</div>
</div>

// Inline styles for specific cases
<div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 16 }}>
  {/* Grid items */}
</div>
```

---

## Key Components & Services

### Frontend Components

#### Dashboard Components (`esg-navigator/apps/web/src/components/dashboard/`)

**MetricsGrid.tsx**
- Displays 4-column grid of key metrics
- Props: `{ metrics: any }`
- Shows: Coverage Rate, Days to Inventory, Audit Prep Saved, Active Alerts

**EmissionsChart.tsx**
- Chart.js visualization for emissions data
- Time-series display

**AgentStatus.tsx**
- Shows status of AI agents
- Real-time updates via WebSocket

**RecentActivity.tsx**
- Activity feed component
- Displays recent user/system actions

#### Layout Components (`esg-navigator/apps/web/src/components/layout/`)

**Navigation.tsx**
- Main navigation header
- Responsive design
- Auth-aware menu items

**Footer.tsx**
- Site footer with links
- Copyright and legal info

### Backend Services

#### Authentication Service (`esg-navigator/apps/api/src/services/auth.service.ts`)

```typescript
class AuthService {
  async login({ email, password }): Promise<{ token, user }>
  async register({ email, password, name, organization }): Promise<{ token, user }>
  async getUserById(userId: string): Promise<User>
  verifyToken(token: string): Promise<DecodedToken>
}
```

**Key Features:**
- JWT token generation and verification
- bcrypt password hashing
- User session management

#### Claude Service (`esg-navigator/apps/api/src/services/claude.service.ts`)

```typescript
class ClaudeService {
  async chat(message: string, conversationHistory?: ClaudeMessage[]): Promise<string>
  async analyzeSupplier(supplierData: any): Promise<AnalysisResult>
  async generateReport(reportType?: string): Promise<string>
}
```

**Key Features:**
- Uses Claude Sonnet 4 model (`claude-sonnet-4-20250514`)
- System prompt with ESG-specific context
- Conversation history support
- JSON response parsing
- Error handling and logging

**Important Context:**
The service includes hardcoded portfolio data in the system prompt:
- Total Supply Chain Value: R331M
- Overall ESG Compliance: 87.2%
- 5 major suppliers with detailed ESG scores

#### Supplier Service (`esg-navigator/apps/api/src/services/supplier.service.ts`)

```typescript
class SupplierService {
  getSuppliers(): Promise<Supplier[]>
  getSupplierById(id: string): Promise<Supplier>
  searchSuppliers(query: string): Promise<Supplier[]>
}
```

**Data Source:**
- 493 suppliers in `esg-navigator/apps/api/src/data/suppliers.data.ts`
- Includes company name, ESG score, risk level, compliance issues

### AI Agent Architecture

#### Base Agent (`esg-navigator/apps/api/src/agents/base.agent.ts`)

```typescript
export abstract class BaseAgent {
  protected config: AgentConfig;

  constructor(config: AgentConfig) {
    this.config = config;
  }

  async analyze(data: any): Promise<any> {
    const prompt = this.buildPrompt(data);
    const response = await claudeService.chat(prompt);
    return this.parseResponse(response);
  }

  protected abstract buildPrompt(data: any): string;
  protected abstract parseResponse(response: string): any;

  getInfo() {
    return {
      name: this.config.name,
      role: this.config.role,
      capabilities: this.config.capabilities
    };
  }
}
```

#### Specialized Agents

All agents extend `BaseAgent` and implement domain-specific logic:

1. **assurance-copilot.agent.ts** - ESG assurance and verification
2. **board-briefing-bot.agent.ts** - Executive summaries and board reports
3. **emissions-accountant.agent.ts** - Carbon emissions calculations
4. **energy-optimizer.agent.ts** - Energy efficiency recommendations
5. **esg-assessor.agent.ts** - Comprehensive ESG assessments
6. **iso50001-coach.agent.ts** - ISO 50001 compliance guidance
7. **standards-mapper.agent.ts** - ESG standards mapping
8. **supplier-screener.agent.ts** - Supplier ESG screening
9. **tsf-watch.agent.ts** - TSF (Transaction Security Framework) monitoring

**New Learning & Education Agents** (Planned - see `/docs/AI-TRAINING-EDUCATION-SYSTEM.md`):
10. **agriculture-advisor.agent.ts** - Sustainable agriculture expert for farmers and students
11. **esg-compliance-coach.agent.ts** - ESG training and compliance guidance for staff
12. **climate-action-guide.agent.ts** - Climate education and action planning
13. **community-mentor.agent.ts** - Community engagement and social impact learning
14. **assessment-grader.agent.ts** - Automated assessment and personalized feedback

**Pattern for Creating New Agents:**

```typescript
import { BaseAgent, AgentConfig } from './base.agent';

export class CustomAgent extends BaseAgent {
  constructor() {
    super({
      name: 'Custom Agent',
      role: 'Specific ESG domain expert',
      systemPrompt: 'You are an expert in...',
      capabilities: ['capability1', 'capability2']
    });
  }

  protected buildPrompt(data: any): string {
    return `Analyze this data: ${JSON.stringify(data)}`;
  }

  protected parseResponse(response: string): any {
    // Parse Claude's response into structured data
    try {
      return JSON.parse(response);
    } catch {
      return { analysis: response };
    }
  }
}
```

### Hooks

#### useWebSocket Hook (`esg-navigator/apps/web/src/hooks/useWebSocket.ts`)

```typescript
function useWebSocket(url: string) {
  const [isConnected, setIsConnected] = useState(false);
  const [lastMessage, setLastMessage] = useState(null);

  useEffect(() => {
    const ws = new WebSocket(url);

    ws.onopen = () => setIsConnected(true);
    ws.onmessage = (event) => setLastMessage(JSON.parse(event.data));
    ws.onclose = () => setIsConnected(false);

    return () => ws.close();
  }, [url]);

  return { isConnected, lastMessage };
}
```

---

## API Patterns

### Next.js API Routes (App Router)

**Location**: `apps/web/src/app/api/*/route.ts`

```typescript
// Example: apps/web/src/app/api/claude/route.ts
export async function POST(req: Request) {
  try {
    const data = await req.json();

    // Process request
    const result = await processData(data);

    return new Response(JSON.stringify(result), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });
  } catch (error: any) {
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
}

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const id = searchParams.get('id');

  // Handle GET request
  return new Response(JSON.stringify({ id }));
}
```

### Express API Routes

**Location**: `esg-navigator/apps/api/src/routes/*.routes.ts`

```typescript
// Example: auth.routes.ts
import express from 'express';
import { authService } from '../services/auth.service';
import { authenticate } from '../middleware/auth.middleware';

const router = express.Router();

// Public routes
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password required' });
    }

    const result = await authService.login({ email, password });

    res.json({
      success: true,
      ...result
    });
  } catch (error: any) {
    res.status(401).json({
      success: false,
      error: error.message
    });
  }
});

// Protected routes
router.get('/me', authenticate, async (req: any, res) => {
  try {
    const user = await authService.getUserById(req.user.userId);

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    res.json({
      success: true,
      user
    });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

export default router;
```

### API Route Organization

**Standard Pattern:**

```
routes/
├── auth.routes.ts          # /api/auth/*
├── supplier.routes.ts      # /api/suppliers/*
├── assessment.routes.ts    # /api/assessments/*
└── agent.routes.ts         # /api/agents/*
```

**Mounting in Express:**

```typescript
// apps/api/src/index.ts
import authRoutes from './routes/auth.routes';
import supplierRoutes from './routes/supplier.routes';

app.use('/api/auth', authRoutes);
app.use('/api/suppliers', supplierRoutes);
```

### Error Handling Pattern

```typescript
// Consistent error response structure
try {
  // Route logic
  res.json({ success: true, data: result });
} catch (error: any) {
  res.status(statusCode).json({
    success: false,
    error: error.message
  });
}
```

---

## Authentication & Security

### JWT Authentication Flow

```
1. User submits email/password to /api/auth/login
2. Server validates credentials with bcrypt
3. Server generates JWT with jsonwebtoken
4. Client stores token in localStorage
5. Client includes token in Authorization header for all requests
6. Server middleware validates token on protected routes
7. On 401 response, client redirects to login
```

### Authentication Middleware

**File**: `esg-navigator/apps/api/src/middleware/auth.middleware.ts`

```typescript
export const authenticate = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ error: 'No token provided' });
    }

    const token = authHeader.substring(7);
    const decoded = authService.verifyToken(token);

    req.user = decoded;
    next();
  } catch (error) {
    res.status(401).json({ error: 'Invalid or expired token' });
  }
};
```

### Role-Based Authorization

```typescript
export const authorize = (...allowedRoles: string[]) => {
  return (req: AuthRequest, res: Response, next: NextFunction) => {
    if (!req.user) {
      return res.status(401).json({ error: 'Not authenticated' });
    }

    if (!allowedRoles.includes(req.user.role)) {
      return res.status(403).json({ error: 'Insufficient permissions' });
    }

    next();
  };
};

// Usage
router.get('/admin', authenticate, authorize('admin'), handler);
```

### Security Best Practices

#### Environment Variables
```bash
# Never commit these to git
ANTHROPIC_API_KEY=sk-ant-xxxxx
JWT_SECRET=use-strong-random-secret-here
DATABASE_URL=postgresql://user:pass@host:port/db
```

#### Password Hashing
```typescript
import bcrypt from 'bcryptjs';

// Hash password before storing
const hashedPassword = await bcrypt.hash(password, 10);

// Verify password during login
const isValid = await bcrypt.compare(password, hashedPassword);
```

#### CORS Configuration
```typescript
import cors from 'cors';

app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:3000',
  credentials: true
}));
```

#### API Key Protection
```typescript
// For public API endpoints
const apiKey = req.headers['x-api-key'];
if (apiKey !== process.env.PUBLIC_API_KEY) {
  return res.status(403).json({ error: 'Invalid API key' });
}
```

---

## AI Integration Patterns

### Anthropic Claude Configuration

**Model**: `claude-sonnet-4-20250514`
**SDK Version**: `@anthropic-ai/sdk@0.27.3`

### Basic Claude Integration

```typescript
import Anthropic from '@anthropic-ai/sdk';

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
});

const response = await anthropic.messages.create({
  model: 'claude-sonnet-4-20250514',
  max_tokens: 2500,
  system: systemPrompt,
  messages: [
    { role: 'user', content: userMessage }
  ]
});

const text = response.content[0].type === 'text'
  ? response.content[0].text
  : '';
```

### System Prompts

**ESG-Specific Context:**

```typescript
const systemPrompt = `You are an ESG analyst for TIS-IntelliMat ESG Navigator.

CURRENT PORTFOLIO DATA:
- Total Supply Chain Value: R331M
- Overall ESG Compliance: 87.2%
- Active Suppliers: 5 major companies

SUPPLIER DETAILS:
1. Eskom Holdings - R120M (36%) - ESG Score: 65/100 - HIGH RISK
   Issues: 3 compliance violations, high carbon intensity
2. Multotec Processing - R89M (27%) - ESG Score: 76/100 - MEDIUM RISK
   Issues: 1 compliance issue
3. Anglo American Platinum - R67M (20%) - ESG Score: 82/100 - LOW RISK
   Issues: 0 violations - Best performer
4. Sasol Chemical Industries - R55M (17%) - ESG Score: 71/100 - MEDIUM RISK
   Issues: 2 compliance violations, high carbon intensity

Provide professional, actionable ESG analysis with specific recommendations.`;
```

### Conversation History

```typescript
interface ClaudeMessage {
  role: 'user' | 'assistant';
  content: string;
}

async function chat(
  message: string,
  conversationHistory: ClaudeMessage[] = []
): Promise<string> {
  const messages = [
    ...conversationHistory,
    { role: 'user' as const, content: message }
  ];

  const response = await anthropic.messages.create({
    model: 'claude-sonnet-4-20250514',
    max_tokens: 2500,
    system: systemPrompt,
    messages: messages
  });

  return response.content[0].type === 'text'
    ? response.content[0].text
    : '';
}
```

### Structured Output Parsing

```typescript
async function analyzeSupplier(supplierData: any): Promise<AnalysisResult> {
  const prompt = `Analyze this supplier's ESG performance:

Supplier: ${supplierData.name}
Contract Value: ${supplierData.contractValue}
ESG Score: ${supplierData.esgScore}/100
Risk Level: ${supplierData.riskLevel}

Provide detailed analysis in JSON format with:
{
  "riskScore": 0-100,
  "riskFactors": ["factor1", "factor2"],
  "recommendations": [
    {
      "action": "specific action",
      "timeline": "timeframe",
      "priority": "high/medium/low"
    }
  ],
  "financialImpact": "estimated cost/savings"
}`;

  const response = await this.chat(prompt);

  try {
    // Extract JSON from response (handles markdown code blocks)
    const jsonMatch = response.match(/\{[\s\S]*\}/);
    if (jsonMatch) {
      return JSON.parse(jsonMatch[0]);
    }
    return { analysis: response };
  } catch {
    return { analysis: response };
  }
}
```

### Error Handling

```typescript
try {
  const response = await anthropic.messages.create({...});
  return response.content[0].text;
} catch (error: any) {
  console.error('Claude API error:', error);

  if (error.status === 429) {
    throw new Error('Rate limit exceeded. Please try again later.');
  }

  if (error.status === 401) {
    throw new Error('Invalid API key');
  }

  throw new Error(`Claude AI Error: ${error.message}`);
}
```

---

## Database Schema

### PostgreSQL Tables

**Location**: `TIS-Platform/database/01-init.sql`

#### organizations
```sql
CREATE TABLE organizations (
  id SERIAL PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  industry VARCHAR(100),
  country VARCHAR(100),
  esg_score DECIMAL(5,2),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

#### users
```sql
CREATE TABLE users (
  id SERIAL PRIMARY KEY,
  organization_id INTEGER REFERENCES organizations(id),
  email VARCHAR(255) UNIQUE NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  name VARCHAR(255),
  role VARCHAR(50) DEFAULT 'user',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  last_login TIMESTAMP
);
```

#### dashboard_metrics
```sql
CREATE TABLE dashboard_metrics (
  id SERIAL PRIMARY KEY,
  organization_id INTEGER REFERENCES organizations(id),
  coverage_rate DECIMAL(5,2),
  days_to_inventory INTEGER,
  audit_prep_time_saved DECIMAL(5,2),
  active_alerts INTEGER,
  recorded_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

#### pipeline_stages
```sql
CREATE TABLE pipeline_stages (
  id SERIAL PRIMARY KEY,
  organization_id INTEGER REFERENCES organizations(id),
  stage_name VARCHAR(100),
  count INTEGER,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

#### outreach_queue
```sql
CREATE TABLE outreach_queue (
  id SERIAL PRIMARY KEY,
  organization_id INTEGER REFERENCES organizations(id),
  contact_name VARCHAR(255),
  company VARCHAR(255),
  email VARCHAR(255),
  phone VARCHAR(50),
  priority VARCHAR(20),
  status VARCHAR(50) DEFAULT 'pending',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

### Database Connection

```typescript
// esg-navigator/apps/api/src/config/database.ts
import { Pool } from 'pg';

export const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  max: 20,
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 2000,
});

// Usage
const result = await pool.query('SELECT * FROM users WHERE id = $1', [userId]);
```

### Redis Caching

```typescript
import Redis from 'redis';

const redis = Redis.createClient({
  url: process.env.REDIS_URL || 'redis://localhost:6379'
});

await redis.connect();

// Cache pattern
const cacheKey = `supplier:${supplierId}`;
const cached = await redis.get(cacheKey);

if (cached) {
  return JSON.parse(cached);
}

const data = await fetchFromDatabase(supplierId);
await redis.setEx(cacheKey, 3600, JSON.stringify(data)); // 1 hour TTL
return data;
```

---

## Development Workflows

### NPM Scripts

#### Root Workspace (esg-navigator)

```json
{
  "scripts": {
    "dev": "concurrently \"npm:dev:api\" \"npm:dev:web\"",
    "dev:web": "npm run dev -w @esgnavigator/web",
    "dev:api": "npm run dev -w @esgnavigator/api",
    "build": "npm run build -w @esgnavigator/api && npm run build -w @esgnavigator/web",
    "start:web": "npm start -w @esgnavigator/web",
    "start:api": "npm start -w @esgnavigator/api"
  }
}
```

#### Web Application

```json
{
  "scripts": {
    "dev": "next dev -p 3000",
    "build": "next build",
    "start": "next start",
    "lint": "next lint"
  }
}
```

#### API Application (esg-navigator)

```json
{
  "scripts": {
    "dev": "ts-node-dev --respawn --transpile-only src/index.ts",
    "build": "tsc",
    "start": "node dist/index.js",
    "test": "jest"
  }
}
```

### Docker Commands

```bash
# Start all services
docker-compose up -d

# Start specific service
docker-compose up -d postgres

# View logs
docker-compose logs -f api
docker-compose logs -f web

# Rebuild after code changes
docker-compose up -d --build api

# Stop all services
docker-compose down

# Stop and remove volumes
docker-compose down -v

# Execute commands in running container
docker-compose exec api npm run build
docker-compose exec postgres psql -U esguser -d esgnavigator
```

### Git Workflow

```bash
# Create feature branch
git checkout -b feature/new-feature

# Commit changes
git add .
git commit -m "Add: New feature description"

# Push to remote
git push origin feature/new-feature

# Standard commit message format:
# Add: New feature or functionality
# Fix: Bug fix
# Update: Enhancement to existing feature
# Refactor: Code refactoring
# Docs: Documentation updates
# Test: Test additions or updates
```

### Testing

**Note**: No testing framework is currently configured. When adding tests:

```bash
# Recommended setup
npm install --save-dev jest @types/jest ts-jest
npm install --save-dev @testing-library/react @testing-library/jest-dom

# Add to package.json
{
  "scripts": {
    "test": "jest",
    "test:watch": "jest --watch",
    "test:coverage": "jest --coverage"
  }
}
```

---

## Deployment Strategy

### Vercel Deployment (Primary)

**Configuration**: `/vercel.json`

```json
{
  "rewrites": [
    { "source": "/(.*)", "destination": "/esg-navigator/apps/web/$1" }
  ]
}
```

**Deployment Steps:**
```bash
# Install Vercel CLI
npm install -g vercel

# Deploy
cd esg-navigator/apps/web
vercel

# Production deployment
vercel --prod
```

**Environment Variables on Vercel:**
- `NEXT_PUBLIC_API_URL`
- `ANTHROPIC_API_KEY`
- `DATABASE_URL`
- `REDIS_URL`
- `JWT_SECRET`

### AWS Deployment (Alternative)

**Script**: `esg-navigator/infrastructure/deploy-aws.sh`

```bash
# Run deployment script
cd esg-navigator/infrastructure
chmod +x deploy-aws.sh
./deploy-aws.sh
```

**AWS Services Used:**
- EC2 for application hosting
- RDS for PostgreSQL
- ElastiCache for Redis
- Route 53 for DNS
- CloudFront for CDN
- S3 for static assets

### Docker Production Deployment

```bash
# Build production images
docker-compose -f docker-compose.yml build

# Start in production mode
docker-compose up -d

# Scale services
docker-compose up -d --scale api=3
```

### Nginx Configuration

**File**: `esg-navigator/infrastructure/nginx.conf`

```nginx
upstream api {
  server api:8080;
}

upstream web {
  server web:3000;
}

server {
  listen 80;
  server_name www.esgnavigator.ai;

  location /api/ {
    proxy_pass http://api;
    proxy_set_header Host $host;
    proxy_set_header X-Real-IP $remote_addr;
  }

  location / {
    proxy_pass http://web;
    proxy_set_header Host $host;
    proxy_set_header X-Real-IP $remote_addr;
  }
}
```

### Environment-Specific Configs

**Development** (`.env`)
- Local database connections
- Verbose logging
- Hot reloading enabled
- Mock data allowed

**Production** (`.env.production`)
- Remote database URLs
- Error logging only
- Production builds
- Strict validation

**Test** (`.env.test`)
- Test database
- Isolated Redis instance
- Mock external APIs

---

## Important File Locations

### Configuration Files

| File | Purpose | Location |
|------|---------|----------|
| Root middleware | Domain/API routing | `/middleware.ts` |
| Vercel config | Deployment settings | `/vercel.json` |
| Docker Compose (ESG) | Full stack orchestration | `/esg-navigator/docker-compose.yml` |
| Docker Compose (TIS) | TIS stack setup | `/TIS-Platform/docker-compose.yml` |
| Nginx config | Reverse proxy | `/esg-navigator/infrastructure/nginx.conf` |
| Database schema (ESG) | PostgreSQL schema | `/esg-navigator/infrastructure/schema.sql` |
| Database schema (TIS) | Initial setup | `/TIS-Platform/database/01-init.sql` |
| AWS deploy script | Cloud deployment | `/esg-navigator/infrastructure/deploy-aws.sh` |

### Package Files

| File | Purpose | Location |
|------|---------|----------|
| Root workspace | Monorepo config | `/esg-navigator/package.json` |
| Web package | Frontend deps | `/esg-navigator/apps/web/package.json` |
| API package | Backend deps | `/esg-navigator/apps/api/package.json` |
| TIS Web package | TIS frontend | `/TIS-Platform/apps/web/package.json` |
| TIS API package | TIS backend | `/TIS-Platform/apps/api/package.json` |

### TypeScript Configs

| File | Target | Location |
|------|--------|----------|
| Web tsconfig | Frontend TS | `/esg-navigator/apps/web/tsconfig.json` |
| API tsconfig | Backend TS | `/esg-navigator/apps/api/tsconfig.json` |
| TIS Web tsconfig | TIS frontend | `/TIS-Platform/apps/web/tsconfig.json` |

### Next.js Configs

| File | Purpose | Location |
|------|---------|----------|
| ESG Next config | Web app config | `/esg-navigator/apps/web/next.config.js` |
| TIS Next config | TIS app config | `/TIS-Platform/apps/web/next.config.js` |
| Tailwind config | Styling | `/esg-navigator/apps/web/tailwind.config.js` |
| PostCSS config | CSS processing | `/esg-navigator/apps/web/postcss.config.js` |

### Environment Files

| File | Environment | Location |
|------|-------------|----------|
| .env | Development | `/esg-navigator/apps/web/.env` |
| .env.local | Local overrides | `/esg-navigator/apps/web/.env.local` |
| .env.production | Production | `/esg-navigator/apps/web/.env.production` |
| .env.test | Testing | `/esg-navigator/apps/web/.env.test` |
| API .env | API config | `/esg-navigator/apps/api/.env` |

### Key Source Files

| File | Purpose | Location |
|------|---------|----------|
| Suppliers data | 493 supplier records | `/esg-navigator/apps/api/src/data/suppliers.data.ts` |
| Base agent | AI agent base class | `/esg-navigator/apps/api/src/agents/base.agent.ts` |
| Auth middleware | JWT authentication | `/esg-navigator/apps/api/src/middleware/auth.middleware.ts` |
| Claude service | AI integration | `/esg-navigator/apps/api/src/services/claude.service.ts` |
| Auth service | User auth | `/esg-navigator/apps/api/src/services/auth.service.ts` |
| MetricsGrid | Dashboard component | `/esg-navigator/apps/web/src/components/dashboard/MetricsGrid.tsx` |
| useWebSocket | WebSocket hook | `/esg-navigator/apps/web/src/hooks/useWebSocket.ts` |

---

## Common Tasks & Commands

### Starting Development

```bash
# Full stack (esg-navigator)
cd esg-navigator
npm install
npm run dev              # Starts both API and Web

# Individual services
npm run dev:api          # API only on :8080
npm run dev:web          # Web only on :3000

# TIS-Platform
cd TIS-Platform/apps/api
npm install && npm start  # API on :5050

cd TIS-Platform/apps/web
npm install && npm run dev  # Web on :3000

# Docker (full stack)
docker-compose up -d
```

### Database Operations

```bash
# Connect to PostgreSQL
docker-compose exec postgres psql -U esguser -d esgnavigator

# Run migrations
psql -U esguser -d esgnavigator -f infrastructure/schema.sql

# Backup database
docker-compose exec postgres pg_dump -U esguser esgnavigator > backup.sql

# Restore database
docker-compose exec -T postgres psql -U esguser esgnavigator < backup.sql

# Check Redis
docker-compose exec redis redis-cli
> KEYS *
> GET key_name
```

### Building for Production

```bash
# Build all (esg-navigator)
npm run build

# Build individual apps
npm run build -w @esgnavigator/api
npm run build -w @esgnavigator/web

# Build Docker images
docker-compose build

# Build specific service
docker-compose build api
```

### Adding New Features

#### 1. Add New API Endpoint

```bash
# Create route file
touch esg-navigator/apps/api/src/routes/feature.routes.ts

# Create service
touch esg-navigator/apps/api/src/services/feature.service.ts

# Mount in index.ts
# import featureRoutes from './routes/feature.routes';
# app.use('/api/feature', featureRoutes);
```

#### 2. Add New React Component

```bash
# Create component
touch esg-navigator/apps/web/src/components/FeatureName.tsx

# Import and use
# import FeatureName from '@/components/FeatureName';
```

#### 3. Add New AI Agent

```bash
# Create agent file
touch esg-navigator/apps/api/src/agents/new-agent.agent.ts

# Extend BaseAgent
# export class NewAgent extends BaseAgent { ... }
```

#### 4. Add New Page

```bash
# Create page directory
mkdir esg-navigator/apps/web/src/app/new-page

# Create page.tsx
touch esg-navigator/apps/web/src/app/new-page/page.tsx

# Accessible at /new-page
```

### Debugging

```bash
# View API logs
docker-compose logs -f api

# View web logs
docker-compose logs -f web

# Check all services status
docker-compose ps

# Inspect running container
docker-compose exec api sh

# Check environment variables
docker-compose exec api env | grep API_KEY
```

### Testing API Endpoints

```bash
# Login
curl -X POST http://localhost:8080/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"user@example.com","password":"password"}'

# Get suppliers (with auth)
curl http://localhost:8080/api/suppliers \
  -H "Authorization: Bearer YOUR_TOKEN_HERE"

# Claude AI chat
curl -X POST http://localhost:8080/api/claude/chat \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN_HERE" \
  -d '{"message":"Analyze Eskom Holdings ESG performance"}'
```

---

## Guidelines for AI Assistants

### When Analyzing This Codebase

1. **Understand the dual-app structure**
   - TIS-Platform: Lightweight platform
   - esg-navigator: Full-featured platform (primary focus)
   - They share similar architecture but different features

2. **Check both locations for patterns**
   - Components may exist in both `/src/app/components/` and `/src/components/`
   - API routes exist in both Next.js (`/src/app/api/`) and Express (`/src/routes/`)

3. **Respect the monorepo structure**
   - esg-navigator uses npm workspaces
   - Commands run from root affect both web and api
   - Use workspace-specific commands when needed

4. **Be aware of the AI context**
   - Claude service has hardcoded ESG portfolio data
   - 493 suppliers in static data file
   - 9 specialized AI agents with domain expertise

### When Making Changes

1. **TypeScript**
   - Write type-safe code even though builds ignore errors
   - Define interfaces for all data structures
   - Use proper typing for React components

2. **Components**
   - Prefer functional components
   - Use default exports for pages/components
   - Include inline type definitions for simple props
   - Follow existing styling patterns (Tailwind for esg-navigator)

3. **API Routes**
   - Follow Express router pattern
   - Use service layer for business logic
   - Include proper error handling
   - Return consistent response format

4. **Services**
   - Keep business logic in service files
   - Export singleton instances
   - Handle errors gracefully
   - Add logging for debugging

5. **Database**
   - Use parameterized queries to prevent SQL injection
   - Implement connection pooling
   - Add indexes for frequently queried fields
   - Use transactions for multi-step operations

6. **Security**
   - Never commit API keys or secrets
   - Always validate user input
   - Use authentication middleware on protected routes
   - Implement rate limiting for public endpoints

### When Adding New Features

1. **Plan the full stack**
   - Database changes (if needed)
   - Backend API endpoint
   - Frontend component/page
   - Authentication requirements
   - AI integration (if applicable)

2. **Follow existing patterns**
   - Look at similar features for reference
   - Use the same folder structure
   - Match naming conventions
   - Maintain consistent code style

3. **Consider both apps**
   - Should it be in TIS-Platform or esg-navigator?
   - Does it need to exist in both?
   - Can functionality be shared?

4. **Test thoroughly**
   - Test API endpoints with curl/Postman
   - Check UI in browser
   - Verify authentication works
   - Test error cases

### When Debugging Issues

1. **Check logs first**
   - Docker logs: `docker-compose logs -f`
   - Browser console for frontend errors
   - Network tab for API calls

2. **Verify environment**
   - Environment variables set correctly
   - Database connection working
   - Redis available
   - API keys valid

3. **Common issues**
   - Port conflicts (3000, 8080, 5432, 6379)
   - CORS errors (check allowed origins)
   - 401 errors (token expired or invalid)
   - TypeScript errors (may be ignored in build but cause issues)

4. **Database issues**
   - Check connection string
   - Verify tables exist
   - Check user permissions
   - Look for schema mismatches

### Best Practices

1. **Code Quality**
   - Write self-documenting code
   - Add comments for complex logic
   - Keep functions small and focused
   - Avoid deep nesting

2. **Performance**
   - Use Redis for caching
   - Implement pagination for large datasets
   - Optimize database queries
   - Lazy load components when appropriate

3. **Security**
   - Validate all inputs
   - Sanitize user data
   - Use HTTPS in production
   - Implement rate limiting
   - Keep dependencies updated

4. **Maintainability**
   - Keep this CLAUDE.md updated
   - Document complex features
   - Use consistent naming
   - Avoid code duplication

5. **Git Commits**
   - Use descriptive commit messages
   - Follow commit message format
   - Commit related changes together
   - Don't commit secrets or API keys

### Quick Reference Commands

```bash
# Development
npm run dev                          # Start full stack
npm run dev:api                      # API only
npm run dev:web                      # Web only
docker-compose up -d                 # Docker full stack

# Building
npm run build                        # Build all
docker-compose build                 # Build Docker images

# Database
docker-compose exec postgres psql -U esguser -d esgnavigator
docker-compose exec redis redis-cli

# Logs
docker-compose logs -f api
docker-compose logs -f web

# Testing
curl -X POST http://localhost:8080/api/auth/login -d '{"email":"test@example.com","password":"pass"}'
```

### Key File Reference

```bash
# Most frequently edited files
esg-navigator/apps/api/src/routes/*.routes.ts        # API endpoints
esg-navigator/apps/api/src/services/*.service.ts     # Business logic
esg-navigator/apps/api/src/agents/*.agent.ts         # AI agents
esg-navigator/apps/web/src/app/*/page.tsx            # Pages
esg-navigator/apps/web/src/components/**/*.tsx       # Components
esg-navigator/apps/web/src/app/api/*/route.ts        # Next.js API routes
esg-navigator/apps/api/src/middleware/*.ts           # Middleware
```

### Architecture Decisions

1. **Why Next.js 14?**
   - App Router for better performance
   - Server components by default
   - Built-in API routes
   - Excellent Vercel integration

2. **Why Express for API?**
   - More control over API structure
   - Better WebSocket support
   - Easier to scale independently
   - Familiar Node.js patterns

3. **Why PostgreSQL?**
   - Robust relational database
   - JSON support for flexible data
   - Strong consistency guarantees
   - Excellent performance

4. **Why Redis?**
   - Fast caching layer
   - Session storage
   - Pub/sub for real-time features
   - Rate limiting support

5. **Why Claude AI?**
   - State-of-the-art ESG analysis
   - Excellent reasoning capabilities
   - Long context window
   - Professional output quality

6. **Why Docker?**
   - Consistent development environment
   - Easy deployment
   - Service isolation
   - Simplified dependencies

---

## Conclusion

This CLAUDE.md file provides comprehensive guidance for AI assistants working with the ESG-Navigator-Pro codebase. It covers:

- Complete repository structure and organization
- Technology stack and architectural decisions
- Development workflows and best practices
- Code patterns and conventions
- Security and authentication approaches
- AI integration patterns with Anthropic Claude
- Database schema and data management
- Deployment strategies
- Common tasks and troubleshooting

**Keep this document updated** as the codebase evolves. When adding new features or making architectural changes, update the relevant sections to maintain accuracy.

**For questions or clarifications**, refer to:
- Source code in `/esg-navigator/` and `/TIS-Platform/`
- Docker Compose files for infrastructure setup
- Package.json files for available scripts
- Environment files for configuration options

---

**Document Version**: 1.0
**Last Updated**: 2025-11-23
**Maintained By**: Development Team
