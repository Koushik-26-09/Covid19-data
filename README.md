I'll create a comprehensive README file for your COVID-19 Management Dashboard project!

# COVID-19 Management Dashboard

A complete single-page web application for managing COVID-19 data with user authentication and full CRUD operations for states and districts.

## 🚀 Features

### Authentication
- **User Registration** - Create new accounts with username, name, password, gender, and location
- **User Login** - Secure JWT-based authentication
- **Session Management** - Automatic token storage and logout functionality

### Data Management
- **States Operations**
  - View all states in a formatted table
  - Get individual state details by ID
  - View comprehensive state statistics (total cases, cured, active, deaths)

- **Districts Operations**
  - Add new districts with state association
  - View district details by ID
  - Update existing district information
  - Delete districts with confirmation
  - Get district details with associated state name

## 🛠️ Technology Stack

- **Frontend**: Pure HTML5, CSS3, and Vanilla JavaScript
- **Authentication**: JWT (JSON Web Tokens)
- **API Communication**: Fetch API with proper error handling
- **Storage**: localStorage for token persistence
- **Styling**: Custom CSS with responsive design

## 📋 Prerequisites

- Node.js + Express + SQLite backend server running on `http://localhost:3000`
- Modern web browser with JavaScript enabled

## 🚀 Quick Start

### 1. Setup Backend
Ensure your Node.js backend is running with the following endpoints:

POST /login/
POST /register/
GET /states/
GET /states/:stateId/
POST /districts/
GET /districts/:districtId/
DELETE /districts/:districtId/
PUT /districts/:districtId/
GET /states/:stateId/stats/
GET /districts/:districtId/details/


### 2. Launch Application
1. Save the provided HTML code as `index.html`
2. Open `index.html` in your web browser
3. The application will automatically load the login/register interface

### 3. Initial Login
Use the default credentials to get started:
- **Username**: `koushik`
- **Password**: `[your_password]`

*Note: Replace `[your_password]` with the actual password for the koushik account in your database*

## 📱 User Interface

### Login/Register Screen
- Clean, centered authentication forms
- Toggle between login and register modes
- Form validation with error messaging
- Success notifications

### Main Dashboard
- **User Info Bar** - Shows login status with logout option
- **States Management Panel** - All state-related operations
- **Districts Management Panel** - CRUD operations for districts
- **Update District Panel** - Dedicated section for district updates
- **District Details Panel** - View district with state information

## 🔧 Configuration

### API Base URL
To connect to a different backend server, modify the `API_BASE_URL` constant in the JavaScript section:

```javascript
const API_BASE_URL = 'http://your-server:port';
```
### Authentication Headers

- All protected API calls automatically include:

- Authorization: Bearer <jwtToken>

🎨 Design Features

Responsive Design
 - Works on desktop, tablet, and mobile devices
Clean UI
 - Professional card-based layout with consistent spacing
Color Scheme
 - Light background (#f0f2f5) with blue accent colors
Interactive Elements
 - Hover effects on buttons and table rows
Loading States
 - Visual feedback during API calls
Error Handling
 - Clear error messages with appropriate styling
📊 Data Display

States Table

State ID, Name, and Population
Sortable and hoverable rows
Responsive design for mobile devices
Statistics Cards

Visual representation of COVID-19 data
Total Cases, Cured, Active, Deaths
Grid layout that adapts to screen size
Forms

Consistent styling across all input forms
Real-time validation feedback
Auto-clearing after successful operations
🔒 Security Features

JWT token storage in localStorage
Automatic token inclusion in API requests
Session timeout handling
Secure logout with token cleanup
Input validation and sanitization
🐛 Error Handling

Network error detection and user-friendly messages
API error response handling
Form validation with inline error display
Confirmation dialogs for destructive operations
📱 Mobile Responsiveness

Flexible grid layout that adapts to screen size
Touch-friendly button sizes
Readable text on small screens
Optimized form layouts for mobile input
🔄 API Integration

Request Format

All API requests use JSON format with proper headers:

{
  headers: {
    'Authorization': 'Bearer <token>',
    'Content-Type': 'application/json'
  }
}

Response Handling

Success responses display data in formatted tables/cards
Error responses show user-friendly error messages
Loading states provide visual feedback during requests
🚀 Getting Started Guide

First Time Setup
Open 
index.html
 in your browser
Click "Switch to Register" to create a new account
Fill in all required fields and click "Register"
Login Process
Enter your username and password
Click "Login" to access the dashboard
Your session will be remembered until you logout
Using the Dashboard
Each section has clearly labeled buttons and forms
Fill in required fields before clicking action buttons
Results will appear in the designated areas below each section
Use the logout button to end your session
📞 Support

If you encounter any issues:

Check that your backend server is running on the correct port
Verify the API endpoints match your backend implementation
Check browser console for detailed error messages
Ensure you have a stable internet connection
🔮 Future Enhancements

Data export functionality
Advanced filtering and search
Real-time data updates
Bulk operations for districts
Data visualization charts
User role management
Note
: This application requires a compatible Node.js + Express + SQLite backend with the specified API endpoints. Make sure your backend is properly configured and running before using this frontend application.

