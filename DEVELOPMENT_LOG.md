# SmartHireDevelopment Log

## 1. Initial Setup
- Created React frontend with Vite
- Set up Flask backend with SQLAlchemy
- Configured PostgreSQL database
- Implemented basic authentication routes

## 2. Authentication System
- Implemented user registration and login
- Added password hashing with Werkzeug
- Created User, IntervieweeProfile, and RecruiterProfile models
- Set up session management with Flask-Session

## 3. Frontend Development
- Created responsive dashboard layouts
- Implemented navigation with React Router
- Added theme switching (dark/light mode)
- Created reusable UI components

## 4. Database Migrations
- Set up Flask-Migrate with Alembic
- Created initial migration for user tables
- Configured PostgreSQL connection

## 5. CORS Configuration
- Fixed cross-origin issues between frontend and backend
- Configured CORS to allow credentials
- Set up proper headers for authentication

## 6. Session Management Issues
- Initially used filesystem sessions
- Encountered issues with session persistence
- Debugged session cookie handling

## 7. User Flow Implementation
- Implemented signup → login → dashboard flow
- Added onboarding for interviewees
- Created protected routes based on user roles

## 8. Profile Management
- Added profile creation during onboarding
- Implemented profile data retrieval
- Created user avatar dropdown with profile info

## 9. Assessment System (Planned)
- Design assessment creation interface
- Implement candidate evaluation system
- Add results and analytics dashboard

## 10. Session Authentication Bug: Debugging and Solution

### Problem
Users were getting "Not authenticated" errors on protected endpoints like `/onboarding` and `/me`, even after successful login.

### Root Cause Analysis
1. **Cross-origin cookie issue**: The frontend (localhost:5173) wasn't sending session cookies to the backend (localhost:5000)
2. **Missing credentials**: The fetch requests weren't including `credentials: "include"`
3. **Session persistence**: Sessions weren't being maintained between requests

### Solution
1. **Fixed client-side fetch requests**:
   ```javascript
   // In Login.jsx
   const res = await fetch(`${import.meta.env.VITE_API_URL}/login`, {
     method: "POST",
     headers: { "Content-Type": "application/json" },
     credentials: "include", // Added this line
     body: JSON.stringify({
       email: formData.email,
       password: formData.password,
     }),
   })
   ```

2. **Added `/me` endpoint** for user profile data:
   ```python
   @auth_bp.route('/me', methods=['GET'])
   def get_current_user():
       user_id = session.get('user_id')
       if not user_id:
           return jsonify({'error': 'Not authenticated'}), 401
       # ... fetch and return user data
   ```

3. **Updated frontend to fetch user details**:
   ```javascript
   // In DashboardNavbar.jsx
   fetch(`${import.meta.env.VITE_API_URL}/me`, {
     credentials: "include",
   })
   ```

### Result
- Authentication flow now works correctly
- Session cookies are properly sent with requests
- User profile data is displayed in dashboard dropdowns

## 11. Database Reset Script for Development

### Problem
During development, we needed a way to clear the database and start fresh without manually dropping tables.

### Solution
Created `server/scripts/clear_db.sh`:
```bash
#!/bin/bash
# Clear all data from SmartHiredatabase tables and reset identity sequences (for development only)

set -e

DB_NAME="SmartHire"
DB_USER="postgres"

psql -U $DB_USER -d $DB_NAME <<EOF
TRUNCATE TABLE interviewee_profile RESTART IDENTITY CASCADE;
TRUNCATE TABLE recruiter_profile RESTART IDENTITY CASCADE;
TRUNCATE TABLE "user" RESTART IDENTITY CASCADE;
EOF

echo "Database $DB_NAME cleared and sequences reset."
```

### Usage
```bash
cd server/scripts
sudo -u postgres ./clear_db.sh
```

### Result
- Quick database reset for development
- Preserves table structure while clearing data
- Resets auto-increment sequences

## 12. Database-Based Sessions Implementation

### Problem
Flask-Session's built-in SQLAlchemy backend wasn't working properly in our environment, causing sessions to not persist between requests.

