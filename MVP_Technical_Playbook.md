# CampusConnect MVP: Technical Scope & Implementation Playbook

### A Guide for Non-Coder Student Teams Using GenAI (PMBOK® 8th Edition)

---

## 0\. Architecture Overview: The `app_build` Folder

Your entire project lives in one folder called `app_build/`. Everything runs locally by double-clicking or running a simple Node.js server. No cloud hosting. No real database. No real authentication.

app\_build/

├── backend/

│   └── server.js              ← Lightweight local HTTP server (Node.js stdlib only)

├── database/

│   └── SCHEMA.sql             ← Reference schema (for documentation/mock data structure)

├── frontend/

│   ├── login.html             ← Mock authentication gateway (3 personas)

│   ├── index.html             ← Main Student Portal dashboard

│   ├── observability.html     ← IT/DevOps mock dashboard

│   ├── steering\_committee\_dashboard.html  ← Executive mock dashboard

│   └── dashboard\_metrics\_template.csv     ← Mock data for executive charts

└── README.md                  ← How to run locally

**How to run:**

cd app\_build/backend

node server.js

\# Opens browser automatically to http://localhost:3000

**Server capabilities:**

- Serves static HTML files from `frontend/`  
- Maps routes like `/` → `login.html`, `/dashboard` → `index.html`  
- Path sanitization to prevent directory traversal  
- Zero external dependencies (only Node.js built-in modules: `http`, `fs`, `path`, `child_process`)

---

## 1\. The Architectural Strategy: Local Mock Application

For non-coder business and university students, the optimal vehicle for delivering a working software MVP is a **locally runnable mock application** served by a lightweight Node.js server.

┌────────────────────────────────────────────────────────────────────────┐

│ CAMPUSCONNECT LOCAL MOCK MVP                                         │

├────────────────────────────────────────────────────────────────────────┤

│ Node.js HTTP Server (stdlib)  • Serves static files, maps routes     │

│ HTML5 Frontend Files          • login, dashboard, observability, exec  │

│ Tailwind CSS (CDN)            • Handles premium, system-adaptive UI    │

│ In-Memory JS State            • Mocks databases, filters, tracks     │

│ LocalStorage Persistence      • Survives browser refresh             │

│ Live Gemini API Link          • Connects chat to grounded AI brain   │

│ Mock Data (JS Arrays)         • Populates all tables from SCHEMA.sql   │

└────────────────────────────────────────────────────────────────────────┘

### Why This Architecture Works for Non-Coders:

- **Zero Environmental Friction:** No npm install, no package.json, no database hosting. Just `node server.js`.  
- **No External Dependencies:** The server uses only Node.js built-in modules. No `npm`, no `node_modules`, no version conflicts.  
- **Highly Optimized for GenAI:** LLMs write self-contained frontend code exceptionally well. Debugging loops are tight.  
- **Easy Distribution & Grading:** Zip the `app_build/` folder. Professor double-clicks `server.js` (or runs `node server.js`) and the entire app opens in their browser.  
- **Schema-Aware Mock Data:** The `SCHEMA.sql` file documents the "intended" database structure. Mock data in JS arrays mirrors these tables for realism.

---

## 2\. Feature-by-Feature MVP Implementation Boundaries

### Feature 1: Mock Authentication Gateway (`login.html`)

**What it is:** A clean interface that acts as the entry gate to the unified CSTU dashboard. Simulates SSO sign-in and role selection.

**The Technical Boundary:** In-memory mock authentication. No real SSO, no password hashing, no session tokens.

**How it behaves in the MVP:**

- The app provides a login form with email/password fields (password is cosmetic — anything works).  
- Three distinct personas representing different user roles:

| Email | Role | Dashboard Access |
| :---- | :---- | :---- |
| `student@cstu.edu` | Student | `index.html` — Course registration, events, clubs, appointments, AI chat |
| `student-gov@cstu.edu` | Student Government | `index.html` \+ ability to post/edit events and manage club memberships |
| `it-director@cstu.edu` | IT Director | `observability.html` — System metrics, FERPA logs, mock observability data |
| `admin@cstu.edu` | Steering Committee | `steering_committee_dashboard.html` — Executive KPIs, sprint progress, release tracking |

- Entering credentials updates a global `userState` object, stores the session in `localStorage`, and redirects to the appropriate dashboard.  
- Role-based UI: Buttons and navigation items show/hide based on the logged-in persona.

**The PMBOK 8 "AI Builder" Prompt Pattern:**

