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

export default function handler(req, res) {
    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method not allowed' });
    }

    const content = req.body.thought ? req.body.thought.trim() : '';
    
    if (!content) {
        return res.status(400).json({ 
            error: 'Please write something before submitting.' 
        });
    }
    
    if (content.length > 2000) {
        return res.status(400).json({ 
            error: 'Your thought is too long. Please keep it under 2000 characters.' 
        });
    }
    
    db.run('INSERT INTO thoughts (content) VALUES (?)', [content], function(err) {
        if (err) {
            console.error('Error saving thought:', err);
            return res.status(500).json({ 
                error: 'Sorry, there was an error saving your thought. Please try again.' 
            });
        }
        
        console.log(`New thought submitted: ${content.length} characters`);
        res.status(200).json({ success: true, message: 'Thought saved successfully' });
    });
}