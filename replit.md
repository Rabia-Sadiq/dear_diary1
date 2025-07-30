# Dear Diary - Anonymous Thought Sharing Application

## Overview

Dear Diary is a Node.js Express-based web application that provides a safe, anonymous space for users to share their thoughts and feelings. The application features a simple, elegant interface with a cream/brown aesthetic that creates a warm, diary-like atmosphere. Users can submit anonymous thoughts through a web form, and administrators can view all submissions through a password-protected admin panel.

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
- **Framework**: Express.js (Node.js web framework)
- **Database**: SQLite3 with native SQL queries
- **Session Management**: Express-session middleware with secret key
- **Security**: Basic password authentication for admin access
- **Template Engine**: EJS for server-side rendering

### Data Storage
- **Primary Database**: SQLite with native sqlite3 module
- **Connection**: Direct database connection with automatic table creation
- **Schema**: Single `thoughts` table with id, content, and created_at fields

## Key Components

### Database Schema
- **Thoughts Table**: Stores anonymous thoughts with automatic timestamps
  - Fields: id (primary key), content (text), created_at (datetime)
  - Features: Date formatting handled in server-side rendering

### Routes and Views
- **Home Route** (`/`): Displays thought submission form using EJS template
- **Submit Route** (`/submit`): Handles POST requests for new thoughts
- **Admin Routes**: Password-protected admin panel for viewing all thoughts
- **Authentication**: Simple password-based admin access with Express sessions

### Templates (EJS)
- **Base Template**: Common layout with navigation, flash messages, and styling
- **Index Template**: Main page with thought submission form and character counter
- **Thank You Template**: Confirmation page after successful submission
- **Admin Templates**: Login form and thought management interface

### Static Assets
- **CSS**: Custom styling with CSS variables for consistent theming (served from public/css/)
- **JavaScript**: Client-side enhancements for form interaction and validation (served from public/js/)

## Data Flow

1. **Thought Submission Flow**:
   - User visits home page and fills out anonymous thought form
   - Form data submitted via POST to `/submit` route
   - New Thought record created and saved to database
   - User redirected to thank you page with success confirmation

2. **Admin Access Flow**:
   - Admin accesses protected route and enters password
   - Successful authentication creates Express session
   - Admin can view chronological list of all submitted thoughts
   - Session-based access control for admin panel

## External Dependencies

### CDN Resources
- **Bootstrap 5.3.0**: CSS framework for responsive design
- **Google Fonts**: Typography (Playfair Display, Cormorant Garamond)
- **Font Awesome 6.4.0**: Icon library for UI elements

### Node.js Packages
- **Express**: Web framework and routing
- **EJS**: Template engine for server-side rendering
- **SQLite3**: Database driver for SQLite
- **Express-session**: Session management middleware
- **Body-parser**: Request body parsing middleware

## Deployment Strategy

### Environment Configuration
- **Database**: SQLite database file (dear_diary.db)
- **Security**: Session secret via `SESSION_SECRET` environment variable
- **Admin Access**: Admin password via `ADMIN_PASSWORD` environment variable
- **Fallback**: Development defaults for local testing

### Production Considerations
- **Static Files**: Express static middleware serves CSS/JS from public directory
- **Database**: SQLite file-based database with automatic table creation
- **Logging**: Console logging for request tracking and troubleshooting
- **Security**: Environment-based secrets and session management

### Database Migration
- **Auto-creation**: Tables created automatically on application startup using CREATE TABLE IF NOT EXISTS
- **SQLite**: Native SQLite3 module for direct database operations
- **Flexibility**: Easy to modify table structure or migrate to other databases

The application follows a traditional MVC pattern with Express.js, prioritizing simplicity and ease of deployment while maintaining security for the admin functionality. The design emphasizes user privacy through anonymous submissions and creates a calming, diary-like user experience.

## Recent Changes

### July 30, 2025 - Node.js Conversion
- **Framework Migration**: Converted from Python Flask to Node.js Express
- **Template Engine**: Migrated from Jinja2 to EJS templates
- **Database**: Switched from SQLAlchemy ORM to native SQLite3 queries
- **Session Management**: Replaced Flask sessions with Express-session middleware
- **File Structure**: Reorganized templates to `views/` and static files to `public/`
- **Functionality**: All original features maintained including anonymous submissions, admin panel, and cream/brown design theme