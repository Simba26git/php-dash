# My App - Full Stack Application

A modern full-stack web application built with Laravel (Backend API) and React (Frontend), featuring user authentication, CRUD operations, and RESTful API architecture.

## 🚀 Features

- **User Authentication**: Secure signup/login with Laravel Sanctum token-based authentication
- **User Management**: Full CRUD operations for user management
- **Advanced Dashboard**: 
  - Real-time statistics and analytics
  - User activity tracking (daily, weekly, monthly)
  - Quick action shortcuts
  - Recent users overview
  - System health monitoring
  - Auto-refresh capabilities
- **RESTful API**: Well-structured API endpoints following REST principles
- **SPA Architecture**: Single Page Application with React Router
- **Responsive Design**: Mobile-first responsive UI with breakpoint optimization
- **Secure**: CORS enabled, password hashing, token-based auth, rate limiting
- **Pagination**: Server-side pagination for large datasets
- **Form Validation**: Client and server-side validation
- **Error Handling**: Comprehensive error handling with user-friendly messages
- **Loading States**: Smooth loading indicators and transitions
- **Accessibility**: WCAG AA compliant with keyboard navigation support
- **Production Ready**: 
  - Performance optimized
  - Error logging and monitoring
  - Health check endpoints
  - Docker support
  - Comprehensive testing guides
  - Deployment documentation

## 🛠️ Tech Stack

### Backend
- **Laravel 9.x** - PHP Framework
- **Laravel Sanctum** - API Authentication
- **MySQL** - Database
- **RESTful API** - API Architecture

### Frontend
- **React 18.x** - UI Library
- **React Router DOM** - Client-side routing
- **Axios** - HTTP Client
- **Vite** - Build tool and dev server

## 📋 Requirements

- PHP >= 8.0.2
- Composer
- Node.js >= 14.x
- MySQL/MariaDB
- Git

## 🔧 Installation

### 1. Clone the repository
```bash
git clone <your-repo-url>
cd my-app
```

### 2. Backend Setup

```bash
# Install PHP dependencies
composer install

# Copy environment file
cp .env.example .env

# Generate application key
php artisan key:generate

# Configure database in .env file
# DB_DATABASE=my_app_db
# DB_USERNAME=root
# DB_PASSWORD=your_password

# Run migrations and seed database
php artisan migrate --seed

# Start Laravel server
php artisan serve
```

The backend will run at `http://localhost:8000`

### 3. Frontend Setup

```bash
# Navigate to React folder
cd react

# Install Node dependencies
npm install

# Copy environment file
cp .env.example .env

# The .env should contain:
# VITE_API_BASE_URL=http://localhost:8000

# Start development server
npm run dev
```

The frontend will run at `http://localhost:3000`

## 📚 API Documentation

See [API_DOCUMENTATION.md](API_DOCUMENTATION.md) for detailed API endpoint documentation.

### Additional Documentation

- [Testing Guide](TESTING.md) - Comprehensive testing checklist and guidelines
- [Deployment Guide](DEPLOYMENT.md) - Production deployment instructions
- [Contributing Guidelines](CONTRIBUTING.md) - How to contribute to this project

### Authentication Endpoints

#### Register
```http
POST /api/signup
Content-Type: application/json

{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "password123",
  "password_confirmation": "password123"
}
```

#### Login
```http
POST /api/login
Content-Type: application/json

{
  "email": "john@example.com",
  "password": "password123"
}
```

#### Logout
```http
POST /api/logout
Authorization: Bearer {token}
```

### User Endpoints (Protected)

#### Get All Users
```http
GET /api/users
Authorization: Bearer {token}
```

#### Get Single User
```http
GET /api/users/{id}
Authorization: Bearer {token}
```

#### Create User
```http
POST /api/users
Authorization: Bearer {token}
Content-Type: application/json

{
  "name": "Jane Doe",
  "email": "jane@example.com",
  "password": "password123"
}
```

#### Update User
```http
PUT /api/users/{id}
Authorization: Bearer {token}
Content-Type: application/json

{
  "name": "Jane Smith",
  "email": "jane.smith@example.com"
}
```

#### Delete User
```http
DELETE /api/users/{id}
Authorization: Bearer {token}
```

## 🗂️ Project Structure

```
├── app/
│   ├── Http/
│   │   ├── Controllers/Api/
│   │   │   ├── AuthController.php
│   │   │   └── UserController.php
│   │   ├── Requests/
│   │   └── Resources/
│   └── Models/
├── config/
├── database/
│   ├── migrations/
│   └── seeders/
├── routes/
│   └── api.php
└── react/
    ├── src/
    │   ├── components/
    │   ├── context/
    │   ├── views/
    │   ├── axios-client.js
    │   └── router.jsx
    └── package.json
```

## 🔐 Security Features

- CSRF Protection
- Password Hashing (bcrypt)
- Token-based Authentication
- CORS Configuration
- Request Validation
- SQL Injection Protection (Eloquent ORM)

## 🧪 Testing

```bash
# Run PHP tests
php artisan test

# Run with coverage
php artisan test --coverage
```

## 📦 Building for Production

### Backend
```bash
composer install --optimize-autoloader --no-dev
php artisan config:cache
php artisan route:cache
php artisan view:cache
```

### Frontend
```bash
cd react
npm run build
```

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📄 License

This project is open-sourced software licensed under the MIT license.

## 👤 Author

Your Name - Simbarashe Gunundu

## 🙏 Acknowledgments

- Laravel Framework
- React Community
- Open Source Contributors
