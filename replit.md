# Dear Diary - Anonymous Thought Sharing Application

## Overview

Dear Diary is a Flask-based web application that provides a safe, anonymous space for users to share their thoughts and feelings. The application features a simple, elegant interface with a cream/brown aesthetic that creates a warm, diary-like atmosphere. Users can submit anonymous thoughts through a web form, and administrators can view all submissions through a password-protected admin panel.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture
- **Framework**: Traditional server-side rendered Flask templates with Jinja2
- **Styling**: Bootstrap 5.3.0 for responsive layout and components
- **Typography**: Google Fonts (Playfair Display for headings, Cormorant Garamond for body text)
- **Icons**: Font Awesome 6.4.0 for consistent iconography
- **JavaScript**: Vanilla JavaScript for client-side interactions (character counting, form validation, auto-resize textarea)

### Backend Architecture
- **Framework**: Flask (Python web framework)
- **Database ORM**: SQLAlchemy with Flask-SQLAlchemy extension
- **Session Management**: Flask's built-in session handling with secret key
- **Security**: Werkzeug for password hashing and basic authentication
- **Deployment**: ProxyFix middleware for handling reverse proxy headers

### Data Storage
- **Primary Database**: SQLite (default) with configurable DATABASE_URL for other databases
- **Connection Pooling**: SQLAlchemy engine options with pool recycling and pre-ping
- **Schema**: Single `Thought` model with id, content, and timestamp fields

## Key Components

### Models
- **Thought Model**: Stores anonymous thoughts with automatic timestamps
  - Fields: id (primary key), content (text), created_at (datetime)
  - Methods: formatted date display, content preview truncation

### Routes and Views
- **Home Route** (`/`): Displays thought submission form
- **Submit Route** (`/submit`): Handles POST requests for new thoughts
- **Admin Routes**: Password-protected admin panel for viewing all thoughts
- **Authentication**: Simple password-based admin access with session management

### Templates
- **Base Template**: Common layout with navigation, flash messages, and styling
- **Index Template**: Main page with thought submission form and character counter
- **Thank You Template**: Confirmation page after successful submission
- **Admin Templates**: Login form and thought management interface

### Static Assets
- **CSS**: Custom styling with CSS variables for consistent theming
- **JavaScript**: Client-side enhancements for form interaction and validation

## Data Flow

1. **Thought Submission Flow**:
   - User visits home page and fills out anonymous thought form
   - Form data submitted via POST to `/submit` route
   - New Thought record created and saved to database
   - User redirected to thank you page with success confirmation

2. **Admin Access Flow**:
   - Admin accesses protected route and enters password
   - Successful authentication creates admin session
   - Admin can view chronological list of all submitted thoughts
   - Session-based access control for admin panel

## External Dependencies

### CDN Resources
- **Bootstrap 5.3.0**: CSS framework for responsive design
- **Google Fonts**: Typography (Playfair Display, Cormorant Garamond)
- **Font Awesome 6.4.0**: Icon library for UI elements

### Python Packages
- **Flask**: Web framework and templating
- **Flask-SQLAlchemy**: Database ORM integration
- **Werkzeug**: Security utilities and WSGI middleware

## Deployment Strategy

### Environment Configuration
- **Database**: Configurable via `DATABASE_URL` environment variable
- **Security**: Session secret via `SESSION_SECRET` environment variable
- **Admin Access**: Admin password via `ADMIN_PASSWORD` environment variable
- **Fallback**: Development defaults for local testing

### Production Considerations
- **Proxy Support**: ProxyFix middleware handles reverse proxy headers
- **Database Pooling**: Connection pool management for better performance
- **Logging**: Debug-level logging configured for troubleshooting
- **Security**: Environment-based secrets and password hashing

### Database Migration
- **Auto-creation**: Tables created automatically on application startup
- **SQLAlchemy**: DeclarativeBase for modern SQLAlchemy patterns
- **Flexibility**: Easy migration to PostgreSQL or other databases via configuration

The application follows a traditional MVC pattern with Flask, prioritizing simplicity and ease of deployment while maintaining security for the admin functionality. The design emphasizes user privacy through anonymous submissions and creates a calming, diary-like user experience.