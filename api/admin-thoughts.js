const sqlite3 = require('sqlite3').verbose();
const path = require('path');

// Database connection
const dbPath = path.join(process.cwd(), 'dear_diary.db');
const db = new sqlite3.Database(dbPath);

// Initialize database
db.run(`CREATE TABLE IF NOT EXISTS thoughts (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    content TEXT NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
)`);

function isAuthenticated(req) {
    const cookies = req.headers.cookie || '';
    return cookies.includes('admin-auth=true');
}

export default function handler(req, res) {
    if (req.method !== 'GET') {
        return res.status(405).json({ error: 'Method not allowed' });
    }

    if (!isAuthenticated(req)) {
        return res.status(401).json({ error: 'Authentication required' });
    }
    
    db.all('SELECT * FROM thoughts ORDER BY created_at DESC', (err, thoughts) => {
        if (err) {
            console.error('Error retrieving thoughts:', err);
            return res.status(500).json({ error: 'Error retrieving thoughts from database.' });
        }
        
        // Format dates for display
        thoughts.forEach(thought => {
            const date = new Date(thought.created_at);
            thought.formatted_date = date.toLocaleDateString('en-US', { 
                year: 'numeric', 
                month: 'long', 
                day: 'numeric',
                hour: '2-digit',
                minute: '2-digit'
            });
        });
        
        res.status(200).json({ thoughts });
    });
}