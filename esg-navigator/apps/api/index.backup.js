"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const dotenv_1 = __importDefault(require("dotenv"));
const claude_routes_1 = __importDefault(require("./routes/claude.routes"));
const agents_routes_1 = __importDefault(require("./routes/agents.routes"));
dotenv_1.default.config();
const app = (0, express_1.default)();
const PORT = process.env.PORT || 5050;
app.use((0, cors_1.default)());
app.use(express_1.default.json({ limit: '50mb' }));
// Health check
app.get('/health', (req, res) => {
    res.json({
        status: 'healthy',
        timestamp: new Date().toISOString(),
        claude: process.env.ANTHROPIC_API_KEY ? 'configured' : 'missing',
        agents: 9
    });
});
// Claude AI routes
app.use('/api/claude', claude_routes_1.default);
// AI Agents routes
app.use('/api/agents', agents_routes_1.default);
// Supplier data endpoint
app.get('/api/suppliers', (req, res) => {
    res.json({
        success: true,
        data: {
            portfolio: {
                totalValue: 'R331M',
                overallCompliance: '87.2%',
                activeSuppliers: 5,
                assessmentDate: '2024-10-15'
            },
            suppliers: [
                {
                    id: 1,
                    name: 'Eskom Holdings',
                    contractValue: 'R120M',
                    esgScore: 65,
                    riskLevel: 'HIGH',
                    carbonIntensity: 'high',
                    complianceIssues: 3,
                    certifications: ['ISO 14001'],
                    lastAudit: '2024-08-15'
                },
                {
                    id: 2,
                    name: 'Multotec Processing',
                    contractValue: 'R89M',
                    esgScore: 76,
                    riskLevel: 'MEDIUM',
                    carbonIntensity: 'medium',
                    complianceIssues: 1,
                    certifications: ['ISO 14001', 'OHSAS 18001'],
                    lastAudit: '2024-09-01'
                },
                {
                    id: 3,
                    name: 'Anglo American Platinum',
                    contractValue: 'R67M',
                    esgScore: 82,
                    riskLevel: 'LOW',
                    carbonIntensity: 'low',
                    complianceIssues: 0,
                    certifications: ['ISO 14001', 'ISO 45001', 'SA 8000'],
                    lastAudit: '2024-09-20'
                },
                {
                    id: 4,
                    name: 'Sasol Chemical Industries',
                    contractValue: 'R55M',
                    esgScore: 71,
                    riskLevel: 'MEDIUM',
                    carbonIntensity: 'high',
                    complianceIssues: 2,
                    certifications: ['ISO 14001', 'ISO 9001'],
                    lastAudit: '2024-08-30'
                }
            ]
        }
    });
});
app.listen(PORT, () => {
    console.log(`✅ Backend running on http://localhost:${PORT}`);
    console.log(`🤖 Claude AI: ${process.env.ANTHROPIC_API_KEY ? 'Configured' : 'Not configured'}`);
    console.log(`🔧 9 AI Agents: Active`);
    console.log(`📊 Endpoints available:`);
    console.log(`   - GET  /health`);
    console.log(`   - GET  /api/suppliers`);
    console.log(`   - POST /api/claude/chat`);
    console.log(`   - POST /api/claude/analyze-supplier`);
    console.log(`   - POST /api/claude/generate-report`);
    console.log(`   - GET  /api/agents (list all agents)`);
    console.log(`   - POST /api/agents/:agentName (run agent)`);
});
