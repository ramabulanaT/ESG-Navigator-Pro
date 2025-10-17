"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const app = (0, express_1.default)();
const PORT = process.env.PORT || 5050;
// Allow requests from both frontends
app.use((0, cors_1.default)({
    origin: ['http://localhost:3000', 'http://localhost:4000'],
    credentials: true
}));
app.use(express_1.default.json());
app.get('/health', (req, res) => {
    res.json({ status: 'healthy', timestamp: new Date().toISOString() });
});
app.get('/api/v1/metrics/summary', (req, res) => {
    console.log('Metrics requested from:', req.headers.origin);
    res.json({
        coverageRate: 98,
        daysToInventory: 8,
        auditPrepTimeSaved: 42,
        activeAlerts: 3
    });
});
app.listen(PORT, () => {
    console.log('Backend running on http://localhost:' + PORT);
});
