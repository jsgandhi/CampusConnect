# CampusConnect

CampusConnect is a full-stack proof-of-concept web application developed for the CSTU MB668 Project Management with AI course. The project demonstrates how Agile project management, AI-assisted development, and modern web technologies combine to deliver a Minimum Viable Product (MVP).

## Project Overview

Universities often require students to navigate multiple disconnected systems for course registration, campus events, student clubs, advising, and executive oversight. CampusConnect consolidates these services into a unified, persona-adapted platform.

Developed by **Team 3 – Nexus Solutions**:
- **Jeeta Gandhi** – Project Manager
- **Garick Chan** – Business Analyst / AI Lead
- **Himanshu Rajpal** – Product Manager
- **Hanqing Zhao** – Developer

---

## 🚀 How to Run Locally

### 1. Clone the Repository
```bash
git clone https://github.com/jsgandhi/CampusConnect.git
cd CampusConnect
```

### 2. Start the Local Server


```
npm run dev
```

Your default browser will automatically open to **http://localhost:3000**.

---

## 🔑 Demo Personas & Credentials

Sign in on `login.html` using any of the 4 pre-configured personas:

| Email | Persona | Dashboard | Key Features |
| :--- | :--- | :--- | :--- |
| `student@cstu.edu` | Student (Alex Rivera) | `/dashboard` | Course registration, event directory, club browser, advising calendar, grounded Gemini AI assistant. |
| `student-gov@cstu.edu` | Student Government (Jordan Lee) | `/dashboard` | All student features + **Post Event** publishing capability. |
| `it-director@cstu.edu` | IT Director (Marcus Vance) | `/observability` | System CPU/Memory load gauges, HTTP latency charts, FERPA audit logs, live telemetry. |
| `admin@cstu.edu` | Steering Committee (Dr. Evelyn Carter) | `/executive` | Executive KPIs, sprint burndown chart, release roadmap, CSV metrics upload. |

---

## ✨ Key Features & Technical Highlights

- **Zero-Dependency Backend**: Pure Node.js standard library or Python 3 HTTP server.
- **Grounded Gemini AI Assistant**: Dynamic API Key configuration modal in chat header, with fallback to grounded CSTU policy rules.
- **Role-Based Access Control (RBAC)**: Redirects unauthorized personas with clear notification toasts.
- **LocalStorage State Persistence**: Courses, RSVPs, clubs, and advising appointments persist across refreshes with a "Reset Mock Data" button in the Developer HUD.
- **Path Sanitization**: Backend server blocks directory traversal security vulnerabilities.

---

## 📜 License & Disclaimer

CampusConnect is an academic project created for CSTU MB668 coursework and educational demonstration only.