### Root Cause Analysis
1. **Flask-Session SQLAlchemy backend issues**: The built-in backend had compatibility issues with our PostgreSQL setup
2. **Memoryview data type**: PostgreSQL was returning session data as memoryview objects instead of strings
3. **Session table conflicts**: Custom Session model conflicted with Flask-Session's auto-generated table

### Solution
Implemented a custom database session interface:

1. **Removed conflicting Session model** from `models.py`

2. **Created custom DatabaseSessionInterface**:
   ```python
   class DatabaseSessionInterface(SessionInterface):
       def open_session(self, app, request):
           # Load session from database with proper memoryview handling
           
       def save_session(self, app, session, response):
           # Save session to database and set cookies
   ```

3. **Fixed memoryview data handling**:
   ```python
   # Convert memoryview to string if needed
   data_str = session_record.data
   if hasattr(data_str, 'tobytes'):
       data_str = data_str.tobytes().decode('utf-8')
   elif isinstance(data_str, memoryview):
       data_str = data_str.tobytes().decode('utf-8')
   
   data = json.loads(data_str)
   ```

4. **Configured custom session interface**:
   ```python
   # Set up custom session interface
   app.session_interface = DatabaseSessionInterface(app)
   ```

### Key Features
- **Direct database storage**: Sessions are stored directly in PostgreSQL
- **Automatic expiry**: Sessions expire after 1 day (non-permanent) or 31 days (permanent)
- **Memoryview handling**: Properly handles PostgreSQL's memoryview data type
- **Error recovery**: Automatically cleans up invalid or expired sessions

### Database Schema
```sql
CREATE TABLE session (
    id SERIAL PRIMARY KEY,
    session_id VARCHAR(255) UNIQUE NOT NULL,
    data TEXT NOT NULL,  -- JSON string
    expiry TIMESTAMP NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

### Result
-  Sessions persist between requests
-  User authentication works correctly
-  `/me` endpoint returns proper user data
-  Session data stored in database (not filesystem)
-  Automatic session cleanup on expiry
-  Clean terminal output (no debug logs)

### Usage
Sessions are now automatically managed:
- **Login**: Creates session in database
- **Subsequent requests**: Loads session from database
- **Logout**: Session is deleted from database
- **Expiry**: Sessions automatically cleaned up

## 13. Flask Configuration Improvements

### Problem
Flask was defaulting to `127.0.0.1` instead of `localhost` for development.

### Solution
Created `server/.flaskenv`:
```
FLASK_RUN_HOST=localhost
```

### Result
- `flask run` now defaults to `http://localhost:5000`
- Consistent with frontend configuration
- Better development experience

## 14. User Flow Enhancements

### Problem
User registration and login flow needed improvement for better UX.

### Solution
1. **Simplified signup flow**: All users are redirected to login page after signup
2. **Protected onboarding**: Only authenticated interviewees who haven't completed onboarding can access `/onboarding`
3. **Role-based redirects**: Users are redirected to appropriate dashboards based on role and onboarding status

### Implementation
```javascript
// In App.jsx - OnboardingGuard component
function OnboardingGuard({ children }) {
  const { user } = useAuth()
  if (!user) return <Navigate to="/login" replace />
  if (user.role !== "interviewee") return <Navigate to="/" replace />
  if (user.onboarding === false) return children
  return <Navigate to="/interviewee/dashboard" replace />
}
```

### Result
- Cleaner user experience
- Proper route protection
- Logical flow: signup → login → onboarding (if needed) → dashboard

## 15. User Profile Management & Avatar Upload

### Problem
Users needed the ability to manage their profile information, including uploading and updating their avatar, with support for both interviewees and recruiters. The system also needed to serve avatar images and ensure profile data is always up-to-date and robustly handled.

### Solution
1. **Backend Enhancements**:
   - Added `/profile` GET/POST endpoints to fetch and update user profile data for both interviewees and recruiters.
   - Added `/profile/avatar` POST endpoint for avatar upload, with file storage in `server/uploads/avatars/` and automatic deletion of old avatars.
   - Added `/uploads/avatars/<filename>` route to serve avatar images directly from the backend.
   - Updated `/me` endpoint to include the `avatar` field for the current user, so the frontend can always display the correct avatar (including in the navbar dropdown).
   - Improved error handling for profile updates and avatar uploads (e.g., file size/type checks, missing file, etc).
   - Suppressed terminal logging for avatar image requests to keep logs clean.

