# SmartHire

A comprehensive technical assessment platform that automates the in-person technical interview process, similar to Coderbyte. Built with modern web technologies and designed for seamless collaboration between recruiters and interviewees.

## Table of Contents

- [Overview](#overview)
- [Team](#team)
- [Features](#features)
- [Tech Stack](#tech-stack)
- [Architecture](#architecture)
- [Getting Started](#getting-started)
- [Development](#development)
- [Testing](#testing)
- [Deployment](#deployment)
- [API Documentation](#api-documentation)
- [Contributing](#contributing)

## Overview

SmartHireis a full-stack web application that streamlines the technical hiring process by providing:

- **Automated Technical Assessments**: Create and manage coding challenges, multiple-choice questions, and subjective assessments
- **Real-time Evaluation**: Instant feedback and scoring for coding submissions
- **Candidate Management**: Comprehensive tracking of interviewee performance and progress
- **Communication Hub**: Built-in messaging system for recruiters and candidates
- **Practice Arena**: Interactive practice problems to help candidates prepare
- **Analytics Dashboard**: Detailed insights and performance metrics

## Team

**Project Members:**
- **Rochelle Awuor** - Frontend Development & UI/UX
- **David Amedi** - Backend Development & DevOps
- **Dorothy Chepkoech** - Full-Stack Development
- **Isaac Kubai** - Backend Development & Testing

**Team Composition:** Full-Stack Development Team
- **Frontend:** React.js with Vite
- **Backend:** Python Flask with PostgreSQL

## Features

### Authentication & User Management
- **Multi-User Authentication**: Separate flows for recruiters and interviewees
- **Email Verification**: Secure email verification system
- **Password Reset**: Automated password recovery via email
- **Profile Management**: Comprehensive user profiles with avatar upload
- **Session Management**: Secure database-based session handling

### Recruiter Features
- **Assessment Creation**: Create assessments with multiple question types:
  - Multiple choice questions
  - Coding challenges with test cases
  - Short answer questions
  - Essay questions
- **Assessment Management**: Edit, publish, and manage assessments
- **Candidate Invitations**: Send individual or bulk email invitations
- **Results Analytics**: View sorted candidate lists based on scores
- **Performance Statistics**: Detailed analytics and performance metrics
- **Manual Review**: Review and provide feedback on candidate submissions
- **Time Management**: Set time limits and automatic submission
- **Grade Release**: Control when results are released to candidates

### Interviewee Features
- **Assessment Access**: View and accept assessment invitations
- **Real-time Testing**: Take assessments with live countdown timer
- **Practice Arena**: Access practice problems to improve skills
- **Whiteboard Process**: Submit BDD, pseudocode, and code solutions
- **Feedback System**: Receive detailed feedback from recruiters
- **Progress Tracking**: Monitor performance and improvement over time
- **Notification System**: Real-time updates on assessments and results

### Communication System
- **Real-time Messaging**: Direct communication between recruiters and interviewees
- **Notification Center**: Comprehensive notification system
- **File Attachments**: Support for document and media sharing
- **Conversation Management**: Archive and organize conversations

### Practice & Learning
- **Practice Problems**: Curated coding challenges and problems
- **Category Sessions**: Themed practice sessions by topic
- **Progress Tracking**: Monitor improvement and skill development
- **Learning Resources**: Access to hints and educational materials

### Analytics & Reporting
- **Performance Metrics**: Detailed analytics for both recruiters and interviewees
- **Export Functionality**: Export results and analytics in various formats
- **Dashboard Insights**: Real-time performance monitoring
- **Statistical Analysis**: Comprehensive data visualization

## Tech Stack

### Frontend
- **React 18** - Modern UI framework
- **Vite** - Fast build tool and development server
- **React Router** - Client-side routing
- **Tailwind CSS** - Utility-first CSS framework
- **Shadcn/ui** - Modern component library
- **Lucide React** - Icon library
- **Monaco Editor** - Code editor for coding challenges
- **Socket.io Client** - Real-time communication

### Backend
- **Python 3.x** - Server-side language
- **Flask** - Web framework
- **SQLAlchemy** - ORM for database operations
- **PostgreSQL** - Primary database
- **Flask-Migrate** - Database migration management
- **Flask-Session** - Session management
- **Flask-CORS** - Cross-origin resource sharing
- **Gunicorn** - WSGI server for production

### Development & Testing
- **Jest** - JavaScript testing framework
- **Pytest** - Python testing framework
- **ESLint** - JavaScript linting
- **Alembic** - Database migration tool

### External Integrations
- **CodeWars API** - Integration for coding challenges
- **Gmail SMTP** - Email service for notifications and invitations

## Architecture

### Project Structure
```
SmartHire/
├── client/                 # React frontend
│   ├── src/
│   │   ├── components/    # Reusable UI components
│   │   ├── pages/        # Page components
│   │   ├── contexts/     # React contexts
│   │   ├── services/     # API services
│   │   └── lib/          # Utility functions
│   └── public/           # Static assets
├── server/                # Flask backend
│   ├── app/
│   │   ├── models.py     # Database models
│   │   ├── routes.py     # API endpoints
│   │   └── utils.py      # Utility functions
│   ├── migrations/       # Database migrations
│   └── uploads/          # File uploads
└── scripts/              # Development scripts
```

### Database Schema
- **User Management**: Users, profiles, authentication
- **Assessment System**: Assessments, questions, attempts, answers
- **Practice System**: Practice problems, attempts, sessions
- **Communication**: Messages, conversations, notifications
- **Analytics**: Performance tracking and statistics

## Getting Started

### Prerequisites
- **Node.js** (v16 or higher)
- **Python** (v3.8 or higher)
- **PostgreSQL** (v12 or higher)
- **Git**

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/awuorochelle75/SmartHire.git
   cd SmartHire
   ```

2. **Backend Setup**
   ```bash
   cd server
   python -m venv venv
   source venv/bin/activate  # On Windows: venv\Scripts\activate
   pip install -r requirements.txt
   ```

3. **Database Setup**
   ```bash
   # Create PostgreSQL database
   createdb SmartHire
   
   # Set up environment variables
   cp env.example .env
   # Edit .env with your database credentials
   
   # Initialize database
   flask shell
   >>> from app import create_app
   >>> from app.models import db
   >>> app = create_app()
   >>> with app.app_context():
   ...     db.create_all()
   ```

4. **Frontend Setup**
   ```bash
   cd client
   npm install
   ```

5. **Environment Configuration**
   ```bash
   # Backend (.env in server/)
   SECRET_KEY=your-secret-key
   DATABASE_URL=postgresql://user:password@localhost:5432/SmartHire
   GMAIL_USER=your-email@gmail.com
   GMAIL_APP_PASSWORD=your-app-password
   FRONTEND_URL=http://localhost:5173
   
   # Frontend (.env in client/)
   VITE_API_URL=http://localhost:5000
   ```

### Running the Application

1. **Start Backend Server**
   ```bash
   cd server
   python run.py
   # Server runs on http://localhost:5000
   ```

2. **Start Frontend Development Server**
   ```bash
   cd client
   npm run dev
   # Frontend runs on http://localhost:5173
   ```

3. **Access the Application**
   - Open http://localhost:5173 in your browser
   - Register as either a recruiter or interviewee
   - Start exploring the platform!

## Testing

### Backend Testing
```bash
cd server
python -m pytest tests/ -v
```

### Frontend Testing
```bash
cd client
npm test
```

### Test Coverage
- **Backend**: 27 model tests, 29 route tests
- **Frontend**: Component and integration tests
- **Database**: In-memory SQLite for fast testing

## Deployment

### Production Deployment
The application is configured for deployment on:
- **Backend**: Render (Python/Flask)
- **Frontend**: Vercel (React)

### Environment Variables
See [DEPLOYMENT_GUIDE.md](./DEPLOYMENT_GUIDE.md) for detailed deployment instructions.

### Health Check
```bash
curl https://your-backend-domain.com/health
```

## API Documentation

### Authentication Endpoints
- `POST /signup` - User registration
- `POST /login` - User authentication
- `POST /logout` - User logout
- `POST /verify-email` - Email verification
- `POST /forgot-password` - Password reset request

### Assessment Endpoints
- `GET/POST /assessments` - Assessment management
- `GET/PUT/DELETE /assessments/<id>` - Individual assessment operations
- `POST /send-invite` - Send assessment invitations
- `GET /assessments/<id>/results` - Assessment results

### Practice Endpoints
- `GET/POST /practice-problems` - Practice problem management
- `POST /practice-problems/<id>/attempt` - Submit practice attempts
- `GET /practice-categories` - Practice categories

### Communication Endpoints
- `GET /messages/conversations` - User conversations
- `POST /messages/send` - Send messages
- `GET /notifications` - User notifications

## Contributing

### Development Workflow
1. Create a feature branch from `main`
2. Implement your changes
3. Write tests for new functionality
4. Submit a pull request

### Code Standards
- **Python**: Follow PEP 8 guidelines
- **JavaScript**: Use ESLint configuration
- **Database**: Use Alembic for migrations
- **Testing**: Maintain good test coverage

### Branch Strategy
- `main` - Production-ready code
- `feature/*` - New features
- `refactor/*` - Code refactoring
- `test/*` - Testing improvements

## Development Log

See [DEVELOPMENT_LOG.md](./DEVELOPMENT_LOG.md) for detailed development history, including:
- Authentication system implementation
- Database session management
- Assessment creation workflow
- Messaging system development
- Deployment configurations

## Troubleshooting

### Common Issues

1. **Session Authentication Errors**
   - Ensure `credentials: "include"` in fetch requests
   - Check CORS configuration
   - Verify session cookies are being sent

2. **Database Connection Issues**
   - Verify PostgreSQL is running
   - Check database credentials in `.env`
   - Run database migrations

3. **Email Sending Problems**
   - Verify Gmail app password is correct
   - Check SMTP configuration
   - Ensure email credentials are properly set

4. **Frontend Build Issues**
   - Clear node_modules and reinstall
   - Check for missing environment variables
   - Verify all dependencies are installed

## License

This project is developed as part of a team assignment. All rights reserved.

## Acknowledgments

- **CodeWars API** for coding challenge integration
- **Shadcn/ui** for beautiful UI components
- **Vite** for fast development experience
- **Flask** community for excellent documentation

---

**SmartHire** - Revolutionizing technical hiring through intelligent assessment automation.

*Built with ❤️ by Rochelle, David, Dorothy, and Isaac*