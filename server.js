const express = require('express');
const sqlite3 = require('sqlite3').verbose();
const bodyParser = require('body-parser');
const session = require('express-session');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

// Database setup
const db = new sqlite3.Database('./dear_diary.db');

// Create thoughts table if it doesn't exist
db.run(`CREATE TABLE IF NOT EXISTS thoughts (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    content TEXT NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
)`);

// Middleware
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(express.static('public'));
app.use(session({
    secret: process.env.SESSION_SECRET || 'dev-secret-key-change-in-production',
    resave: false,
    saveUninitialized: false,
    cookie: { secure: false } // Set to true in production with HTTPS
}));

// Set view engine
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// Admin password
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || 'admin123';

// Routes
app.get('/', (req, res) => {
    res.render('index', { message: null });
});

app.post('/submit', (req, res) => {
    const content = req.body.thought ? req.body.thought.trim() : '';
    
    if (!content) {
        return res.render('index', { 
            message: { type: 'error', text: 'Please write something before submitting.' }
        });
    }
    
    if (content.length > 2000) {
        return res.render('index', { 
            message: { type: 'error', text: 'Your thought is too long. Please keep it under 2000 characters.' }
        });
    }
    
    db.run('INSERT INTO thoughts (content) VALUES (?)', [content], function(err) {
        if (err) {
            console.error('Error saving thought:', err);
            return res.render('index', { 
                message: { type: 'error', text: 'Sorry, there was an error saving your thought. Please try again.' }
            });
        }
        
        console.log(`New thought submitted: ${content.length} characters`);
        res.redirect('/thank-you');
    });
});

app.get('/thank-you', (req, res) => {
    res.render('thankyou');
});

app.get('/admin/login', (req, res) => {
    if (req.session.adminLoggedIn) {
        return res.redirect('/admin');
    }
    res.render('admin_login', { message: null });
});

app.post('/admin/authenticate', (req, res) => {
    const password = req.body.password || '';
    
    if (password === ADMIN_PASSWORD) {
        req.session.adminLoggedIn = true;
        res.redirect('/admin');
    } else {
        res.render('admin_login', { 
            message: { type: 'error', text: 'Invalid password. Please try again.' }
        });
    }
});

app.get('/admin', (req, res) => {
    if (!req.session.adminLoggedIn) {
        return res.redirect('/admin/login');
    }
    
    db.all('SELECT * FROM thoughts ORDER BY created_at DESC', (err, thoughts) => {
        if (err) {
            console.error('Error retrieving thoughts:', err);
            return res.render('admin', { thoughts: [], message: 'Error retrieving thoughts from database.' });
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
        
        res.render('admin', { thoughts, message: null });
    });
});

app.get('/admin/logout', (req, res) => {
    req.session.destroy((err) => {
        if (err) {
            console.error('Error destroying session:', err);
        }
        res.redirect('/');
    });
});

// 404 handler
app.use((req, res) => {
    res.status(404).render('index', { message: null });
});

// Error handler
app.use((err, req, res, next) => {
    console.error('Internal server error:', err);
    res.status(500).render('index', { 
        message: { type: 'error', text: 'An internal error occurred. Please try again later.' }
    });
});

// Start server
app.listen(PORT, '0.0.0.0', () => {
    console.log(`Dear Diary server running on http://0.0.0.0:${PORT}`);
});

module.exports = app;