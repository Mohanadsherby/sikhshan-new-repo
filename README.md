# Sikhshan - Course Management System

A comprehensive, modern Course Management System built with React.js and Spring Boot, designed to streamline educational processes for academic institutions.

## 📋 About

Sikhshan is a full-stack web application that provides a centralized platform for managing educational content, assignments, quizzes, and communication between students, faculty, and administrators. The system features role-based access control, real-time communication, and comprehensive course management capabilities.

## ✨ Features

### 🎓 **Role-Based Access Control**
- **Admin**: User management and system oversight
- **Faculty**: Course creation, assignment/quiz management, grading, student communication
- **Student**: Course enrollment, assignment submission, quiz taking, grade tracking

### 📚 **Course Management**
- Create and manage courses with detailed descriptions
- Upload course materials and attachments
- Track student enrollments and progress
- Course calendar integration

### 📝 **Assignment System**
- Create assignments with file attachments
- Set due dates and total points
- Grading with detailed feedback
- Progress tracking and analytics

### 🧠 **Quiz System**
- Create interactive quizzes with multiple question types
- Set time limits and attempt restrictions
- Automated grading and instant feedback
- Detailed performance analytics

### 💬 **Real-Time Communication**
- Built-in chat system for instant messaging
- Course-based and general discussion groups
- Message history

### 📅 **Calendar Integration**
- Academic calendar with course schedules
- Personal event management
- Shared institutional events

### 📊 **Grading System**
- Comprehensive grade tracking
- GPA calculation with letter grades
- Performance analytics and insights
- Customizable grading scales

## 🛠️ Prerequisites

Before running this application, ensure you have the following installed:

- **Node.js** (v16 or higher)
- **npm** (v8 or higher)
- **Java** (JDK 17 or higher)
- **Maven** (v3.6 or higher)
- **MySQL** (v8.0 or higher)
- **Git**

## 🚀 Installation & Setup

### 1. Clone the Repository

```bash
git clone https://github.com/sudip6164/sikhshan-new-repo.git
cd sikhshan-new-repo
```

### 2. Backend Setup

#### 2.1. Navigate to Backend Directory
```bash
cd backend
```
#### 2.2. Change application.properties.example in src/main/resources to applicatipn.properties

#### 2.3. Configure Environment Variables
1. Create a `.env` file in the backend directory:
```bash
touch .env
```

2. Add the following environment variables to `.env`:
```env
JWT_SECRET=your_jwt_secret_key_here
JWT_EXPIRATION=86400000

CLOUDINARY_CLOUD_NAME=your_cloudinary_cloud_name
CLOUDINARY_API_KEY=your_cloudinary_api_key
CLOUDINARY_API_SECRET=your_cloudinary_api_secret
```

**Note**: The database `sikhshan_db` will be created automatically when you first run the application. You can also change the name from application.properties.

#### 2.4. Run the Backend

**Option 1: Using Maven Wrapper (Recommended)**
```bash
./mvnw spring-boot:run
```

**Option 2: Using IDE**
- Open the project in Spring Tool Suite, IntelliJ IDEA, or VS Code
- Run the main class: `com.sikhshan.SikhshanApplication`

The backend will start on `http://localhost:8081`

### 3. Frontend Setup

#### 3.1. Navigate to Frontend Directory
```bash
cd frontend
```

#### 3.2. Install Dependencies
```bash
npm install
```

#### 3.3. Run the Frontend
```bash
npm start
```

The frontend will start on `http://localhost:3000`

## 📁 Project Structure

```
sikhshan-new-repo/
├── backend/                          # Spring Boot Backend
│   ├── src/main/java/com/sikhshan/
│   │   ├── config/                   # Configuration classes
│   │   ├── controller/               # REST controllers
│   │   ├── dto/                      # Data Transfer Objects
│   │   ├── model/                    # JPA entities
│   │   ├── repository/               # Data repositories
│   │   ├── service/                  # Business logic
│   │   └── utility/                  # Utility classes
│   ├── src/main/resources/
│   │   └── application.properties    # Application configuration
│   ├── .env                          # Environment variables
│   └── pom.xml                       # Maven dependencies
├── frontend/                         # React.js Frontend
│   ├── public/                       # Static files
│   ├── src/
│   │   ├── api/                      # API service functions
│   │   ├── components/               # Reusable components
│   │   ├── contexts/                 # React contexts
│   │   ├── pages/                    # Page components
│   │   └── utils/                    # Utility functions
│   └── package.json                  # Node.js dependencies
└── README.md                         # This file
```

## ��️ Technologies Used

