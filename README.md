# Kanban Board - Full Stack Web Application

### **Note: This readme was created by AI based on my project report.**

This project is a full-stack web application designed as a Kanban board. Registered users can create customizable columns and cards, which can be freely edited and moved between columns. The application provides an interactive and intuitive interface for organizing tasks and workflows. The application is designed with responsive design in mind, which means it can be used on any kind of device like a desktop or a phone.

As a full-stack project, it includes both a frontend and a backend, each built using modern web development technologies. This application was developed as the final project for a course.

## 🛠️ Technologies Used

### Frontend
- **React** with **TypeScript** - Modern UI framework with type safety
- **Vite** - Fast development build tool
- **Material-UI (MUI)** - Component library for consistent UI design
- **TailwindCSS** - Utility-first CSS framework
- **@dnd-kit** - Drag and drop functionality for cards and columns
- **React Router Dom** - Client-side routing
- **i18next** - Internationalization support
- **Axios** - HTTP client for API communication

### Backend
- **Node.js** with **Express.js** - Server framework
- **TypeScript** - Type-safe backend development
- **MongoDB** with **Mongoose** - NoSQL database and ODM
- **JWT (jsonwebtoken)** - Authentication and authorization
- **bcrypt** - Password hashing
- **CORS** - Cross-origin resource sharing
- **Express Validator** - Input validation middleware

## 📁 Project Structure

```
source/
├── client/                 # Frontend React application
│   ├── src/
│   │   ├── components/     # React components
│   │   │   ├── Admin.tsx   # Admin interface
│   │   │   ├── Board.tsx   # Main Kanban board
│   │   │   ├── Cards.tsx   # Card components
│   │   │   ├── Column.tsx  # Column components
│   │   │   ├── CardEdit.tsx # Card editing interface
│   │   │   ├── Login.tsx   # Authentication
│   │   │   └── ...
│   │   └── ...
├── server/                 # Backend Node.js application
│   ├── models/            # MongoDB data models
│   │   ├── Card.ts        # Card schema
│   │   ├── Column.ts      # Column schema
│   │   └── User.ts        # User schema
│   ├── routes/            # API endpoints
│   │   ├── card.ts        # Card operations
│   │   ├── column.ts      # Column operations
│   │   └── user.ts        # User management
│   ├── middleware/        # Custom middleware
│   │   └── validateToken.ts # JWT validation
│   └── app.ts             # Main server file
```

## 🚀 Installation Instructions

### Prerequisites
- Node.js (v16 or higher)
- npm or yarn
- MongoDB database

### Quick Start
1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd AWA-project-work/source
   ```

2. **Install all dependencies**
   ```bash
   npm run install:all
   ```

3. **Set up environment variables**
   Create a `.env` file in the `server` directory with your MongoDB connection string and JWT secret.

4. **Start the development servers**
   ```bash
   # Start backend (in one terminal)
   npm run dev:server
   
   # Start frontend (in another terminal)
   npm run dev:client
   ```

### Manual Installation

#### Frontend Setup
```bash
cd client
npm install
npm run dev
```

#### Backend Setup
```bash
cd server
npm install
npm run dev
```

## ✨ Features

- **User Authentication**: Secure registration and login system
- **Responsive Design**: Works seamlessly on desktop and mobile devices
- **Drag & Drop Interface**: Intuitive card and column management
- **Customizable Columns**: Create, edit, and organize columns
- **Card Management**: Add, edit, move, and delete cards
- **Real-time Updates**: Dynamic interface updates
- **Internationalization**: Multi-language support
- **Admin Interface**: Administrative controls for user management

## 📜 Available Scripts

```bash
# Install dependencies for both client and server
npm run install:all

# Start development servers
npm run dev:client    # Frontend development server
npm run dev:server    # Backend development server

# Code formatting
npm run pretty        # Format code with Prettier
```

## 🏗️ Development

The application uses modern development practices including:
- TypeScript for type safety across both frontend and backend
- ESLint for code quality
- Prettier for consistent code formatting
- Hot module replacement for fast development

## 📄 License

This project was developed as a course assignment and is for educational purposes.

---

*This application was developed as the final project for an Advanced Web Applications course, demonstrating full-stack development skills with modern web technologies.*