2. **Frontend Enhancements**:
   - Updated profile pages for both interviewees and recruiters to fetch and display all profile fields, including the avatar.
   - Avatar upload now uses the correct backend URL and updates the UI immediately after upload.
   - Navbar and dashboard dropdowns now display the current user's avatar, updating automatically if changed.
   - Improved error and success toasts for all profile and avatar actions.
   - Ensured all API calls use the correct base URL via `VITE_API_URL`.

### Implementation Highlights
- **Profile Fetching**: All relevant fields (name, email, phone, location, company, position, bio, skills, avatar) are fetched and displayed.
- **Avatar Upload**: Users can upload a new avatar, which is stored on the backend and immediately reflected in the UI.
- **Avatar Serving**: Avatars are served via a dedicated Flask route, with CORS and static file handling.
- **Robust Error Handling**: All profile and avatar actions provide clear feedback to the user.
- **Clean Logs**: Avatar image requests are no longer logged in the terminal.

### Result
-  Users can view and update their profile, including uploading a new avatar.
-  Avatars are displayed everywhere (profile page, navbar, dropdown) and update instantly after upload.
-  Backend robustly handles file storage, deletion, and error cases.
-  Clean development logs and improved user experience.

## 16. Assessment Management Features

### Features Implemented
- Added full CRUD (Create, Read, Update, Delete) support for assessments, including associated questions.
- Frontend: Implemented CreateAssessment and EditAssessment pages with dynamic forms for multiple question types (multiple-choice, coding, short-answer, essay).
- Backend: Added `/assessments` and `/assessments/<id>` endpoints for assessment operations, including deadline support and robust validation.
- Added `deadline` field to assessments and ensured it is validated and persisted.
- Enhanced frontend user experience with toast notifications for success and error handling.
- Ensured all question data (including `starter_code`, `solution`, and `answer`) is correctly mapped and persisted.
- Improved frontend-backend data mapping: frontend uses camelCase state, maps to snake_case for API.
- Added CORS preflight handling for all relevant routes.
- Improved error handling and user feedback throughout the assessment workflow.

### Challenges & Solutions
- **Field Mapping Issues**: Coding and short-answer fields (`starter_code`, `solution`, `answer`) were not being saved due to frontend-backend naming mismatches. 
  - *Solution*: Standardized frontend to always map camelCase state to snake_case API fields before sending data.
- **CORS and Session Issues**: Faced CORS errors and session cookie problems during assessment creation and editing.
  - *Solution*: Added Flask-CORS with credentials support, ensured all fetch requests use `credentials: "include"`, and set proper cookie options in Flask config.
- **Database Migration Conflicts**: Encountered issues with missing or conflicting columns (e.g., session table, new fields).
  - *Solution*: Carefully managed Alembic migrations, recreated missing tables, and ensured all schema changes were applied.
- **Frontend/Backend Sync**: Data was not displaying correctly on the edit page due to missing fields in API responses or incorrect state mapping.
  - *Solution*: Updated backend to always return all relevant fields, and frontend to correctly map and display them.
- **Debugging Data Flow**: Needed to verify what data was being sent/received at each step.
  - *Solution*: Added temporary debug print statements in backend, checked browser network tab, and validated database contents after each operation.
- **User Feedback**: Ensured all actions (save, update, delete) provide clear toast notifications for both success and error cases.

### Result
-  Recruiters can create, edit, and delete assessments with all question types and fields.
-  All data is correctly saved, retrieved, and displayed in the UI.
-  Robust error handling and user feedback throughout the workflow.
-  Backend and frontend are fully synchronized for assessment management.

## 17. Assessment Details, Results, and Invite Functionality

### Features Implemented
- Introduced new routes for viewing assessment details, results, and sending invites in the App component.
- Enhanced the Assessments page with navigation to the new routes and updated button actions.
- Implemented the Results component to filter results based on assessment ID and improved layout and design consistency.
- Added a Send Invites page that allows recruiters to send individual or bulk email invitations to candidates for any assessment.
- Backend: Implemented `/send-invite` endpoint to send real email invites using Gmail SMTP, with credentials securely stored in Flask config.
- Added loading spinners and disabled buttons during invite sending to prevent double submissions.
- Provided clear confirmation dialogs and error toasts for all invite actions.

