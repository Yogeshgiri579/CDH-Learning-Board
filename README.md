# 🚀 CloudDevOpsHub 55-Session MultiCloud & DevOps LMS

A modern, high-performance **MERN Stack Learning Management System (LMS)** inspired by the **TakeUForward** prep-hub architecture and style. Designed specifically for the **[CloudDevOpsHub MultiCloud-DevOps-AI-Challenge](https://github.com/CloudDevOpsHub/MultiCloud-DevOps-AI-Challenge)** repository.

---

## ✨ Key Features

1. **55 Comprehensive Sessions**:
   - Structured step-by-step roadmap from foundations up to production AI in DevOps.
   - Divided across 8 progressive phases:
     - **Phase 1: Foundations & Program Kickoff** (Sessions 0 - 4) 🟢 **FREE FOR ALL**
     - **Phase 2: Linux Administration & Automation** (Sessions 5 - 12)
     - **Phase 3: Git & Version Control Pipelines** (Sessions 13 - 18)
     - **Phase 4: Multi-Cloud Engineering (AWS, GCP, Azure)** (Sessions 19 - 28)
     - **Phase 5: Containers & Docker Mastery** (Sessions 29 - 36)
     - **Phase 6: Kubernetes (K8s) Orchestration** (Sessions 37 - 45)
     - **Phase 7: Infrastructure as Code (Terraform) & GitOps** (Sessions 46 - 50)
     - **Phase 8: Observability, SRE & AI in DevOps** (Sessions 51 - 54)

2. **First 5 Sessions Free + Direct GitHub Redirect**:
   - Sessions 0 through 4 are **100% Free** without requiring an account.
   - Clicking **"Start Session"** or **"Start Now → GitHub"** seamlessly redirects users directly to the specific folder on your GitHub repository: `https://github.com/CloudDevOpsHub/MultiCloud-DevOps-AI-Challenge/tree/main/<Session-Folder>`.

3. **Smart Auth Gate for Sessions 5–54**:
   - Non-logged-in visitors can browse topics and see previews of sessions 5–54.
   - When attempting to access full labs on locked sessions, an elegant, lightweight **Auth Modal** appears prompting them to **Continue with Google** or sign in.
   - Includes a **1-Click Demo Account** button for instantaneous testing.

4. **TakeUForward Prep-Hub Design System**:
   - **Lightweight color palette**: Clean slate, crisp borders, subtle shadows, and soft indigo/emerald badges.
   - **TakeUForward Roadmap Tree View**: Replicates the hierarchical collapsible folder structure with connector lines, status badges (`Free`, `Locked`, `Completed`), and live `0/55` progress tracking.
   - **Component-Driven Architecture**: Cleanly separated into `Navbar`, `Header` (Hero), `SessionCard`, `SessionPreviewModal`, `TakeUForwardSidebar`, `ProgressBanner`, `AuthModal`, and `Footer`.

5. **Progress Persistence & Checkboxes**:
   - Learners can check off sessions as completed.
   - Progress bar updates dynamically (`0/55`, `25%`, etc.) with streak counters.

---

## 🛠️ Tech Stack

- **Frontend**: React 19, Vite, Tailwind CSS, Lucide Icons
- **Backend**: Node.js, Express, MongoDB (Mongoose) + High-Performance In-Memory store fallback
- **Auth**: JWT (JSON Web Tokens), bcryptjs password hashing, Google OAuth handler

---

## 📂 Project Structure

```
LearnWithCDH/
├── package.json              # Monorepo scripts
├── server/                   # Express + Node.js API backend
│   ├── config/db.js          # MongoDB connection with memory fallback
│   ├── controllers/
│   │   ├── authController.js # Register, login, googleAuth, progress tracking
│   │   └── sessionController.js # 55 sessions handler, previews, lock validation
│   ├── data/sessionsData.js  # Curated 55 sessions dataset matching GitHub repo
│   ├── middleware/authMiddleware.js
│   ├── models/User.js        # Mongoose User schema & mock store
│   ├── routes/authRoutes.js
│   ├── routes/sessionRoutes.js
│   ├── server.js             # API entry point (:5000)
│   └── .env
└── client/                   # React + Vite + Tailwind CSS frontend
    ├── src/
    │   ├── components/
    │   │   ├── Navbar.jsx    # Top navigation & search shortcut
    │   │   ├── Header.jsx    # Hero, quick preview box & Start Now CTA
    │   │   ├── TakeUForwardSidebar.jsx # Screenshot 2 tree roadmap sidebar
    │   │   ├── SessionCard.jsx # Prep-hub session card
    │   │   ├── SessionPreviewModal.jsx # Preview drawer with GitHub redirect
    │   │   ├── AuthModal.jsx # Google Sign-in & email login modal
    │   │   ├── ProgressBanner.jsx # 0/55 progress tracker
    │   │   ├── GithubIcon.jsx # GitHub SVG icon
    │   │   └── Footer.jsx    # Footer with workshop links
    │   ├── context/AuthContext.jsx # Global user auth & progress state
    │   ├── data/sessions.js  # Instant-load sessions cache
    │   ├── services/api.js   # Fetch API client
    │   ├── App.jsx           # Main view switcher (Explore Grid vs Tree View)
    │   └── main.jsx
    ├── tailwind.config.js
    └── vite.config.js
```

---

## 🚀 How to Run Locally

### 1. Start Backend API Server
```powershell
cd server
npm install
node server.js
```
The backend starts at `http://localhost:5000`.

### 2. Start Frontend Dev Server
```powershell
cd client
npm install
npm run dev
```
The frontend opens at `http://localhost:5173`.

### 3. Quick Test Credentials
- **1-Click Button**: Click *"1-Click Demo Account 🚀"* inside the Auth Modal
- **Email**: `learner@clouddevopshub.com`
- **Password**: `password123`
- **Google Sign-In**: Click *"Continue with Google"* to authenticate immediately with demo Google profile.
