# ESG Navigator Pro - Business-Oriented File Structure Proposal

## Overview
This proposal reorganizes the codebase from a **technical-type structure** to a **business-domain structure** for better maintainability and team collaboration.

---

## 🎯 Proposed Structure

```
esg-navigator/
├── apps/
│   ├── web/                          # Next.js Frontend (Consolidated)
│   │   ├── app/                      # Next.js App Router (PRIMARY)
│   │   │   ├── (marketing)/          # Route group - Public pages
│   │   │   │   ├── page.tsx          # Landing page
│   │   │   │   └── layout.tsx        # Marketing layout
│   │   │   │
│   │   │   ├── (platform)/           # Route group - Authenticated platform
│   │   │   │   ├── dashboard/
│   │   │   │   │   ├── page.tsx
│   │   │   │   │   └── components/   # Dashboard-specific components
│   │   │   │   │       ├── metrics-grid.tsx
│   │   │   │   │       ├── emissions-chart.tsx
│   │   │   │   │       ├── agent-status.tsx
│   │   │   │   │       └── recent-activity.tsx
│   │   │   │   │
│   │   │   │   ├── assessments/
│   │   │   │   │   ├── page.tsx
│   │   │   │   │   ├── [framework]/
│   │   │   │   │   │   └── page.tsx
│   │   │   │   │   └── components/   # Assessment-specific components
│   │   │   │   │       ├── assessment-card.tsx
│   │   │   │   │       ├── question-form.tsx
│   │   │   │   │       └── progress-tracker.tsx
│   │   │   │   │
│   │   │   │   ├── suppliers/
│   │   │   │   │   ├── page.tsx
│   │   │   │   │   ├── [id]/
│   │   │   │   │   │   └── page.tsx
│   │   │   │   │   └── components/   # Supplier-specific components
│   │   │   │   │       ├── supplier-card.tsx
│   │   │   │   │       ├── risk-badge.tsx
│   │   │   │   │       └── esg-score-chart.tsx
│   │   │   │   │
│   │   │   │   ├── ai-insights/
│   │   │   │   │   ├── page.tsx
│   │   │   │   │   └── components/
│   │   │   │   │       ├── chat-interface.tsx
│   │   │   │   │       ├── insight-card.tsx
│   │   │   │   │       └── quick-questions.tsx
│   │   │   │   │
│   │   │   │   ├── training/
│   │   │   │   │   ├── page.tsx
│   │   │   │   │   └── components/
│   │   │   │   │       ├── module-card.tsx
│   │   │   │   │       └── progress-bar.tsx
│   │   │   │   │
│   │   │   │   └── layout.tsx        # Platform layout (with nav)
│   │   │   │
│   │   │   ├── (auth)/                # Route group - Authentication
│   │   │   │   ├── login/
│   │   │   │   │   └── page.tsx
│   │   │   │   └── layout.tsx         # Auth layout
│   │   │   │
│   │   │   ├── api/                   # Next.js API Routes
│   │   │   │   ├── emails/
│   │   │   │   │   └── send/
│   │   │   │   │       └── route.ts
│   │   │   │   ├── assessments/
│   │   │   │   │   └── route.ts
│   │   │   │   ├── app-suppliers/
│   │   │   │   │   └── route.ts
│   │   │   │   └── proxy/
│   │   │   │       └── [...path]/
│   │   │   │           └── route.ts
│   │   │   │
│   │   │   ├── layout.tsx             # Root layout
│   │   │   └── globals.css            # SINGLE global styles file
│   │   │
│   │   ├── components/                # SHARED components only
│   │   │   ├── ui/                    # Reusable UI primitives
│   │   │   │   ├── button.tsx
│   │   │   │   ├── card.tsx
│   │   │   │   ├── badge.tsx
│   │   │   │   └── input.tsx
│   │   │   │
│   │   │   └── layout/                # Shared layout components
│   │   │       ├── header.tsx
│   │   │       ├── footer.tsx
│   │   │       └── navigation.tsx
│   │   │
│   │   ├── lib/                       # Shared utilities & configurations
│   │   │   ├── api/                   # API client & helpers
│   │   │   │   ├── client.ts          # Axios instance
│   │   │   │   ├── suppliers.ts       # Supplier API calls
│   │   │   │   └── assessments.ts     # Assessment API calls
│   │   │   │
│   │   │   ├── utils/                 # Utility functions
│   │   │   │   ├── slug.ts
│   │   │   │   ├── formatters.ts
│   │   │   │   └── validators.ts
│   │   │   │
│   │   │   └── constants/             # App-wide constants
│   │   │       ├── routes.ts
│   │   │       └── api-endpoints.ts
│   │   │
│   │   ├── hooks/                     # Shared React hooks
│   │   │   ├── useWebSocket.ts
│   │   │   ├── useAuth.ts
│   │   │   └── useSuppliers.ts
│   │   │
│   │   ├── types/                     # TypeScript type definitions
│   │   │   ├── supplier.ts
│   │   │   ├── assessment.ts
│   │   │   └── user.ts
│   │   │
│   │   ├── public/                    # Static assets
│   │   │
│   │   ├── next.config.mjs
│   │   ├── tailwind.config.js
│   │   ├── tsconfig.json
│   │   └── package.json
│   │
│   └── api/                           # Express.js Backend (ALREADY WELL-ORGANIZED!)
│       └── src/
│           ├── agents/                # 9 AI agents (by business function)
│           │   ├── base/
│           │   │   └── agent.base.ts
│           │   ├── esg-assessor.agent.ts
│           │   ├── supplier-screener.agent.ts
│           │   ├── emissions-accountant.agent.ts
│           │   ├── standards-mapper.agent.ts
│           │   ├── assurance-copilot.agent.ts
│           │   ├── tsf-watch.agent.ts
│           │   ├── iso-50001-coach.agent.ts
│           │   ├── energy-optimizer.agent.ts
│           │   ├── board-briefing-bot.agent.ts
│           │   └── agent-manager.ts
│           │
│           ├── routes/                # API routes (by business domain)
│           │   ├── auth.routes.ts
│           │   ├── suppliers.routes.ts
│           │   ├── claude.routes.ts
│           │   └── agents.routes.ts
│           │
│           ├── services/              # Business logic layer
│           │   ├── auth.service.ts
│           │   ├── supplier.service.ts
│           │   └── claude.service.ts
│           │
│           ├── models/                # Data models
│           │   └── supplier.model.ts
│           │
│           ├── data/                  # Static/demo data
│           │   └── suppliers.data.ts
│           │
│           ├── middleware/            # Request middleware
│           │   ├── auth.middleware.ts
│           │   └── cors.middleware.ts
│           │
│           ├── config/                # Configuration
│           │   └── config.ts
│           │
│           └── index.ts               # Server entry point
│
├── scripts/                           # Build & deployment scripts
├── docs/                              # Documentation
└── infrastructure/                    # Infrastructure configs

```