> "Act as an expert frontend engineer. Write a clean JavaScript authentication function that checks input credentials against an array of local user objects. If the credentials match, update the global `userState` object with that user's details (including role), store the session in localStorage, and redirect to the appropriate dashboard (`index.html` for students, `observability.html` for IT Director, `steering_committee_dashboard.html` for admin). Do not use external servers for auth; handle everything in-memory with beautiful Tailwind CSS validation styles. Include a role selector dropdown that pre-fills the email based on selection."

---

### Feature 2: Student Portal Dashboard (`index.html`)

**What it is:** The main unified dashboard combining course registration, campus events, club browsing, appointment booking, and AI assistant chat.

**The Technical Boundary:** All data lives in JavaScript arrays (mock databases) that mirror the `SCHEMA.sql` table structure. No real PostgreSQL database.

**How it behaves in the MVP:**

#### 2A: Course Registration View

- Displays a card grid of mock courses from the `courses` table structure (course code, title, credits, schedule, instructor).  
- Students can "enroll" in courses — appends to a local `enrollments` array and updates the student's dashboard.  
- "My Schedule" sidebar shows enrolled courses with times.

#### 2B: Event Directory (Dynamic Array Filtering Engine)

- A unified search and category filtering interface combining information from the `events` and `event_rsvps` table structures.  
- Mock data array populated with 6+ CSTU events (career fairs, study groups, club meetings, guest speakers).  
- Live `.filter()` loop on search input and category pills.  
- RSVP functionality: Clicking "RSVP" appends to `event_rsvps` array, updates the UI, and persists in `localStorage`.  
- Student Government users see a "Post Event" button that appends a new event object to the local array.

#### 2C: Club Browser

- Grid of mock clubs from the `clubs` table structure (name, description, category, meeting time).  
- "Join Club" button appends to `club_memberships` array.  
- "My Clubs" section shows joined clubs.

#### 2D: Appointment Scheduler (State-Managed Calendar)

- Grid of available appointment slots mirroring the `appointments` table structure (date, time, department, advisor, status: PENDING/CONFIRMED/REJECTED).  
- Clicking a slot opens a modal confirming details.  
- "Book Appointment" changes slot status to CONFIRMED, appends to user's schedule, and grays out the slot.  
- Status workflow: Available → PENDING (after booking) → CONFIRMED (mock admin approval).

#### 2E: AI Student Assistant (Grounded Gemini API Integration)

- Chat window pinned to bottom-right of the dashboard.  
- System instructions hardcoded in JavaScript containing sanitized CSTU policy text.  
- Direct `fetch()` call to Gemini API (`gemini-2.5-flash-preview-09-2025` endpoint).  
- API key stored as a placeholder variable at the top of the script.  
- Returns grounded, contextual responses to avoid hallucinations.

**The PMBOK 8 "AI Builder" Prompt Pattern:**

> "Generate a responsive Student Portal dashboard (`index.html`) using Tailwind CSS. Include four main sections: (1) Course cards with enroll button and 'My Schedule' sidebar, (2) Event directory with search/filter/RSVP and a 'Post Event' button visible only to student-gov role, (3) Club browser with join functionality, (4) Appointment scheduler with PENDING/CONFIRMED/REJECTED status workflow. Use in-memory JavaScript arrays for all data, structured to mirror a relational database schema (courses, enrollments, events, event\_rsvps, clubs, club\_memberships, appointments). Implement LocalStorage persistence. Include an AI chat window that makes a fetch() call to Gemini API with a hardcoded system prompt containing CSTU policies."

---

### Feature 3: IT & DevOps Observability Dashboard (`observability.html`)

**What it is:** A mock IT Director dashboard displaying system metrics, HTTP request latency, logs, and FERPA compliance tracking.

**The Technical Boundary:** All metrics are mock data generated by JavaScript functions. No real monitoring system. No actual server logs.

**How it behaves in the MVP:**

- **System Metrics Panel:** Mock CPU usage, memory consumption, active users, request rate — displayed as animated progress bars and number counters.  
- **HTTP Latency Distribution:** A mock bar chart showing response time buckets (0-50ms, 50-100ms, etc.) generated from fake request data.  
- **System Logs Table:** Mock log entries (timestamp, level, message, user) populated from a JavaScript array. Filterable by log level.  
- **FERPA Access Log Tracker:** Table showing mock audit entries (who accessed what student data, when, action type) mirroring the `audit_logs` table structure.  
- **Real-time Simulation:** A `setInterval` adds new mock log entries every few seconds to simulate live monitoring.

**Role Access:** Only accessible when logged in as `it-director@cstu.edu`. Other roles redirected to `index.html`.

