export default function handler(req, res) {
    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method not allowed' });
    }

    // Clear the admin authentication cookie
    res.setHeader('Set-Cookie', [
        'admin-auth=; HttpOnly; Path=/; Max-Age=0; SameSite=Strict'
    ]);
    
    res.status(200).json({ success: true, message: 'Logged out successfully' });
}