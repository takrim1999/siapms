# SIAPMS - Simple Project Showcase Management System

A fullstack application for showcasing projects with Angular frontend and Express.js backend.

## Features

- 🔐 User authentication (register/login)
- 📁 Project CRUD operations
- 🖼️ Image upload (cover photos and screenshots)
- 🌐 Public/private project visibility
- 🔍 Project search and filtering
- 📱 Responsive design with Tailwind CSS

## Tech Stack

### Frontend
- Angular 18+
- Tailwind CSS v4
- TypeScript
- RxJS

### Backend
- Node.js
- Express.js
- JWT Authentication
- Multer (file uploads)
- bcryptjs (password hashing)

## Getting Started

### Prerequisites
- Node.js (v18 or higher)
- npm or yarn

### Backend Setup

1. Navigate to the backend directory:
\`\`\`bash
cd siapms-backend
\`\`\`

2. Install dependencies:
\`\`\`bash
npm install
\`\`\`

3. Create uploads directory:
\`\`\`bash
mkdir uploads
\`\`\`

4. Copy environment variables:
\`\`\`bash
cp .env.example .env
\`\`\`

5. Update the `.env` file with your configuration

6. Start the development server:
\`\`\`bash
npm run dev
\`\`\`

The backend will run on `http://localhost:3000`

### Frontend Setup

1. Navigate to the frontend directory:
\`\`\`bash
cd siapms-frontend
\`\`\`

2. Install dependencies:
\`\`\`bash
npm install
\`\`\`

3. Start the development server:
\`\`\`bash
ng serve
\`\`\`

The frontend will run on `http://localhost:4200`

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/me` - Get current user

### Projects
- `GET /api/projects` - Get all public projects
- `GET /api/projects/:id` - Get project by ID
- `GET /api/projects/user` - Get user's projects (authenticated)
- `POST /api/projects` - Create new project (authenticated)
- `PUT /api/projects/:id` - Update project (authenticated)
- `DELETE /api/projects/:id` - Delete project (authenticated)

## Project Structure

\`\`\`
siapms/
├── siapms-frontend/          # Angular frontend
│   ├── src/
│   │   ├── app/
│   │   │   ├── components/   # Reusable components
│   │   │   ├── pages/        # Page components
│   │   │   ├── services/     # Angular services
│   │   │   ├── models/       # TypeScript interfaces
│   │   │   └── guards/       # Route guards
│   │   └── styles.css        # Global styles with Tailwind
│   └── package.json
└── siapms-backend/           # Express backend
    ├── routes/               # API routes
    ├── middleware/           # Custom middleware
    ├── data/                 # Data storage (JSON files)
    ├── utils/                # Utility functions
    ├── uploads/              # File uploads directory
    └── package.json
\`\`\`

## Usage

1. **Register/Login**: Create an account or login to access project management features
2. **Browse Projects**: View all public projects on the projects page
3. **Create Project**: Add new projects with title, description, images, and links
4. **Manage Projects**: Edit or delete your own projects
5. **Public/Private**: Toggle project visibility for public showcase

## Security Features

- JWT-based authentication
- Password hashing with bcryptjs
- File upload validation
- Rate limiting
- CORS protection
- Helmet security headers

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## License

This project is licensed under the MIT License.
