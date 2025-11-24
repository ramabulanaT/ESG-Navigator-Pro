# TIS Holdings - Business Domains & Service Lines

## Domain Architecture

TIS Holdings operates through a multi-domain structure, with each domain serving specific business functions and market segments.

---

## 1. TIS Holdings (tisholdings.co.za)
**Primary Domain | Holding Company**

### Purpose
Central holding company coordinating all business operations, strategic direction, and corporate governance.

### Service Lines
- **Corporate Governance & Strategy**
  - Group-wide strategic planning
  - Financial consolidation and reporting
  - Investment management
  - Risk management oversight

- **Shared Services**
  - Legal and compliance
  - Finance and accounting
  - Human resources
  - IT infrastructure management

- **Business Development**
  - Market analysis and expansion
  - Partnership development
  - M&A activities

### Technical Infrastructure
- Located in: `/TIS-Platform/`
- Key Components:
  - Dashboard and analytics
  - Client management
  - Invoice and payment systems
  - Supplier management

---

## 2. TIS-IntelliMat (Tis-Intelimat.net)
**Operations Domain | AWS Route 53**

### Purpose
Core operational systems and business intelligence platform for day-to-day business operations.

### Service Lines
- **Business Intelligence & Analytics**
  - Real-time operational dashboards
  - Performance metrics and KPIs
  - Board pack generation
  - Data visualization

- **Sales & CRM**
  - Lead qualification (AI-assisted)
  - Client relationship management
  - Opportunity tracking
  - Sales pipeline analytics

- **Financial Operations**
  - Invoice generation and management
  - Payment processing
  - Revenue tracking
  - Financial reporting

- **Supplier & Vendor Management**
  - Supplier onboarding
  - Performance monitoring
  - Compliance tracking

### Technical Infrastructure
- DNS: AWS Route 53
- Platform: `/TIS-Platform/apps/web/`
- APIs:
  - `/app/api/sales/qualify/` - AI-powered lead qualification
  - `/app/api/analytics/boardpack/` - Executive reporting
  - `/app/api/invoices/` - Financial operations
  - `/app/api/suppliers/` - Supplier management
  - `/app/api/clients/` - CRM functionality

### Integration Points
- Connected to ESG Navigator for supplier ESG data
- Financial data flows to TIS Holdings consolidation
- Training data shared with Research & Innovation domain

---

## 3. TIS Holdings Research & Innovation (tis-holdings.com)
**R&D Domain | Research, Innovation & Training**

### Purpose
Innovation hub focused on research, development, and knowledge transfer through training programs.

### Service Lines
- **Research & Development**
  - AI and machine learning research
  - ESG methodology development
  - Product innovation
  - Technology evaluation

- **Training & Education**
  - Corporate training programs
  - ESG compliance training
  - Technical skills development
  - Certification programs

- **Innovation Lab**
  - Proof of concept development
  - Emerging technology pilots
  - Agent-based system development
  - API and integration testing

- **Consulting Services**
  - ESG advisory
  - Technology consulting
  - Change management
  - Digital transformation

### Technical Infrastructure
- Platform: `/TIS-Platform/apps/web/app/training/`
- APIs:
  - `/app/api/training/` - Training management
  - `/app/api/ai/assess/` - AI assessment tools
  - `/app/api/registration/` - Course registration

### Innovation Focus Areas
1. **AI Agent Development** (see Agent Strategy below)
2. Automated ESG assessment tools
3. Predictive analytics for compliance
4. Natural language processing for regulatory documents

---

## 4. ESG Navigator (esgnavigator - Domain TBD)
**SaaS Domain | ESG/GRC Platform**

### Purpose
Standalone SaaS platform providing ESG (Environmental, Social, Governance) and GRC (Governance, Risk, Compliance) solutions.

### Service Lines
- **ESG Assessment & Monitoring**
  - Supplier ESG profiling
  - Compliance tracking
  - Risk assessment
  - Performance benchmarking

- **GRC Solutions**
  - Governance frameworks
  - Risk management
  - Compliance automation
  - Audit trail management

