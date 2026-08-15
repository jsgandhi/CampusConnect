# CampusConnect MVP (`app_build`)

CampusConnect is a production-grade local mock web application developed for CSTU. The MVP features zero external dependencies, four persona-driven dashboards, relational database schema documentation, and a grounded Gemini AI student assistant.

---

## 📁 Repository Architecture (`app_build/`)

```
app_build/
├── backend/
│   └── server.js                          ← Zero-dependency Node.js HTTP server
├── database/
│   └── SCHEMA.sql                         ← Relational database schema reference blueprint
├── frontend/
│   ├── login.html                         ← Mock single sign-on auth gateway (4 personas)
│   ├── index.html                         ← Student Portal dashboard
│   ├── observability.html                 ← IT Director mock observability dashboard
│   ├── steering_committee_dashboard.html  ← Steering Committee executive dashboard
│   └── dashboard_metrics_template.csv     ← Executive metrics CSV template
└── README.md                              ← Instructions & technical guide
```

---

## 🚀 How to Run Locally

### Prerequisites:
- Node.js installed (v16+)
- No `npm install` needed — the server runs exclusively on Node.js built-in modules (`http`, `fs`, `path`, `child_process`, `url`).

### Command to Start:

```bash
cd app_build/backend
node server.js
```

Upon launching:
- The server starts listening at `http://localhost:3000`.
- Your default web browser will automatically open to `http://localhost:3000` (`login.html`).

---

## 🔑 Demo Personas & Credentials

Select any of the pre-configured personas on `login.html`:

| Email | Persona / Role | Target Dashboard | Key Capabilities |
| :--- | :--- | :--- | :--- |
| `student@cstu.edu` | Student (Alex Rivera) | `/dashboard` (`index.html`) | Course registration, event directory, club browser, advising appointments, Gemini AI chat. |
| `student-gov@cstu.edu` | Student Government (Jordan Lee) | `/dashboard` (`index.html`) | All student features + **Post Event** publishing capability. |
| `it-director@cstu.edu` | IT Director (Marcus Vance) | `/observability` (`observability.html`) | CPU/Memory metrics, HTTP latency chart, FERPA audit logs, live system telemetry. |
| `admin@cstu.edu` | Steering Committee (Dr. Evelyn Carter) | `/executive` (`steering_committee_dashboard.html`) | Executive KPIs, sprint burndown chart, release roadmap, CSV metrics upload. |

---

## ✨ Features Walkthrough

### 1. Grounded Gemini AI Student Assistant
- Click **CSTU AI Support** in the bottom-right corner of `/dashboard`.
- Click **🔑 Key** in the chat header to enter/save a Google Gemini API Key in `localStorage`.
- If no key is configured, the assistant operates in **Grounded Offline Mode**, serving CSTU policy rules (add/drop deadlines, tuition refunds, FERPA regulations).

### 2. Role-Based Access Control (RBAC)
- If a Student persona (`student@cstu.edu`) attempts to navigate directly to `/observability` or `/executive`, the application automatically redirects to `/dashboard` with an explanatory toast notification.

### 3. State Persistence & LocalStorage
- Enrolling in courses, RSVPing to events, joining clubs, and booking advising appointments persist in `localStorage`.
- Click **🔄 Reset Mock Data** in the Developer HUD banner at the bottom of the Student Portal to restore baseline datasets.

### 4. Developer HUD & Schema Viewer
- Click **📄 View SCHEMA.sql** in the Developer HUD to view the underlying SQL entity definitions (`users`, `courses`, `enrollments`, `events`, `event_rsvps`, `clubs`, `club_memberships`, `appointments`, `audit_logs`, `policy_documents`).

### 5. Path Sanitization & Security
- The backend server sanitizes all requested URL paths to prevent directory traversal attacks (e.g. `http://localhost:3000/../../../etc/passwd` returns `403 Forbidden`).

---

## 🧪 Verification & Manual Testing Checklist

1. **Startup Test**: Run `node app_build/backend/server.js` and verify browser auto-opens to `http://localhost:3000`.
2. **Auth & RBAC Test**: Log in as `student@cstu.edu` $\rightarrow$ try opening `http://localhost:3000/observability` $\rightarrow$ verify redirect to `/dashboard` with notice.
3. **Student Workflows**: Enroll in a course, RSVP to an event, join a club, and book an appointment slot. Refresh the browser and verify state persists.
4. **AI Assistant Test**: Open chat and ask "What is the tuition refund deadline?" $\rightarrow$ verify grounded policy response.
5. **IT Observability Test**: Log in as `it-director@cstu.edu` $\rightarrow$ check system metrics, latency chart, and live log stream.
6. **Executive CSV Test**: Log in as `admin@cstu.edu` $\rightarrow$ upload `dashboard_metrics_template.csv` $\rightarrow$ verify KPI metrics update.
