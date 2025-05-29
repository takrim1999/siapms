# SIAPMS - Project Management System

A modern, full-stack project management system built with Angular and Node.js, featuring markdown support, file uploads, and real-time collaboration.

## 🚀 Features

- **Project Management**
  - Create and manage projects with rich markdown descriptions
  - Upload project screenshots and cover photos
  - Link GitHub repositories and live demos
  - Public/private project visibility

- **Rich Text Editing**
  - Real-time markdown preview
  - Formatting toolbar
  - Code block support
  - Image embedding

- **Authentication & Security**
  - JWT-based authentication
  - Secure password hashing
  - Protected routes
  - Role-based access control

- **File Management**
  - Multiple file upload support
  - Image preview
  - Secure file storage
  - File type validation

## 🏗️ System Architecture

### Frontend (Angular)
```
siapms-frontend/
├── src/
│   ├── app/
│   │   ├── components/     # Reusable UI components
│   │   ├── pages/         # Page components
│   │   ├── services/      # API services
│   │   ├── guards/        # Route guards
│   │   ├── models/        # TypeScript interfaces
│   │   └── utils/         # Utility functions
│   └── assets/            # Static assets
```

### Backend (Node.js/Express)
```
siapms-backend/
├── src/
│   ├── routes/            # API routes
│   ├── middleware/        # Custom middleware
│   ├── models/           # Mongoose models
│   ├── controllers/      # Route controllers
│   └── utils/            # Utility functions
```

## 🛠️ Technology Stack

### Frontend
- Angular 17+
- TypeScript
- Tailwind CSS
- RxJS
- Angular Material

### Backend
- Node.js
- Express.js
- MongoDB
- Mongoose
- JWT
- Multer

## 📋 Prerequisites

- Node.js (v18 or higher)
- MongoDB
- npm or yarn
- Angular CLI

## 🚀 Getting Started

1. **Clone the repository**
   ```bash
   git clone https://github.com/yourusername/siapms.git
   cd siapms
   ```

2. **Install dependencies**
   ```bash
   # Install backend dependencies
   cd siapms-backend
   npm install

   # Install frontend dependencies
   cd ../siapms-frontend
   npm install
   ```

3. **Environment Setup**
   ```bash
   # Backend (.env)
   PORT=3000
   MONGODB_URI=mongodb://localhost:27017/siapms
   JWT_SECRET=your_jwt_secret
   JWT_EXPIRATION=7d

   # Frontend (environment.ts)
   apiUrl: 'http://localhost:3000/api'
   ```

4. **Start the development servers**
   ```bash
   # Start backend server
   cd siapms-backend
   npm run dev

   # Start frontend server
   cd siapms-frontend
   ng serve
   ```

## 🔒 API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - User login
- `GET /api/auth/me` - Get current user

### Projects
- `GET /api/projects` - List projects
- `POST /api/projects` - Create project
- `GET /api/projects/:id` - Get project details
- `PUT /api/projects/:id` - Update project
- `DELETE /api/projects/:id` - Delete project

## 🧪 Testing

```bash
# Run backend tests
cd siapms-backend
npm test

# Run frontend tests
cd siapms-frontend
ng test
```

## 📦 Deployment

1. **Build the frontend**
   ```bash
   cd siapms-frontend
   ng build --prod
   ```

2. **Build the backend**
   ```bash
   cd siapms-backend
   npm run build
   ```

3. **Environment variables**
   - Set up production environment variables
   - Configure MongoDB connection
   - Set JWT secret

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 👥 Authors

- Your Name - Initial work

## 🙏 Acknowledgments

- Angular Team
- Node.js Community
- MongoDB Team
- All contributors