- **Reporting & Analytics**
  - ESG scorecards
  - Regulatory reporting
  - Stakeholder reports
  - Custom dashboards

- **Advisory Services**
  - ESG strategy development
  - Compliance roadmaps
  - Sustainability planning
  - Supplier engagement programs

### Technical Infrastructure
- Platform: `/esg-navigator/`
- Architecture: Monorepo with API and Web apps
- Services:
  - `/apps/api/src/services/anthropic.service.ts` - AI integration
  - `/apps/api/src/services/claude.service.ts` - Claude AI
  - `/apps/api/src/services/supplier.service.ts` - Supplier management
  - `/apps/api/src/services/auth.service.ts` - Authentication

### Pricing Model
- **STARTER**: R150K/year (up to 25 suppliers)
- **PROFESSIONAL**: R450K/year (up to 100 suppliers) - Most Popular
- **ENTERPRISE**: R1.2M/year (unlimited suppliers)
- 30-day free trial available
- Contact: sales@esgnavigator.ai

### Market Position
- B2B SaaS platform
- Target: Medium to large enterprises
- Focus: Supply chain ESG compliance
- Competitive advantage: AI-powered insights

---

## 🤖 Agent Development Strategy

### Overview
Agent-based systems represent a strategic initiative across all domains, with particular emphasis on ESG Navigator as the flagship SaaS product.

### Agent Architecture Principles

#### 1. **Autonomous Agents**
- Self-contained units with specific domain expertise
- Event-driven architecture
- Asynchronous communication
- State management and persistence

#### 2. **Agent Categories**

**Assessment Agents**
- ESG data analysis
- Compliance scoring
- Risk evaluation
- Gap analysis
- *Primary home: ESG Navigator*

**Advisory Agents**
- Regulatory guidance
- Best practice recommendations
- Remediation planning
- Stakeholder communication
- *Shared: ESG Navigator + Research Domain*

**Operational Agents**
- Data collection and validation
- Report generation
- Alert and notification management
- Workflow automation
- *Shared: IntelliMat + ESG Navigator*

**Intelligence Agents**
- Market research
- Trend analysis
- Predictive modeling
- Competitor monitoring
- *Primary home: Research & Innovation*

#### 3. **Technology Stack for Agents**

**Core Technologies**
- **AI/ML Framework**: Anthropic Claude API (already integrated)
- **Agent Framework**: LangChain or custom agent orchestration
- **Message Queue**: Redis/RabbitMQ for agent communication
- **State Management**: PostgreSQL + Redis for agent state
- **Monitoring**: Agent performance tracking and logging

**Integration Patterns**
```
User/System Input
    ↓
Agent Router
    ↓
├─ Assessment Agent → Analysis → Results
├─ Advisory Agent → Recommendations → Action Items
├─ Intelligence Agent → Research → Insights
└─ Operational Agent → Execution → Confirmation
```

#### 4. **Agent Development Priorities**

**Phase 1: Foundation (Q1 2025)**
- [ ] Design agent communication protocol
- [ ] Implement agent orchestration layer
- [ ] Build core assessment agent for ESG
- [ ] Create agent monitoring dashboard
- **Location**: `/esg-navigator/apps/api/src/agents/`

**Phase 2: Expansion (Q2 2025)**
- [ ] Develop advisory agent with Claude integration
- [ ] Create operational agents for data collection
- [ ] Implement multi-agent collaboration
- [ ] Add agent versioning and rollback
- **Location**: Shared across domains

**Phase 3: Intelligence (Q3 2025)**
- [ ] Build intelligence agents for market analysis
- [ ] Create training data generation agents
- [ ] Implement agent learning and improvement
- [ ] Deploy cross-domain agent coordination
- **Location**: Research & Innovation domain

**Phase 4: Scale (Q4 2025)**
- [ ] Agent marketplace for custom agents
- [ ] Multi-tenant agent isolation
- [ ] Agent performance optimization
- [ ] Enterprise agent deployment tools

#### 5. **SaaS-Specific Considerations**

**Multi-Tenancy**
- Each client gets isolated agent instances
- Shared agent knowledge base with tenant filtering
- Resource allocation and rate limiting per tenant

