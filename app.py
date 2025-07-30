import os
import logging
from datetime import datetime
from flask import Flask, render_template, request, redirect, url_for, flash, session
from flask_sqlalchemy import SQLAlchemy
from sqlalchemy.orm import DeclarativeBase
from werkzeug.security import check_password_hash, generate_password_hash
from werkzeug.middleware.proxy_fix import ProxyFix

# Configure logging
logging.basicConfig(level=logging.DEBUG)

class Base(DeclarativeBase):
    pass

db = SQLAlchemy(model_class=Base)

# Create the app
app = Flask(__name__)
app.secret_key = os.environ.get("SESSION_SECRET", "dev-secret-key-change-in-production")
app.wsgi_app = ProxyFix(app.wsgi_app, x_proto=1, x_host=1)

# Configure the database
app.config["SQLALCHEMY_DATABASE_URI"] = os.environ.get("DATABASE_URL", "sqlite:///dear_diary.db")
app.config["SQLALCHEMY_ENGINE_OPTIONS"] = {
    "pool_recycle": 300,
    "pool_pre_ping": True,
}

# Initialize the app with the extension
db.init_app(app)

# Import models after db initialization
from models import Thought

# Create tables
with app.app_context():
    db.create_all()

# Admin password (in production, this should be properly hashed and stored)
ADMIN_PASSWORD = os.environ.get("ADMIN_PASSWORD", "admin123")

@app.route('/')
def index():
    """Home page with thought submission form"""
    return render_template('index.html')

@app.route('/submit', methods=['POST'])
def submit_thought():
    """Handle thought submission"""
    content = request.form.get('thought', '').strip()
    
    if not content:
        flash('Please write something before submitting.', 'error')
        return redirect(url_for('index'))
    
    if len(content) > 2000:
        flash('Your thought is too long. Please keep it under 2000 characters.', 'error')
        return redirect(url_for('index'))
    
    try:
        # Create new thought entry
        thought = Thought(content=content)
        db.session.add(thought)
        db.session.commit()
        
        logging.info(f"New thought submitted: {len(content)} characters")
        return redirect(url_for('thank_you'))
        
    except Exception as e:
        logging.error(f"Error saving thought: {e}")
        db.session.rollback()
        flash('Sorry, there was an error saving your thought. Please try again.', 'error')
        return redirect(url_for('index'))

@app.route('/thank-you')
def thank_you():
    """Thank you page after successful submission"""
    return render_template('thankyou.html')

@app.route('/admin/login')
def admin_login():
    """Admin login page"""
    if session.get('admin_logged_in'):
        return redirect(url_for('admin_panel'))
    return render_template('admin_login.html')

@app.route('/admin/authenticate', methods=['POST'])
def admin_authenticate():
    """Handle admin login"""
    password = request.form.get('password', '')
    
    if password == ADMIN_PASSWORD:
        session['admin_logged_in'] = True
        flash('Welcome to the admin panel!', 'success')
        return redirect(url_for('admin_panel'))
    else:
        flash('Invalid password. Please try again.', 'error')
        return redirect(url_for('admin_login'))

@app.route('/admin')
def admin_panel():
    """Admin panel to view all thoughts"""
    if not session.get('admin_logged_in'):
        flash('Please log in to access the admin panel.', 'error')
        return redirect(url_for('admin_login'))
    
    try:
        # Get all thoughts in reverse chronological order
        thoughts = Thought.query.order_by(Thought.created_at.desc()).all()
        return render_template('admin.html', thoughts=thoughts)
        
    except Exception as e:
        logging.error(f"Error retrieving thoughts: {e}")
        flash('Error retrieving thoughts from database.', 'error')
        return render_template('admin.html', thoughts=[])

@app.route('/admin/logout')
def admin_logout():
    """Admin logout"""
    session.pop('admin_logged_in', None)
    flash('You have been logged out.', 'info')
    return redirect(url_for('index'))

@app.errorhandler(404)
def not_found(error):
    """Handle 404 errors"""
    return render_template('index.html'), 404

@app.errorhandler(500)
def internal_error(error):
    """Handle 500 errors"""
    db.session.rollback()
    logging.error(f"Internal server error: {error}")
    flash('An internal error occurred. Please try again later.', 'error')
    return render_template('index.html'), 500

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000, debug=True)