---

## 📋 Key Changes

### 1. **Consolidate Web App Structure**
- ✅ Merge `/app` and `/src/app` → Single `/app` directory
- ✅ Remove `/pages` (legacy Pages Router)
- ✅ Merge `/components` and `/src/components` → Single `/components`
- ✅ Merge `/lib` and `/src/lib` → Single `/lib`
- ✅ **One** `globals.css` file

### 2. **Use Next.js Route Groups**
- `(marketing)/` - Public landing pages
- `(platform)/` - Authenticated app pages
- `(auth)/` - Login/register pages
- **Benefit:** Different layouts without affecting URLs

### 3. **Co-locate Feature Components**
Each feature gets its own `components/` folder:
- `/app/(platform)/dashboard/components/` - Dashboard-specific
- `/app/(platform)/assessments/components/` - Assessment-specific
- `/app/(platform)/suppliers/components/` - Supplier-specific

**Shared components** go in root `/components/`

### 4. **Organize Libraries by Purpose**
```
lib/
├── api/          # API client & endpoint calls
├── utils/        # Pure utility functions
└── constants/    # App-wide constants
```

### 5. **Clean Up**
- ❌ Delete `pages__backup_20250116_020813/`
- ❌ Delete `pages__backup_20250116_021015/`
- ❌ Delete duplicate `globals.css` files
- ❌ Remove unused `.bak` files