**The PMBOK 8 "AI Builder" Prompt Pattern:**

> "Create an IT Observability dashboard (`observability.html`) with four panels: (1) System metrics (CPU, memory, active users) with animated progress bars, (2) HTTP latency distribution as a CSS bar chart, (3) System logs table with filterable levels and auto-refreshing mock entries, (4) FERPA audit log tracker showing mock data access events. All data comes from JavaScript arrays. Use a dark theme (Tailwind slate/zinc colors) appropriate for a monitoring dashboard. Include role-based access — only [it-director@cstu.edu](mailto:it-director@cstu.edu) can view this page."

---

### Feature 4: Steering Committee Executive Dashboard (`steering_committee_dashboard.html`)

**What it is:** An executive view for the Steering Committee (`admin@cstu.edu`) showing project progress, sprint backlogs, release tracking, and KPI metrics.

**The Technical Boundary:** All data is mock data from `dashboard_metrics_template.csv` (parsed by JavaScript) and additional mock arrays. No real project management tool integration.

**How it behaves in the MVP:**

- **KPI Cards:** Key metrics (active students, event attendance rate, appointment utilization, system uptime) displayed as large number cards with trend indicators.  
- **Sprint Progress Chart:** Mock burndown chart built with CSS/HTML showing story points over time.  
- **Release Timeline:** Horizontal timeline of mock releases (past, current, upcoming) with status badges.  
- **Backlog Table:** Mock sprint backlog items with priority, assignee, status columns.  
- **Metrics Upload:** A file input that accepts the `dashboard_metrics_template.csv` format and dynamically updates the dashboard charts.

**Data Source:** `dashboard_metrics_template.csv` serves as the baseline template. The app parses this CSV (or uses default mock data if no file uploaded) to populate charts.

**Role Access:** Only accessible when logged in as `admin@cstu.edu`. Other roles redirected to `index.html`.

**The PMBOK 8 "AI Builder" Prompt Pattern:**

> "Build an executive dashboard (`steering_committee_dashboard.html`) with: (1) KPI metric cards (active users, attendance rate, etc.) with up/down trend arrows, (2) A CSS-based burndown chart showing mock sprint progress, (3) A horizontal release timeline with status badges, (4) A sortable backlog table with priority/assignee/status, (5) A CSV file upload that parses `dashboard_metrics_template.csv` and updates the charts dynamically. Use a professional executive color scheme (Tailwind blue/slate/emerald). Role-restricted to [admin@cstu.edu](mailto:admin@cstu.edu)."

---

### Feature 5: Database Schema Documentation (`SCHEMA.sql`)

**What it is:** A reference SQL file documenting the *intended* relational database structure. Used for documentation and to guide mock data design.

**The Technical Boundary:** This file is NOT executed. No real PostgreSQL database. No `pgvector`. The schema serves as a blueprint for the JavaScript mock data arrays.

**Schema Tables (Mock Data Mirrors):**

\-- users: User identities, roles, and SSO IDs (mocked as localStorage \+ JS array)

\-- courses: Course catalog (mocked as JS array)

\-- enrollments: Many-to-many junction (mocked as JS array)

\-- events & event\_rsvps: Campus activities (mocked as JS arrays)

\-- clubs & club\_memberships: Student organizations (mocked as JS arrays)

\-- appointments: Career/advising scheduler (mocked as JS array with status workflow)

\-- audit\_logs: FERPA compliance tracking (mocked as JS array)

\-- policy\_documents: Reference for AI system prompt (hardcoded in JS, not vector DB)

**How it behaves in the MVP:**

- The `SCHEMA.sql` file sits in `database/` as documentation.  
- A "View Schema" button in the Developer HUD displays the SQL in a formatted code block.  
- Mock data arrays in JavaScript are structured to match these tables (same field names, same relationships).  
- The schema is referenced in comments above each mock data array.

**The PMBOK 8 "AI Builder" Prompt Pattern:**

> "Create a `database/SCHEMA.sql` file containing CREATE TABLE statements for: users, courses, enrollments, events, event\_rsvps, clubs, club\_memberships, appointments, audit\_logs, and policy\_documents. Include appropriate data types, primary keys, foreign keys, and comments. This file is for documentation only — do not attempt to execute it. Also create a 'View Schema' button in the Developer HUD that fetches and displays this SQL file content in a formatted code block."

---

### Feature 6: Lightweight Local Server (`backend/server.js`)

**What it is:** A zero-dependency Node.js HTTP server that serves the frontend files and handles basic routing.