### Challenges & Solutions
- **Frontend/Backend Data Sync**: Ensured that assessment IDs and titles are always correctly matched and displayed in confirmation dialogs.
  - *Solution*: Used string comparison for IDs and always fetched real assessment data from the backend.
- **Email Sending Security**: Needed to securely store and use Gmail SMTP credentials without exposing them to the frontend.
  - *Solution*: Stored credentials in Flask config only, never in client `.env` or frontend code.
- **User Feedback and UX**: Prevented double submissions and provided clear feedback for both success and failure cases.
  - *Solution*: Added loading spinners to invite buttons, disabled them while sending, and used shadcn/ui Dialog and Toast for confirmations and errors.
- **SMTP Integration**: Handled Gmail SMTP connection, authentication, and error handling for both individual and bulk invites.
  - *Solution*: Used `smtplib.SMTP_SSL` with proper error handling and clear user messages on failure.

### Result
-  Recruiters can view detailed assessment info, see filtered results, and send real email invites to candidates.
-  All invite actions are robust, user-friendly, and secure.
-  The UI is consistent and modern across all recruiter pages.
-  Backend and frontend are fully integrated for assessment management and candidate invitations.

## 18. Enhanced Settings Management for Interviewees and Recruiters

### Features Implemented
- Updated the Settings component for both interviewees and recruiters to include new fields for profile management, such as title, website, and social links.
- Implemented avatar and company logo upload functionality with appropriate error handling and user feedback.
- Added notification and privacy settings management for interviewees, allowing users to customize their preferences.
- Introduced backend support for new notification and privacy settings, including dedicated models and routes for managing these features.
- Enhanced password change and two-factor authentication options for improved security.
- Implemented account deletion functionality with confirmation dialog and cookie clearance.

### Issues & Solutions
- **Route Conflicts for Notification Settings:**
  - *Issue:* Both recruiter and interviewee used `/settings/notifications`, causing role-based conflicts and 403 errors.
  - *Solution:* Unified the endpoint to dispatch logic based on user role, ensuring correct settings are loaded and saved for each user type.
- **Session/Cookie Issues After Account Deletion:**
  - *Issue:* After deleting an account and creating a new one in the same tab, stale session cookies caused 401 errors on settings endpoints.
  - *Solution:* Added a utility to clear all cookies on the client after account deletion, ensuring a clean state before redirecting to login.
- **Avatar File Cleanup:**
  - *Issue:* Avatar files were not deleted from disk when a user deleted their account, leading to orphaned files.
  - *Solution:* Backend now deletes the avatar file from the uploads folder when the user account is deleted.
- **SPA State After Deletion:**
  - *Issue:* After account deletion, the SPA sometimes showed the dashboard briefly before redirecting to login, due to in-memory auth state.
  - *Solution:* Used `window.location.href` for a hard redirect and closed the confirmation dialog before redirecting, ensuring the toast is visible and state is reset.
- **Password Field UX:**
  - *Issue:* Eye icons for toggling password visibility were missing or misaligned in settings pages.
  - *Solution:* Updated the UI to wrap each password input in a relative div and absolutely position the eye icon for consistent UX.

### Result
-  Settings management is robust and user-friendly for both interviewees and recruiters.
-  All profile, notification, privacy, and security features are fully integrated with backend support.
-  Account deletion is safe, confirmed, and cleans up all user data and files.
-  User feedback is clear via toasts and confirmation dialogs.
-  All major session and state issues are resolved for a seamless experience.

## 19. Practice Problem Details and User Attempt Tracking