---

## 🎯 Benefits

### For Development Teams:
1. **Faster navigation** - All files for a feature are in one place
2. **Easier onboarding** - Business domain structure is intuitive
3. **Reduced coupling** - Feature components don't leak across domains
4. **Clearer ownership** - Teams can own entire feature directories

### For Maintenance:
1. **No duplicate structures** - Single source of truth
2. **Easier refactoring** - All related code together
3. **Better scalability** - Add new features without restructuring

### For Business:
1. **Aligned with business domains** - Code mirrors business structure
2. **Feature-based development** - Easy to add/remove features
3. **Better collaboration** - Clear boundaries between domains

---

## 🚀 Migration Steps

### Phase 1: Consolidation (Clean up duplicates)
1. Merge `/app` and `/src/app`
2. Merge `/components` and `/src/components`
3. Merge `/lib` and `/src/lib`
4. Delete backup directories
5. Consolidate to single `globals.css`

### Phase 2: Reorganization (Apply new structure)
1. Create route groups: `(marketing)`, `(platform)`, `(auth)`
2. Move pages to appropriate route groups
3. Co-locate feature-specific components
4. Organize shared components in `/components/ui` and `/components/layout`
5. Restructure `/lib` by purpose

### Phase 3: Testing & Validation
1. Update import paths
2. Test all routes
3. Verify API integrations
4. Run build process
5. Update documentation

---

## 📁 Example: Supplier Feature Structure

**BEFORE:**
```
components/SupplierCard.tsx
src/components/dashboard/MetricsGrid.tsx
app/suppliers/page.tsx
app/suppliers/[id]/page.tsx
src/lib/api.ts
```

**AFTER:**
```
app/(platform)/suppliers/
├── page.tsx                    # Supplier list page
├── [id]/
│   └── page.tsx                # Supplier detail page
└── components/
    ├── supplier-card.tsx       # Feature-specific
    ├── risk-badge.tsx          # Feature-specific
    └── esg-score-chart.tsx     # Feature-specific

components/ui/
├── card.tsx                    # Shared UI primitive
└── badge.tsx                   # Shared UI primitive

lib/api/
└── suppliers.ts                # Supplier API calls
```

**Everything for suppliers is in one place!**

---

## ⚠️ Considerations

### Preserve:
- ✅ API structure (already well-organized!)
- ✅ Agent architecture
- ✅ Service layer patterns
- ✅ TypeScript configurations
- ✅ All functionality

### Update:
- 📝 Import paths throughout codebase
- 📝 Documentation
- 📝 Build scripts (if any)
- 📝 CI/CD pipelines (if any)

---

## 🎓 Best Practices Applied

1. **Feature-First Organization** - Group by business domain, not technical type
2. **Co-location** - Keep related code together
3. **Shared vs. Feature Components** - Clear separation
4. **Route Groups** - Organize without affecting URLs
5. **Single Responsibility** - Each directory has clear purpose
6. **Scalability** - Easy to add new features

---

## 🤔 Questions to Confirm

Before I proceed with reorganization:

1. **Do you approve this structure?** Any changes you'd like?
2. **Should I preserve any existing structure** that has specific importance?
3. **Are there any team conventions** I should maintain?
4. **Do you have active development** on any files I should be careful with?

---

## ⏱️ Estimated Scope

- **Files to move/reorganize:** ~50-70 files
- **Import paths to update:** ~100-150 imports
- **Route groups to create:** 3 groups
- **Components to co-locate:** ~15-20 components
- **Cleanup items:** ~10-15 files/folders to delete

---

**Ready to proceed?** Let me know if you'd like me to:
1. Execute this reorganization
2. Modify the proposal
3. Do a smaller pilot first (e.g., just suppliers feature)