**The Technical Boundary:** Uses ONLY Node.js standard library modules (`http`, `fs`, `path`, `child_process`, `url`). No `express`, no `npm install`, no external packages.

**How it behaves in the MVP:**

// server.js — Zero external dependencies

const http \= require('http');

const fs \= require('fs');

const path \= require('path');

const { exec } \= require('child\_process');

const PORT \= 3000;

const FRONTEND\_DIR \= path.join(\_\_dirname, '..', 'frontend');

// Route mappings

const routes \= {

  '/': 'login.html',

  '/login': 'login.html',

  '/dashboard': 'index.html',

  '/observability': 'observability.html',

  '/executive': 'steering\_committee\_dashboard.html'

};

// MIME types for static files

const mimeTypes \= {

  '.html': 'text/html',

  '.css': 'text/css',

  '.js': 'application/javascript',

  '.json': 'application/json',

  '.csv': 'text/csv',

  '.png': 'image/png',

  '.jpg': 'image/jpeg'

};

// Path sanitization to prevent directory traversal

function sanitizePath(requestPath) {

  const decoded \= decodeURIComponent(requestPath);

  const normalized \= path.normalize(decoded);

  if (normalized.startsWith('..') || normalized.includes('../')) {

    return null; // Block traversal attempt

  }

  return normalized;

}

