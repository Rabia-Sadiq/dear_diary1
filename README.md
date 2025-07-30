# Dear Diary - Node.js Version

An anonymous thought-sharing web application with elegant cream/brown design, built with Node.js and Express.

## Features

- 📝 Anonymous thought submission
- 🎨 Beautiful cream/brown aesthetic design
- 🔐 Password-protected admin panel
- 📱 Responsive mobile-friendly interface
- 💾 SQLite database storage
- ⚡ Real-time character counter
- 🛡️ Privacy-focused (no personal data collected)

## Quick Start

### Prerequisites
- Node.js 18+ installed
- npm or yarn package manager

### Installation

1. Extract the project files
2. Install dependencies:
   ```bash
   npm install
   ```

3. Start the server:
   ```bash
   npm start
   # or
   node server.js
   ```

4. Open your browser to: `http://localhost:3000`

## Usage

### For Users
- Visit the homepage to share anonymous thoughts
- Write your thoughts (up to 2000 characters)
- Submit and receive confirmation

### For Admins
- Go to `/admin/login`
- Default password: `admin123`
- View all submitted thoughts in chronological order

## Configuration

### Environment Variables
- `PORT` - Server port (default: 3000)
- `ADMIN_PASSWORD` - Admin panel password (default: admin123)
- `SESSION_SECRET` - Session encryption key (default: dev key)

### Production Setup
```bash
export ADMIN_PASSWORD=your_secure_password
export SESSION_SECRET=your_random_secret_key
export PORT=80
node server.js
```

## File Structure

```
dear-diary/
├── server.js          # Main Express application
├── package.json       # Dependencies and scripts
├── views/             # EJS templates
│   ├── index.ejs      # Homepage
│   ├── thankyou.ejs   # Thank you page
│   ├── admin.ejs      # Admin panel
│   └── admin_login.ejs # Admin login
├── public/            # Static files
│   ├── css/
│   │   └── style.css  # Custom styles
│   └── js/
│       └── main.js    # Client-side JavaScript
└── dear_diary.db      # SQLite database (auto-created)
```

## Database

The app uses SQLite with a simple schema:

```sql
CREATE TABLE thoughts (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    content TEXT NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);
```

## Deployment

### Replit
1. Upload files to Replit
2. Install dependencies: `npm install`
3. Set environment variables in Secrets
4. Run: `node server.js`

### Heroku
1. Create Heroku app
2. Set environment variables
3. Deploy with Git
4. App will use `PORT` from Heroku

### Other Platforms
Works on any Node.js hosting platform:
- Railway.app
- Render.com
- Fly.io
- DigitalOcean App Platform

## Security Notes

- Change default admin password in production
- Use strong SESSION_SECRET in production
- The app doesn't collect any personal information
- All thoughts are stored anonymously

## License

MIT - Feel free to use and modify!