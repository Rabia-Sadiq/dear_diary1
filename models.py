from datetime import datetime
from app import db

class Thought(db.Model):
    """Model for storing anonymous thoughts"""
    id = db.Column(db.Integer, primary_key=True)
    content = db.Column(db.Text, nullable=False)
    created_at = db.Column(db.DateTime, default=datetime.utcnow, nullable=False)
    
    def __repr__(self):
        return f'<Thought {self.id}: {self.content[:50]}...>'
    
    def get_formatted_date(self):
        """Return formatted date for display"""
        return self.created_at.strftime('%B %d, %Y at %I:%M %p')
    
    def get_preview(self, length=100):
        """Return preview of thought content"""
        if len(self.content) <= length:
            return self.content
        return self.content[:length] + '...'
