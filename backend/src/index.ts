import express from 'express';
import cors from 'cors';
import sqlite3 from 'sqlite3';
import { open } from 'sqlite';

const app = express();
const PORT = process.env.PORT || 4000;

app.use(cors());
app.use(express.json());

// Database connection helper
let dbPromise: ReturnType<typeof open>;

async function setupDatabase() {
    dbPromise = open({
        filename: './verification.db',
        driver: sqlite3.Database
    });

    const db = await dbPromise;

    await db.exec(`
        CREATE TABLE IF NOT EXISTS verifications (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            name TEXT NOT NULL,
            documentId TEXT NOT NULL,
            walletAddress TEXT NOT NULL UNIQUE,
            status TEXT NOT NULL DEFAULT 'PENDING',
            createdAt DATETIME DEFAULT CURRENT_TIMESTAMP
        )
    `);
}

// User Endpoint: Submit verification request
app.post('/api/verify/request', async (req, res) => {
    try {
        const { name, documentId, walletAddress } = req.body;

        if (!name || !documentId || !walletAddress) {
            return res.status(400).json({ error: 'Missing required fields' });
        }

        const db = await dbPromise;
        await db.run(
            'INSERT INTO verifications (name, documentId, walletAddress) VALUES (?, ?, ?)',
            [name, documentId, walletAddress]
        );

        res.status(201).json({ message: 'Verification request submitted successfully' });
    } catch (error: any) {
        if (error.message.includes('UNIQUE constraint failed')) {
            return res.status(409).json({ error: 'Wallet address already submitted' });
        }
        res.status(500).json({ error: 'Internal server error' });
    }
});

// Admin Endpoint: Get pending requests
app.get('/api/admin/pending', async (req, res) => {
    try {
        const db = await dbPromise;
        const pending = await db.all('SELECT * FROM verifications WHERE status = "PENDING"');
        res.json(pending);
    } catch (error) {
        res.status(500).json({ error: 'Internal server error' });
    }
});

// Admin Endpoint: Approve request
app.post('/api/admin/approve', async (req, res) => {
    try {
        const { id } = req.body;

        if (!id) {
            return res.status(400).json({ error: 'Missing request ID' });
        }

        const db = await dbPromise;
        const result = await db.run('UPDATE verifications SET status = "APPROVED" WHERE id = ?', [id]);

        if (result.changes === 0) {
            return res.status(404).json({ error: 'Request not found' });
        }

        res.json({ message: 'Request approved successfully (Note: Blockchain whitelist must be executed by Admin wallet)' });
    } catch (error) {
        res.status(500).json({ error: 'Internal server error' });
    }
});

// Admin Endpoint: Reject request
app.post('/api/admin/reject', async (req, res) => {
    try {
        const { id } = req.body;

        if (!id) {
            return res.status(400).json({ error: 'Missing request ID' });
        }

        const db = await dbPromise;
        const result = await db.run('UPDATE verifications SET status = "REJECTED" WHERE id = ?', [id]);

        if (result.changes === 0) {
            return res.status(404).json({ error: 'Request not found' });
        }

        res.json({ message: 'Request rejected successfully' });
    } catch (error) {
        res.status(500).json({ error: 'Internal server error' });
    }
});

// Start the server
setupDatabase().then(() => {
    app.listen(PORT, () => {
        console.log(`Verification API server running on http://localhost:${PORT}`);
    });
}).catch(err => {
    console.error("Failed to start database:", err);
});
