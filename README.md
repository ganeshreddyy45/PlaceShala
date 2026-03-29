# Placeshala: Smart Placement Portal 🚀

Placeshala is a next-generation Career Acceleration Platform designed to streamline the recruitment process. It bridges the gap between students and companies using a modern tech stack and AI-powered insights.

![GitHub License](https://img.shields.io/badge/license-MIT-blue.svg)
![Spring Boot](https://img.shields.io/badge/Backend-Spring%20Boot%203-brightgreen)
![React](https://img.shields.io/badge/Frontend-React%2019-blue)
![Vite](https://img.shields.io/badge/Build-Vite-purple)

## ✨ Features

- **🎓 For Students**:
  - Build and manage a professional profile.
  - Apply for jobs and track application status.
  - AI-powered Resume Analysis and Placement Readiness scores.
  - Real-time Interview Question suggestions.
- **💼 For Administrators**:
  - Manage companies, job postings, and student applications.
  - Schedule interviews and manage hiring workflows.
  - Dynamic Dashboard stats for platform oversight.
- **🤖 Intelligence**:
  - AI Chatbot support for instant assistance.
  - Automated Skill Gap analysis.

## 🛠️ Technology Stack

- **Frontend**: React 19, Vite, Tailwind CSS 4, Axios.
- **Backend**: Java 17, Spring Boot 3.2, Spring Data JPA, MySQL, Spring Mail.
- **Database**: MySQL (Aiven Cloud/Local).

## 🚀 Getting Started

### Prerequisites
- JDK 17 or higher.
- Node.js 18 or higher.
- MySQL Database.

### 1. Backend Setup
1. Navigate to the `backend/` directory.
2. Copy `.env.example` to `.env`.
3. Fill in your MySQL and Mail credentials in `.env`.
4. Run the application:
   ```bash
   ./mvnw spring-boot:run
   ```

### 2. Frontend Setup
1. Navigate to the `frontend/` directory.
2. Copy `.env.example` to `.env`.
3. Set `VITE_API_BASE_URL` to your backend URL (default: `http://localhost:8081`).
4. Install dependencies and start the dev server:
   ```bash
   npm install
   npm run dev
   ```

## 🛡️ License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---
Built with ❤️ for better placements.