### Features Implemented
- Introduced a new `PracticeProblemDetails` component for recruiters to view detailed information about practice problems, including all content, test cases, hints, learning resources, and user attempt analytics.
- Enhanced the `PracticeArena` component to manage user attempts, including fetching and displaying user statistics (problems solved, success rate, average time, streak) and attempts for practice problems.
- Implemented logic to handle different problem types (coding, multiple choice, short answer) within the PracticeArena, improving user experience and ensuring correct data persistence for each type.
- Updated backend to support storing and retrieving practice problem attempts, including user statistics, streak tracking, and points logic (no double points for retakes, highest score kept).
- Added functionality for recruiters to navigate to problem details from the PracticeProblems component, enhancing usability and providing a comprehensive analytics view.

### Issues & Solutions
- **Frontend/Backend Data Sync:**
  - *Issue:* Some fields (test cases, hints, learning resources) were stored as JSON strings in the database but returned as parsed objects from the backend, causing frontend parsing errors and empty displays.
  - *Solution:* Updated the frontend's `safeJsonParse` utility to handle both JSON strings and already-parsed objects, ensuring robust and error-free rendering.
- **Short Answer Problem Parsing:**
  - *Issue:* Short answer problems sometimes had their `answer_template` stored as a plain string instead of a JSON array, causing backend `JSONDecodeError` on submission.
  - *Solution:* Backend now attempts to parse as JSON, but falls back to treating the value as a single answer if parsing fails or the result is not a list.
- **User Information in Attempts:**
  - *Issue:* Recruiter analytics page only showed user IDs for attempts, not emails or names.
  - *Solution:* Backend now joins with the User table to include user email in each attempt record, and frontend displays this information.
- **Test Case and Resource Display:**
  - *Issue:* Test cases and learning resources were not displaying if the arrays were empty or the data was not parsed correctly.
  - *Solution:* Improved conditional rendering to check for non-empty arrays and display appropriate fallback messages.
- **Button and UI Feedback:**
  - *Issue:* Retake button and attempt tracking UI were not visually distinct or clear.
  - *Solution:* Updated button styles and added badges, attempt counters, and recent activity lists for a more professional and user-friendly experience.

### Result
-  Recruiters can view comprehensive details and analytics for each practice problem, including user attempts and statistics.
-  Interviewees have a robust practice arena with clear progress tracking, attempt limits, and immediate feedback for all problem types.
-  All data (including code submissions, answers, and options) is correctly saved and displayed.
-  UI/UX is modern, responsive, and professional across all new features.
-  Backend and frontend are fully synchronized for practice problem management and analytics.

## 20. Messaging and Notification System Implementation

### Features Implemented
- **Real-time Messaging**: Implemented comprehensive messaging system allowing recruiters and interviewees to communicate directly.
- **Message Management**: Users can send, receive, view conversations, and delete their own messages.
- **Notification System**: Real-time notifications for new messages with customizable settings.
- **Search Functionality**: Search conversations by contact name, message content, or company.
- **Message Deletion**: Users can delete their individual messages with proper security controls.
- **Notification Counter**: Real-time unread notification counter in navbar with automatic updates.

### Backend Implementation

#### Database Models
- **Message Model**: Stores sender_id, receiver_id, content, timestamp, read status, and conversation_id
- **Notification Model**: Stores user_id, type, content, data (JSON), read status, and created_at
- **Notification Settings**: Separate models for recruiters and interviewees with customizable preferences

#### API Endpoints
- **Conversations**: `GET /messages/conversations` - Fetch user's conversations with last message and unread count
- **Messages**: `GET /messages/<conversation_id>` - Fetch messages for a specific conversation
- **Send Message**: `POST /messages/send` - Send a new message with role-based restrictions
- **Delete Message**: `DELETE /messages/<message_id>` - Delete user's own message
- **Mark Read**: `POST /messages/<conversation_id>/mark-read` - Mark all messages in conversation as read
- **Notifications**: `GET /notifications` - Fetch user's notifications
- **Mark All Read**: `POST /notifications/mark-all-read` - Mark all notifications as read
- **Clear All**: `DELETE /notifications/clear-all` - Delete all user notifications
- **Unread Count**: `GET /notifications/unread-count` - Get unread notification count
- **Available Candidates**: `GET /messages/available-candidates` - Get list of interviewees for recruiters

### Frontend Implementation