const server \= http.createServer((req, res) \=\> {

  const parsedUrl \= new URL(req.url, \`http://localhost:${PORT}\`);

  let pathname \= parsedUrl.pathname;

  // Map routes to files

  if (routes\[pathname\]) {

    pathname \= '/' \+ routes\[pathname\];

  }

  const safePath \= sanitizePath(pathname);

  if (\!safePath) {

    res.writeHead(403, { 'Content-Type': 'text/plain' });

    res.end('Forbidden: Invalid path');

    return;

  }

  const filePath \= path.join(FRONTEND\_DIR, safePath);

  const ext \= path.extname(filePath).toLowerCase();

  const contentType \= mimeTypes\[ext\] || 'application/octet-stream';

  fs.readFile(filePath, (err, data) \=\> {

    if (err) {

      if (err.code \=== 'ENOENT') {

        res.writeHead(404, { 'Content-Type': 'text/html' });

        res.end('\<h1\>404 — Page Not Found\</h1\>');

      } else {

        res.writeHead(500, { 'Content-Type': 'text/plain' });

        res.end('Server Error');

      }

      return;

    }

    res.writeHead(200, { 'Content-Type': contentType });

    res.end(data);

  });

});

server.listen(PORT, () \=\> {

  console.log(\`CampusConnect server running at http://localhost:${PORT}\`);

  // Auto-open browser

  const url \= \`http://localhost:${PORT}\`;

  const cmd \= process.platform \=== 'darwin' ? 'open' : 

              process.platform \=== 'win32' ? 'start' : 'xdg-open';

  exec(\`${cmd} ${url}\`);

});

**Features:**

- Serves any file from `frontend/` directory  
- Maps clean URLs (`/dashboard`) to actual files (`index.html`)  
- Sanitizes paths to block `../../../etc/passwd` attacks  
- Auto-opens default browser on startup  
- Returns proper MIME types for CSS, JS, images  
- 404 page for missing files

**The PMBOK 8 "AI Builder" Prompt Pattern:**

> "Write a `backend/server.js` file using ONLY Node.js built-in modules (http, fs, path, child\_process). It should serve static files from a `frontend/` directory, map routes like '/' to 'login.html' and '/dashboard' to 'index.html', sanitize paths to prevent directory traversal, set correct MIME types, handle 404 errors gracefully, and auto-open the default browser on startup. Do not use Express or any external npm packages."

---

## 3\. Human-in-the-Loop Audit Points for PM Teams

### Audit Point A: State Persistence & Cache Limits (The LocalStorage Test)

**The Risk:** In-memory state clears on page refresh. If a student enrolls in a course and hits refresh, the enrollment vanishes.

**The Solution:**

- All mock data arrays must be saved to `localStorage` after every mutation.  
- A "Reset to Baseline" button in the Developer HUD restores default mock data.  
- Manual test: Enroll in a course → Refresh browser → Verify enrollment persists.

### Audit Point B: FERPA Compliance & Client-Side Sanitization

**The Risk:** Console logging, telemetry, or sending unchecked academic history to public cloud APIs violates student privacy.

**The Solution:**

- The QA/Compliance Lead must inspect the browser console (F12) to ensure raw credentials, enrollment data, or chat histories are never logged.  
- The AI chat must ONLY send the user's question text to Gemini — never their identity, schedule, or academic record.  
- Mock audit logs in the Observability dashboard must be clearly labeled as simulated data.

### Audit Point C: UX Usability & Keyboard Focus Traps (WCAG Accessibility)

**The Risk:** AI-generated interfaces prioritize styling over accessibility.

**The Solution:**

- Test the entire portal without a mouse. Tab through all interactive elements.  
- Verify focus rings are visible (`focus:outline-none focus:ring-2`).  
- All form inputs must have associated `<label>` tags.  
- The Observability dashboard (dark theme) must maintain 4.5:1 contrast ratios.

### Audit Point D: Role-Based Access Control (RBAC) Verification

**The Risk:** A student could access the IT Director or Admin dashboards by typing the URL directly.

**The Solution:**

- Each dashboard page checks `localStorage` for the current user's role on load.  
- If `userState.role` doesn't match the required role, redirect to `login.html`.  
- Test: Log in as `student@cstu.edu` → Try to navigate to `/observability` → Verify redirect to login.

---

## 4\. What Constitutes a "Working MVP" for Grading?

To earn a top grade, student teams must demonstrate **Value Delivery under Constraint**. A successful "Day 60" working MVP includes:

1. **A Runnable Folder:** The `app_build/` directory that opens via `node backend/server.js` without errors.  
     
2. **Four Functional Dashboards:**  
     
   - `login.html` — Mock auth with 4 personas and role-based redirect  
   - `index.html` — Student Portal with courses, events, clubs, appointments, AI chat  
   - `observability.html` — IT mock metrics, logs, FERPA audit tracker  
   - `steering_committee_dashboard.html` — Executive KPIs, burndown chart, CSV upload

   

3. **Grounded AI Integration:** A functioning chatbox that responds accurately using an embedded system prompt containing CSTU policy text.  
     
4. **Schema-Aware Mock Data:** JavaScript arrays structured to mirror `SCHEMA.sql` tables, with LocalStorage persistence.  
     
5. **Zero-Dependency Server:** `server.js` runs with only Node.js built-in modules.  
     
6. **Clean Code Hygiene:** Code systematically structured with developer comments, section banners, and a manual validation trace log.  
     
7. **Path Sanitization:** Server blocks directory traversal attempts (verified by trying `http://localhost:3000/../../../etc/passwd`).  
     
8. **Role-Based Access:** Each dashboard verifies user role before rendering sensitive UI.

---

## 5\. File Structure Reference

app\_build/

├── backend/

│   └── server.js                          ← Zero-dependency HTTP server

├── database/

│   └── SCHEMA.sql                         ← Documentation schema (not executed)

├── frontend/

│   ├── login.html                         ← Mock auth gateway (4 personas)

│   ├── index.html                         ← Student Portal dashboard

│   ├── observability.html                 ← IT Director mock observability

│   ├── steering\_committee\_dashboard.html  ← Executive mock dashboard

│   └── dashboard\_metrics\_template.csv     ← Mock data template for exec charts

└── README.md

---

## 6\. How to Test

### Startup Test:

cd app\_build/backend

node server.js

\# Expect: Browser opens to http://localhost:3000 showing login.html

### Authentication Test:

1. Select "Student" from dropdown → Email auto-fills `student@cstu.edu`  
2. Enter any password → Click Login → Redirected to `index.html`  
3. Log out → Select "IT Director" → Redirected to `observability.html`  
4. Log out → Select "Steering Committee" → Redirected to `steering_committee_dashboard.html`

### Feature Test (Student Portal):

1. Enroll in 2 courses → Refresh → Verify enrollments persist  
2. Search events for "AI" → Verify filtering works  
3. RSVP to an event → Verify RSVP count updates  
4. Join a club → Verify "My Clubs" section updates  
5. Book an appointment → Verify slot turns CONFIRMED (gray)  
6. Ask chatbot "When is the refund deadline?" → Verify grounded response

### Security Test:

1. Open browser console → Verify no passwords or user data logged  
2. Try navigating to `/observability` as Student → Verify redirect  
3. Try `http://localhost:3000/../../../etc/passwd` → Verify 403 Forbidden

### Observability Test:

1. Log in as IT Director → Verify metrics panels animate  
2. Check FERPA audit log → Verify mock entries display  
3. Watch system logs → Verify auto-refresh adds entries

### Executive Test:

1. Log in as Admin → Verify KPI cards display  
2. Upload `dashboard_metrics_template.csv` → Verify charts update  
3. Check release timeline → Verify past/current/future releases shown

---

*End of CampusConnect MVP Technical Playbook — app\_build Edition*  
