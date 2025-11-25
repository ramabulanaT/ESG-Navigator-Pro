# IBM Integrations - Backend Services

## Overview
Backend services for IBM WatsonX Orchestrate and Envizi ESG Suite integrations.

## Structure
```
integrations/
├── watsonx/
│   └── watsonx.service.ts      # WatsonX orchestration service
├── envizi/
│   └── envizi.service.ts       # Envizi ESG data service
└── index.ts                    # Central exports
```

## Environment Variables
Add to your `.env` file:
```bash
# IBM WatsonX Orchestrate
WATSONX_API_KEY=your_watsonx_api_key
WATSONX_SERVICE_URL=https://your-instance.watsonx.ibm.com
WATSONX_PROJECT_ID=your_project_id

# IBM Envizi ESG Suite
ENVIZI_API_KEY=your_envizi_api_key
ENVIZI_BASE_URL=https://your-instance.envizi.com
ENVIZI_ORGANIZATION_ID=your_org_id
```

## Usage in Routes

### Example: WatsonX Integration Route
```typescript
import { watsonxService } from '../integrations';

router.post('/api/watsonx/orchestrate', async (req, res) => {
  try {
    const result = await watsonxService.orchestrateESGAnalysis(
      req.body.input,
      req.body.context
    );
    res.json(result);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});
```

### Example: Envizi Integration Route
```typescript
import { enviziService } from '../integrations';

router.get('/api/envizi/emissions', async (req, res) => {
  try {
    const emissions = await enviziService.syncEmissionsData(
      req.query.startDate,
      req.query.endDate
    );
    res.json(emissions);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});
```

## Integration with Existing Agents

### Connect WatsonX to ESG Assessor Agent
```typescript
import { watsonxService } from '../integrations';
import { ESGAssessor } from '../agents/esg-assessor.agent';

const assessor = new ESGAssessor();
const watsonxResult = await watsonxService.orchestrateESGAnalysis(input);
const assessorResult = await assessor.analyze(watsonxResult);
```

### Connect Envizi to Emissions Accountant Agent
```typescript
import { enviziService } from '../integrations';
import { EmissionsAccountant } from '../agents/emissions-accountant.agent';

const emissions = await enviziService.syncEmissionsData();
const accountant = new EmissionsAccountant();
const analysis = await accountant.analyze(emissions);
```

## Next Steps
1. Configure environment variables
2. Implement API client methods in services
3. Create dedicated routes in `routes/` directory
4. Connect to existing agent framework
5. Add health check endpoints
6. Implement error handling and logging
7. Add integration tests
