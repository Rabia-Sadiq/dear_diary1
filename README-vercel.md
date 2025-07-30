# Dear Diary - Vercel Serverless Version

An anonymous thought-sharing web application optimized for Vercel's serverless platform.

## 🚀 Vercel Deployment

### Quick Deploy
[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/your-username/dear-diary)

### Manual Deployment

1. **Install Vercel CLI**:
   ```bash
   npm i -g vercel
   ```

2. **Deploy to Vercel**:
   ```bash
   vercel
   ```

3. **Set Environment Variables** (optional):
   - `ADMIN_PASSWORD` - Custom admin password (default: admin123)

## 📁 Project Structure

```
dear-diary/
├── api/                    # Serverless functions
│   ├── submit.js          # Handle thought submission
│   ├── admin-auth.js      # Admin authentication
│   ├── admin-thoughts.js  # Fetch thoughts for admin
│   └── admin-logout.js    # Admin logout
├── public/                # Static frontend files
│   ├── index.html         # Homepage
│   ├── thankyou.html      # Thank you page
│   ├── admin-login.html   # Admin login
│   ├── admin.html         # Admin panel
│   ├── css/
│   │   └── style.css      # Custom styles
│   └── js/
│       ├── main.js        # Main functionality
│       └── admin.js       # Admin functionality
├── vercel.json            # Vercel configuration
└── dear_diary.db          # SQLite database
```

## 🔧 Key Features

- **Serverless Architecture**: No long-running servers
- **Static Frontend**: Fast loading HTML/CSS/JS
- **SQLite Database**: Lightweight data storage
- **Cookie-based Auth**: Simple admin authentication
- **Responsive Design**: Mobile-friendly interface

## 🌐 API Endpoints

- `POST /api/submit` - Submit anonymous thought
- `POST /api/admin-auth` - Admin login
- `GET /api/admin-thoughts` - Get all thoughts (admin only)
- `POST /api/admin-logout` - Admin logout

## 🎨 Frontend Pages

- `/` - Homepage with thought submission form
- `/thankyou.html` - Thank you confirmation page
- `/admin-login.html` - Admin login form
- `/admin.html` - Admin panel to view thoughts

## 🔐 Authentication

- Default admin password: `admin123`
- Authentication uses HTTP-only cookies
- Session expires after 1 hour

## 🛠️ Local Development

```bash
# Install dependencies
npm install

# Install Vercel CLI
npm i -g vercel

# Run locally
vercel dev
```

## 📊 Database

Uses SQLite with automatic table creation:

```sql
CREATE TABLE thoughts (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    content TEXT NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);
```

## 🚨 Important Notes

- **Serverless Functions**: Each API call is a separate function invocation
- **Database Persistence**: SQLite file persists across deployments
- **Cold Starts**: First request might be slower due to serverless nature
- **Concurrent Limits**: Vercel has concurrent execution limits

## 📈 Performance

- **Static Files**: Served from Vercel's CDN
- **API Functions**: Fast Node.js serverless functions
- **Database**: Lightweight SQLite for quick queries
- **Caching**: Static assets cached automatically

## 💡 Customization

### Styling
Edit `public/css/style.css` for custom styles.

### Functionality  
Modify API functions in `api/` directory.

### Frontend
Update HTML files in `public/` directory.

## 🔒 Security

- No personal data collection
- Anonymous thought storage
- HTTP-only authentication cookies
- Environment variable configuration

Perfect for Vercel's serverless platform! 🎉