**Scalability**
- Horizontal scaling of agent workers
- Load balancing across agent instances
- Caching for common agent responses
- Background job processing for long-running agents

**Security**
- Agent action authorization
- Data access control per tenant
- Audit logging of all agent actions
- Secure API key management for AI services

**Monitoring & Analytics**
- Agent performance metrics
- Usage tracking per client
- Cost attribution (especially for Claude API calls)
- Quality scoring for agent outputs

#### 6. **Integration Points**

**ESG Navigator ↔ IntelliMat**
- Supplier data synchronization
- Financial metrics for ESG scoring
- Alert routing to operational systems

**ESG Navigator ↔ Research & Innovation**
- New assessment methodologies
- Training data for agent improvement
- Beta testing of new agent capabilities

**All Domains ↔ TIS Holdings**
- Consolidated reporting
- Strategic insights from agent analytics
- Resource allocation decisions

---

## Domain Alignment Matrix

| Service Line | TIS Holdings | IntelliMat | Research & Innovation | ESG Navigator |
|-------------|--------------|------------|---------------------|---------------|
| Strategy & Governance | ● Primary | ○ | ○ | ○ |
| Business Intelligence | ○ | ● Primary | ○ | ● Primary |
| Sales & CRM | ○ | ● Primary | ○ | ○ |
| Financial Ops | ● Primary | ● Primary | ○ | ○ |
| Supplier Management | ○ | ● Primary | ○ | ● Primary |
| Research & Development | ○ | ○ | ● Primary | ○ |
| Training & Education | ○ | ○ | ● Primary | ○ |
| ESG/GRC Services | ○ | ○ | ○ | ● Primary |
| Agent Development | ○ | ○ | ● Primary | ● Primary |
| Consulting | ○ | ○ | ● Primary | ● Primary |

**Legend**: ● Primary responsibility | ○ Supporting role

---

## Implementation Roadmap

### Immediate (Month 1-2)
1. ✅ Document business domain structure (this document)
2. Configure DNS and routing for all domains
3. Establish domain-specific branding and content
4. Set up cross-domain authentication (SSO)

### Short-term (Month 3-6)
1. Develop agent orchestration framework
2. Launch Phase 1 agents in ESG Navigator
3. Create innovation lab infrastructure
4. Establish training program catalog

### Medium-term (Month 7-12)
1. Full agent deployment across ESG Navigator
2. Launch research consulting services
3. Implement cross-domain analytics
4. Scale ESG Navigator to 50+ clients

### Long-term (Year 2+)
1. Agent marketplace launch
2. International expansion
3. Additional SaaS products from R&D
4. Strategic partnerships and integrations

---

## Technical Standards Across Domains

### API Design
- RESTful APIs with OpenAPI specification
- GraphQL for complex data requirements
- Webhook support for real-time events
- Rate limiting and authentication

### Data Standards
- Shared data models for common entities (suppliers, clients)
- Cross-domain data synchronization protocols
- Privacy-by-design principles
- GDPR and POPIA compliance

### Security
- OAuth 2.0 / OpenID Connect for authentication
- Role-based access control (RBAC)
- Encryption at rest and in transit
- Regular security audits

### Monitoring
- Centralized logging (ELK stack or similar)
- Application performance monitoring
- Business metrics tracking
- Incident response procedures

---

## Contact & Governance

**Domain Owners**
- TIS Holdings: Executive leadership
- IntelliMat: Operations Director
- Research & Innovation: CTO / Head of R&D
- ESG Navigator: Product Owner / SaaS Lead

**Technical Governance**
- Architecture review board
- Quarterly domain alignment review
- Shared technology standards committee
- Agent development working group

**Documentation**
- This document: Business domain structure
- `/esg-navigator/DEPLOYMENT.md`: ESG Navigator deployment
- `/esg-navigator/docs/MARKETPLACE_PRICING.md`: Pricing strategy
- Additional domain-specific documentation in respective directories

---

*Last Updated: 2025-11-24*
*Version: 1.0*
*Maintained by: TIS Holdings Technical Team*
