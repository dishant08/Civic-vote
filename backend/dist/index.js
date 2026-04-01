"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const sqlite3_1 = __importDefault(require("sqlite3"));
const sqlite_1 = require("sqlite");
const app = (0, express_1.default)();
const PORT = process.env.PORT || 4000;
app.use((0, cors_1.default)());
app.use(express_1.default.json());
// Database connection helper
let dbPromise;
function setupDatabase() {
    return __awaiter(this, void 0, void 0, function* () {
        dbPromise = (0, sqlite_1.open)({
            filename: './verification.db',
            driver: sqlite3_1.default.Database
        });
        const db = yield dbPromise;
        yield db.exec(`
        CREATE TABLE IF NOT EXISTS verifications (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            name TEXT NOT NULL,
            documentId TEXT NOT NULL,
            walletAddress TEXT NOT NULL UNIQUE,
            status TEXT NOT NULL DEFAULT 'PENDING',
            createdAt DATETIME DEFAULT CURRENT_TIMESTAMP
        )
    `);
    });
}
// User Endpoint: Submit verification request
app.post('/api/verify/request', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { name, documentId, walletAddress } = req.body;
        if (!name || !documentId || !walletAddress) {
            return res.status(400).json({ error: 'Missing required fields' });
        }
        const db = yield dbPromise;
        yield db.run('INSERT INTO verifications (name, documentId, walletAddress) VALUES (?, ?, ?)', [name, documentId, walletAddress]);
        res.status(201).json({ message: 'Verification request submitted successfully' });
    }
    catch (error) {
        if (error.message.includes('UNIQUE constraint failed')) {
            return res.status(409).json({ error: 'Wallet address already submitted' });
        }
        res.status(500).json({ error: 'Internal server error' });
    }
}));
// Admin Endpoint: Get pending requests
app.get('/api/admin/pending', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const db = yield dbPromise;
        const pending = yield db.all('SELECT * FROM verifications WHERE status = "PENDING"');
        res.json(pending);
    }
    catch (error) {
        res.status(500).json({ error: 'Internal server error' });
    }
}));
// Admin Endpoint: Approve request
app.post('/api/admin/approve', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.body;
        if (!id) {
            return res.status(400).json({ error: 'Missing request ID' });
        }
        const db = yield dbPromise;
        const result = yield db.run('UPDATE verifications SET status = "APPROVED" WHERE id = ?', [id]);
        if (result.changes === 0) {
            return res.status(404).json({ error: 'Request not found' });
        }
        res.json({ message: 'Request approved successfully (Note: Blockchain whitelist must be executed by Admin wallet)' });
    }
    catch (error) {
        res.status(500).json({ error: 'Internal server error' });
    }
}));
// Admin Endpoint: Reject request
app.post('/api/admin/reject', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.body;
        if (!id) {
            return res.status(400).json({ error: 'Missing request ID' });
        }
        const db = yield dbPromise;
        const result = yield db.run('UPDATE verifications SET status = "REJECTED" WHERE id = ?', [id]);
        if (result.changes === 0) {
            return res.status(404).json({ error: 'Request not found' });
        }
        res.json({ message: 'Request rejected successfully' });
    }
    catch (error) {
        res.status(500).json({ error: 'Internal server error' });
    }
}));
// Start the server
setupDatabase().then(() => {
    app.listen(PORT, () => {
        console.log(`Verification API server running on http://localhost:${PORT}`);
    });
}).catch(err => {
    console.error("Failed to start database:", err);
});