### Backend
- **Spring Boot 3.x** - Main framework
- **Spring Data JPA** - Database abstraction
- **MySQL** - Primary database
- **JWT** - Token-based authentication
- **Maven** - Dependency management
- **Cloudinary** - File storage and management

### Frontend
- **React.js 18** - UI framework
- **React Router** - Client-side routing
- **Axios** - HTTP client
- **Material-UI** - UI component library
- **Tailwind CSS** - Utility-first CSS framework
- **WebSocket** - Real-time communication

### Development Tools
- **Swagger/OpenAPI** - API documentation
- **Postman** - API testing
- **Git** - Version control

## 📚 API Documentation

### Swagger UI
Once the backend is running, access the API documentation at:
```
http://localhost:8081/swagger-ui.html
```

## 📸 Screenshots

### Dashboard Views
- **Login**:
<img width="1359" height="623" alt="image" src="https://github.com/user-attachments/assets/bdb249b9-56eb-4d59-978c-15111e711cae" />

- **Admin Dashboard**:
<img width="1362" height="619" alt="image" src="https://github.com/user-attachments/assets/9a17217c-cbc3-4dc7-9bd9-e42590c292a0" />
<img width="1363" height="613" alt="image" src="https://github.com/user-attachments/assets/eaa3caa3-0b89-4238-b6bf-567ada9bffd2" />

- **Faculty Dashboard**: 
<img width="1366" height="623" alt="image" src="https://github.com/user-attachments/assets/08cfa0ba-6c3a-48b9-a506-a85230e8d614" />
<img width="1366" height="610" alt="image" src="https://github.com/user-attachments/assets/15a61679-aee2-4dc5-bb9e-0d5d72e4a88f" />

- **Student Dashboard**: 
<img width="1365" height="612" alt="image" src="https://github.com/user-attachments/assets/723b8002-37a8-4a30-a5bd-b4050fe03f17" />

### Course Management
- **Course Creation**: Intuitive form for creating new courses
<img width="1366" height="617" alt="image" src="https://github.com/user-attachments/assets/b0e8374f-9bec-4a46-9604-c8affdfb6384" />
<img width="1357" height="590" alt="image" src="https://github.com/user-attachments/assets/40e77021-ad64-4c51-9228-3acd454fd3de" />

- **Course Details**: Comprehensive view with materials, assignments, and students
<img width="1362" height="617" alt="image" src="https://github.com/user-attachments/assets/f17feec1-4b34-4b6f-8763-c2c26a14325b" />
<img width="1365" height="603" alt="image" src="https://github.com/user-attachments/assets/c62ed6b7-ff70-4108-ab88-ac14ef3d2bd3" />

- **Assignment Management**: Create and grade assignments with file uploads
<img width="1366" height="606" alt="image" src="https://github.com/user-attachments/assets/ee35de6f-a764-4860-b95f-6d680fad7d6c" />
<img width="1362" height="614" alt="image" src="https://github.com/user-attachments/assets/ed3f6cd3-fc7d-4656-91bd-f0eefe8bf504" />

<img width="1366" height="610" alt="image" src="https://github.com/user-attachments/assets/e4996363-a47e-4edc-8165-b56905f3cdc1" />


### Communication
- **Chat Interface**: Real-time messaging between users
<img width="1351" height="616" alt="image" src="https://github.com/user-attachments/assets/cba573fa-1604-49c8-b799-363268eb1694" />

- **Calendar Integration**: Academic calendar with events and deadlines
<img width="1366" height="615" alt="image" src="https://github.com/user-attachments/assets/104861a7-baba-484c-80b7-442d6f1668ef" />

### Assessment Tools
- **Quiz Creation**: Interactive quiz builder with multiple question types
<img width="1366" height="612" alt="image" src="https://github.com/user-attachments/assets/b591828d-4ade-48a9-bae9-2a73b56990b2" />
<img width="1354" height="618" alt="image" src="https://github.com/user-attachments/assets/f7eaa023-ac6b-481a-b295-bf34f6f1cf7b" />

- **Assignment Submission**: File upload
<img width="1366" height="616" alt="image" src="https://github.com/user-attachments/assets/3439e3fb-911f-4739-9d73-6750b86e4eac" />
<img width="1364" height="609" alt="image" src="https://github.com/user-attachments/assets/ff2a25a8-a5ad-4f90-bcb0-b577a6676e41" />

- **Grade Tracking**: Detailed grade analytics and performance insights
<img width="1364" height="609" alt="image" src="https://github.com/user-attachments/assets/1347f483-5e7a-44bf-bd3f-b451aed5fbdc" />

---

**Sikhshan** - Empowering Education Through Technology 🎓