#### Components
- **Messages Pages**: Separate pages for recruiters and interviewees with conversation list and chat interface
- **NotificationContext**: React context for managing notifications globally across the app
- **MessagingService**: Centralized service for all messaging API calls
- **DashboardNavbar**: Updated to show real-time notification counter

#### UI Features
- **Conversation List**: Shows contact name, last message, timestamp, and unread count
- **Chat Interface**: Real-time message display with proper alignment (own messages on right)
- **Message Actions**: Hover-to-reveal dropdown menu for deleting own messages
- **Search**: Real-time search filtering conversations by name, message, or company
- **Notification Settings**: Toggle switches for email and push notifications

### Issues & Solutions

#### 1. Timestamp Display Issues ("3h ago" Problem)
- **Issue**: Messages and notifications were showing "3h ago" even for recently sent messages due to timezone mismatch between UTC and local time.
- **Root Cause**: Backend was using `datetime.utcnow()` while frontend expected local time, creating a 3-hour offset.
- **Solution**: 
  - Updated backend to use `datetime.now()` for local time instead of UTC
  - Cleared old messages and notifications with outdated timestamps
  - Created fresh test data with current local timestamps
  - Improved frontend timestamp formatting for better accuracy

#### 2. Search Functionality Not Working
- **Issue**: Search input was not filtering conversations in real-time.
- **Solution**: 
  - Added `searchQuery` state to both Messages components
  - Implemented `filteredConversations` logic with case-insensitive search
  - Connected search input to state with real-time filtering
  - Added search by contact name, last message content, and company

#### 3. "Mark All as Read" Not Working
- **Issue**: Backend endpoint for marking all notifications as read was missing.
- **Solution**: 
  - Added `POST /notifications/mark-all-read` endpoint
  - Updated frontend to use the correct endpoint
  - Added proper error handling and toast notifications

#### 4. Missing "Clear All Notifications" Functionality
- **Issue**: Users couldn't clear all their notifications at once.
- **Solution**: 
  - Added `DELETE /notifications/clear-all` endpoint
  - Updated NotificationContext with `clearAllNotifications` function
  - Added "Clear all" button to both notification pages
  - Implemented proper confirmation and feedback

#### 5. Notification Counter Not Updating
- **Issue**: Unread notification counter wasn't updating when new messages arrived.
- **Solution**: 
  - Implemented polling mechanism in NotificationContext (every 30 seconds)
  - Added smart polling that only checks when user is not on messages page
  - Fixed `unread_count` field name in API response
  - Updated DashboardNavbar to display real-time counter

#### 6. Import Error in NotificationContext
- **Issue**: `useNotifications` export was not being found due to development server caching.
- **Solution**: 
  - Restarted Vite development server to clear cache
  - Verified build was successful (no syntax errors)
  - Confirmed proper export structure in NotificationContext

#### 7. Message Deletion Security
- **Issue**: Needed to ensure users can only delete their own messages.
- **Solution**: 
  - Backend validates message ownership before deletion
  - Frontend only shows delete option for user's own messages
  - Proper error handling for unauthorized deletion attempts

### Security Features
- **Role-based Messaging**: Recruiters can initiate conversations, interviewees can only reply
- **Message Ownership**: Users can only delete their own messages
- **Authentication Required**: All messaging endpoints require valid session
- **Data Validation**: Proper validation of message content and recipient existence

### User Experience Features
- **Real-time Updates**: Messages and conversations refresh immediately after actions
- **Visual Feedback**: Toast notifications for all actions (send, delete, mark read)
- **Hover Interactions**: Delete menu appears on hover for user's own messages
- **Responsive Design**: Works on all screen sizes with proper mobile support
- **Loading States**: Proper loading indicators during API calls

### Result
-  **Complete messaging system** with real-time capabilities
-  **Notification system** with customizable settings and real-time counter
-  **Search functionality** for finding conversations quickly
-  **Message deletion** with proper security controls
-  **Robust error handling** and user feedback throughout
-  **Modern UI/UX** with hover effects and responsive design
-  **Backend and frontend fully synchronized** for all messaging features

## Current Status
 **Authentication system working perfectly**
 **Database sessions implemented and tested**
 **User flow working correctly**
 **Profile management functional**
 **Development environment optimized**
 **Messaging and notification system fully implemented**

