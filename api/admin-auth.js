const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || 'admin123';

export default function handler(req, res) {
    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method not allowed' });
    }

    const password = req.body.password || '';
    
    if (password === ADMIN_PASSWORD) {
        // Set cookie for admin authentication
        res.setHeader('Set-Cookie', [
            'admin-auth=true; HttpOnly; Path=/; Max-Age=3600; SameSite=Strict'
        ]);
        res.status(200).json({ success: true });
    } else {
        res.status(401).json({ error: 'Invalid password. Please try again.' });
    }
}