# Resourcia – Distributed Resource Booking System

Resourcia is a full-stack, multi-tenant resource booking platform designed to handle **concurrent reservations safely at scale**. It supports organizations such as colleges or offices to manage rooms, halls, and shared resources with **conflict-free scheduling** and **real-time Google Calendar synchronization**.

---

## 🚀 Features

- 🏢 **Multi-tenant architecture** — supports multiple organizations with isolated resources and users  
- 🔒 **Conflict-free bookings** using Redis-based distributed locking  
- 📅 **Google Calendar integration** for real-time event creation and synchronization  
- ⏱️ **Timezone-aware scheduling** to prevent invalid or overlapping reservations  
- 🔐 **Role-based access control** (Admin / Member)  
- ⚡ **Production-grade REST APIs** with strict validation and transactional consistency  
- ☁️ **Cloud deployment** with managed CI/CD pipelines

---

## 🧠 System Design Highlights

- **Distributed Locking:**  
  Redis locks ensure atomic booking operations and prevent race conditions during high concurrency.

- **Transactional Consistency:**  
  Database transactions guarantee correct state even when failures occur mid-operation.

- **Calendar Synchronization:**  
  Bookings are mirrored to Google Calendar using service accounts, enabling external visibility and conflict awareness.

---

## 🛠️ Tech Stack

### Frontend
- React
- Vite
- Axios
- Tailwind CSS

### Backend
- Node.js
- Express.js
- PostgreSQL (Supabase)
- Redis (Upstash)
- Zod (request validation)
- Google Calendar API

### Deployment & Infrastructure
- Vercel (Backend, Frontend)
- Supabase (PostgreSQL)
- Upstash (Redis)
- GitHub-integrated CI/CD
- Secure environment configuration & CORS hardening

---

## 📋 Prerequisites

Make sure you have the following installed:

- Node.js (v18+ recommended)
- npm or yarn
- PostgreSQL (if running locally)
- Google Cloud account (for Calendar API)
- Supabase account

---

## ⚙️ Installation Steps

### 1️⃣ Clone the repository
```bash
git clone https://github.com/pratikdeoke/Resourcia.git
cd Resourcia
```

### 2️⃣ Install Dependencies

Install dependencies for both backend and frontend.

### Backend
```bash
cd backend
npm install
```

### Frontend
```bash
cd frontend
npm install
```

---

## ▶️ Run Commands

### Start Backend (Development)
```bash
cd backend
npm run dev

Backend will run at:
http://localhost:5000
```

### Start Frontend
```bash
cd frontend
npm run dev

Frontend will run at:
http://localhost:5173
```

---

## 🔐 Environment Variables (.env Setup)

### Backend (.env)
Create a `.env` file inside the `backend` folder and add:

```bash
PORT=5000
DATABASE_URL=postgresql://USER:PASSWORD@HOST:PORT/DATABASE

SUPABASE_URL=https://your-project-id.supabase.co
SUPABASE_ANON_KEY=your_supabase_anon_key

GOOGLE_CLIENT_EMAIL=your_service_account_email
GOOGLE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\nYOUR_PRIVATE_KEY\n-----END PRIVATE KEY-----\n"
GOOGLE_PROJECT_ID=your_google_project_id
or
GOOGLE_CALENDAR_JSON=value

JWT_SECRET=your_jwt_secret
```

### Frontend (.env)
```bash
Create a `.env` file inside the `frontend` folder and add:

VITE_API_BASE_URL=http://localhost:5000/api/v1
```
---

## 🗂️ Project Structure
```bash
Resourcia/
├── backend/
│   ├── src/
│   │   ├── config/
│   │   ├── controllers/
│   │   ├── repositories/
│   │   ├── routes/
│   │   ├── validations/
│   │   ├── middlewares/
│   │   ├── server.js
│   │   └── app.js
│   ├── .env
│   └── package.json
│
├── frontend/
│   ├── src/
│   │   ├── api/
│   │   ├── components/
│   │   ├── pages/
│   │   ├── layouts/
│   │   └── main.jsx
│   ├── .env
│   └── package.json
│
└── README.md
```
---

## 📘 API Documentation

### Base URL
```bash
/api/v1
```

### Endpoints
```bash
POST /api/v1/organizations  
POST /api/v1/resources  
POST /api/v1/bookings  
GET  /api/v1/bookings/:resourceId
```

### Notes
- All APIs accept and return JSON
- Input validation is handled using Zod
- Role-based access control is implemented
- Protected routes require authentication

---

## ⚠️ Known Issues / Limitations

- No automated tests
- Google Calendar sync is one-way
- No email or notification system

---

## 🛣️ Future Improvements / Roadmap

- Add automated testing (Jest / Vitest)
- Email & notification system
- Two-way Google Calendar sync
- Analytics dashboard
- OAuth authentication

---

## 📄 License

MIT License

---

## 👨‍💻 Author

Pratik Deoke  
GitHub: https://github.com/pratikdeoke

---

## 🤝 Contributors

Contributions are welcome.  
Fork the repository and submit a pull request.
