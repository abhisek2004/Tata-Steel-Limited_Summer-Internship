# 📘 Tata Steel Learning & Development (L&D) Platform

> 🚀 A smart, scalable, and responsive web platform built to modernize and digitize Tata Steel's internal training ecosystem!

---

# Engineer Intern Trainee Tata Steel Limited. Kalinganagar, Odisha, India (May 2025 - Jul 2025 · 2 Mon · Jajpur, Odisha, India · On-site)

![tata-steel-logo](https://github.com/user-attachments/assets/38334249-dd67-4679-a445-b5293bcbfb56)
![Abhisek offer letter](https://github.com/user-attachments/assets/c19fd536-97c2-4535-8c31-4132aa16ccc7)
![2 (5)](https://github.com/user-attachments/assets/d27b2a04-4224-4faf-89b7-38067460ccef)

---

## 🌟 Overview

This project is a full-stack Learning & Development (L&D) web application tailored for Tata Steel’s workforce. It empowers employees to:

- 📚 Register for training programs
- 🎯 Track learning progress
- 📥 Access and download learning resources
- 🎓 Receive digital certificates after completion
- 📊 Administer and manage course content centrally

The entire platform is built using modern web technologies and deployed for high availability on **Vercel**, ensuring accessibility and performance.

---

## 🏗️ What I Built

In this project, I developed a **complete digital learning management system (LMS)** for Tata Steel's workforce with a user-centric and scalable approach. The core idea was to replace traditional training and HRD workflows with a centralized, efficient, and self-service solution.

**Key deliverables:**

- ✅ A responsive frontend for users to browse, register, and complete courses
- ✅ Admin panel to manage modules, events, documents, and certificates
- ✅ Session-based authentication to ensure secure access
- ✅ Routing with caching support using **Next.js catch memory**
- ✅ In-progress backend using **Prisma** and **MongoDB** for persistent storage

🎯 The goal was to align with Tata Steel’s ongoing digital transformation strategy, improve accessibility, and enhance learning experiences across the organization.

---

## ⚙️ Tech Stack

| Layer         | Technology                             |
| ------------- | -------------------------------------- |
| 💻 Frontend   | TypeScript, React.js, Next.js          |
| 🧠 Backend    | Node.js (Prisma + MongoDB in progress) |
| 📡 APIs       | Integrated content/news APIs           |
| 🚪 Auth       | Session-based (via NextAuth.js)        |
| ☁️ Deployment | Vercel                                 |

---

## ✨ Key Features

- 📋 **Course Registration** – Users can browse and enroll in available technical/soft skill modules
- 📄 **Downloadable Materials** – PDF handbooks and event resources
- 🎓 **Auto Certificate Generation** – After course/module completion
- 🛡 **Secure Session Management** – Protects user data and progress
- 🛠️ **Admin Tools** – Easily upload content, update training materials, or manage events
- 📱 **Responsive UI/UX** – Mobile-first design for on-the-go learning
- 📦 **Optimized Routing** – Faster load times via caching in Next.js
- 🔒 **Access Control** – Basic authorization to restrict modules

---

## 🚧 Current Status

- ✅ Frontend design fully implemented and deployed
- 🔄 Backend integration with **Prisma & MongoDB** is in progress
- 📈 More dashboard analytics and admin controls coming soon

---

Here's a complete, step-by-step guide on **how to run the frontend** of your Tata Steel Learning & Development platform locally, written in a clean, developer-friendly format — only for the **frontend (React + Next.js + TypeScript)** setup. ✅

---

## 🚀 How to Run the Frontend Locally

> ⚙️ Tech Stack: React.js, Next.js, TypeScript
> 📦 Package Manager: npm
> 🧠 Note: Make sure Node.js is installed (Recommended: Node v16+)



## 📦 Getting Started

### ✅ Prerequisites

- **Node.js** ≥ 18  
- **npm / yarn / pnpm**  
- MongoDB or SQLite installed  

---

# 🧪 Tata Steel Learning & Development Platform – Setup Guide

---

## ✅ OPTION 1: Run Only the **Frontend (React + Next.js)**

This is helpful if:

* You're working on UI development only
* You don’t need to interact with the backend/database
* You're designing or testing frontend pages/components

---

### 🔧 Step-by-Step (Frontend Only)

1. **📥 Clone the Repo**

```bash
git clone https://github.com/abhisek2004/Tata-Steel-Limited_Summer-Internship.git
cd Tata-Steel-Limited_Summer-Internship
```

2. **📦 Install Dependencies**

```bash
npm install --legacy-peer-deps
```

3. **(Optional) Fix Peer Dependency Errors**

If needed, install this manually:

```bash
npm install react-is
```

4. **🔨 Build the App**

```bash
npm run build
```

This will compile the frontend into `.next` folder for production-ready code.

5. **▶️ Run the Development Server**

```bash
npm run dev
```

6. **🌐 Visit Your App**

Open your browser and go to:

```
http://localhost:3000
```

---

### ✅ What You’ll See:

* 👤 Home Page with Tata Steel Branding
* 📚 Course List
* 🎓 Certificates UI
* 📥 Downloadable Resources (if mocked)
* 🌓 Dark Mode & Navbar
* 🛠 Dashboard UI components (even if API is not connected)

> 🔹 **No backend required** in this case, but data will be mocked or unavailable if backend endpoints are used.

---

## ✅ OPTION 2: Run **Frontend + Backend + Database (Full Stack)**

Use this for **full feature access**, including:

* 🔐 Authentication
* 📚 Real courses and progress tracking
* 📥 File Downloads (Resources)
* 🎓 Certification
* 📊 Analytics

---

### ⚙️ Step-by-Step (Frontend + Backend + MongoDB)

> ✅ This requires MongoDB and backend logic from your [GitHub repo](https://github.com/abhisek2004/Tata-Steel-Limited_Summer-Internship.git)

---

### 1️⃣ Clone the Full Stack Repo

```bash
git clone https://github.com/abhisek2004/Tata-Steel-Limited_Summer-Internship.git
cd Tata-Steel-Limited_Summer-Internship
```

---

### 2️⃣ Install Dependencies

```bash
npm install --legacy-peer-deps
# OR if you're using yarn
yarn install
```

---

### 3️⃣ Set Up Environment Variables

Create a file named `.env` in the root folder and add:

```env
# MongoDB connection
DATABASE_URL="mongodb://localhost:27017/tata-lms"

# Next.js
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="your-secret-key"
JWT_SECRET="your-jwt-secret"
```

> ⚠️ Change `localhost` to MongoDB Atlas URI if using cloud DB

---

### 4️⃣ Initialize MongoDB with Prisma

```bash
npx prisma generate
npx prisma migrate dev --name init
npx prisma db seed
```

> This sets up your database schema as defined in `prisma/schema.prisma`

✅ You can preview schema here:
🔗 [View Prisma Schema in GitHub](https://github.com/abhisek2004/Tata-Steel-Limited_Summer-Internship/blob/main/prisma/schema.prisma)

---

### 5️⃣ Run the Development Server

```bash
npm run dev
```

> It will serve both frontend (React/Next.js) and backend API routes under `/api/*`

---

### 6️⃣ Open Your Full Platform

Visit:

```
http://localhost:3000
```

Now you'll see:

* 🔐 Login / Register
* 📚 Real courses with API-connected data
* 📈 Dashboard analytics
* 📥 PDF generation from resources
* 🎓 Auto-generated certificates
* 📊 Admin dashboard for reports

---

## 🧠 Quick Commands Reference

| Task                       | Command                              |
| -------------------------- | ------------------------------------ |
| 🛠 Install dependencies    | `npm install --legacy-peer-deps`     |
| 🧪 DB setup (SQLite)       | `npx prisma migrate dev --name init` |
| 🌱 Seed DB                 | `npx prisma db seed`                 |
| 🚀 Run Dev Server          | `npm run dev`                        |
| 🧱 Build for Production    | `npm run build`                      |
| 🌐 Start Production Server | `npm start`                          |
| 🔀 Switch DB               | `npm run switch:database`            |

---

## ✅ Final Tips

* If app crashes on install:

  ```bash
  rm -rf node_modules package-lock.json
  npm install --legacy-peer-deps
  ```

* If you face **CORS** or **download errors**, check API `/resources` route and make sure file URLs are served correctly.

* Use **MongoDB Compass** to visually inspect your DB schema and data.


## 🗂️ Project Structure

```
├── app/                      # Pages & API (App Router)
│   ├── api/                  # API routes
│   ├── dashboard/            # User dashboard
│   ├── courses/              # Course details & listing
│   └── training-modules/     # Standalone learning units
├── components/
│   ├── course-dashboard-content.tsx
│   ├── course-analytics.tsx
│   ├── course-certificate.tsx
│   └── ui/                   # Shared UI components
├── hooks/                    # Custom React hooks
├── lib/                      # Utility helpers
│   ├── prisma.ts
│   ├── auth-utils.ts
│   └── download-utils.ts
├── prisma/                   # Database schema and seeding
├── public/                   # Static files (PDFs, images)
├── styles/                   # Global & Tailwind styles
├── tailwind.config.ts        # Tailwind config
├── tsconfig.json             # TypeScript config
├── package.json              # Scripts & dependencies
└── README.md
```

---

## 🧪 API Endpoints

### 🔐 Authentication

| Endpoint                  | Purpose                  |
| ------------------------- | ------------------------ |
| `/api/auth/[...nextauth]` | NextAuth internal routes |
| `/api/auth/register`      | Register new user        |
| `/api/auth/login`         | JWT-based login          |
| `/api/auth/me`            | Get current user         |

### 📚 Course & Learning APIs

| Endpoint                | Purpose                       |
| ----------------------- | ----------------------------- |
| `/api/courses`          | Course management             |
| `/api/training-paths`   | Structured learning paths     |
| `/api/training-modules` | Short learning modules        |
| `/api/events`           | Workshops and training events |
| `/api/resources`        | PDFs, videos, notes           |
| `/api/progress`         | Track learner progress        |
| `/api/certificates`     | Manage course certificates    |

### 📈 Analytics (Admin Only)

| Endpoint         | Purpose                        |
| ---------------- | ------------------------------ |
| `/api/dashboard` | User summary stats             |
| `/api/analytics` | Admin-level insights           |
| `/api/reports`   | Exportable performance reports |

---

## 📊 Database Schema (Simplified)

* 👤 `User`
* 📘 `Course`
* 📈 `Progress`
* 🧱 `TrainingModule`
* 🧭 `TrainingPath`
* 🎓 `Certificate`
* 📂 `Resources`
* 📅 `Events` + `Registrations`
* 💬 `Discussions`

---

## 📄 Docs & Guides

* [📥 MongoDB Setup Guide](./MONGODB_SETUP_GUIDE.md)
* [🔁 Migration: SQLite → MongoDB](./MONGODB_MIGRATION.md)
* [🔐 JWT Auth Guide](./JWT_AUTH.md)
* [🛠 MongoDB Troubleshooting](./MONGODB_TROUBLESHOOTING.md)

---

## 🧠 Acknowledgements

* ⚛️ [React.js](https://reactjs.org)
* 🔼 [Next.js](https://nextjs.org)
* 🌬️ [Tailwind CSS](https://tailwindcss.com)
* 💾 [Prisma ORM](https://www.prisma.io/)
* 🔐 [NextAuth.js](https://next-auth.js.org/)
* 🧾 [jsPDF](https://github.com/parallax/jsPDF)
* 🧩 [shadcn/ui](https://ui.shadcn.dev)










## ✅ What You Need to Download Before Running

### 🔗 System Requirements

| Tool          | Version (Recommended)     |
| ------------- | ------------------------- |
| Node.js       | v16+ or v18+              |
| npm           | v7+                       |
| Git           | Latest                    |
| MongoDB Atlas | Free Tier / Local MongoDB |
| Code Editor   | VS Code (Optional)        |

---

## 3️⃣ Configure Environment Variables

Create a `.env` file in the root directory and add your MongoDB URI like this:

```env
DATABASE_URL="mongodb+srv://<username>:<password>@cluster0.mongodb.net/tata-steel-learning?retryWrites=true&w=majority"
```

📌 Replace `<username>` and `<password>` with your MongoDB Atlas credentials.

> 📖 Refer to [`MongoDB Setup Guide`](f) for step-by-step help.

---

---

## 🛡️ JWT Authentication (for APIs)

> JWT and NextAuth.js are both supported

To test JWT APIs:

```bash
POST /api/auth/login
```

Pass JSON:

```json
{
  "email": "admin@example.com",
  "password": "your_password"
}
```

Then use:

```http
Authorization: Bearer <your_token>
```

✅ Full docs here: [JWT Auth Guide](f)

---

## 📂 Useful Dev Commands

| Command                           | Purpose                                    |
| --------------------------------- | ------------------------------------------ |
| `npm run dev`                     | Start dev server (frontend + backend)      |
| `npm run build`                   | Build production build                     |
| `npm run prisma:studio`           | GUI to manage database with Prisma         |
| `npm run generate:client`         | Generate Prisma client after schema update |
| `npm run check:connection-string` | Validate MongoDB string                    |

---

## 🔐 Prisma + MongoDB Structure

- ORM: Prisma
- Models: Users, Courses, Events, Modules
- Auth: Role-based with JWT & session
- DB: MongoDB Atlas (or local fallback)

---

## ✅ Final Output

Once the app is running, you’ll get:

- 🏠 Homepage with hero banner & navigation
- 📚 Course listing + content + register & complete
- 📅 Training calendar with Teams links
- 📥 Downloadable handbooks, PDFs, Excel files
- 🧑‍💼 Dashboard with progress tracking
- 🧾 Certificate generation (after course/module completion)

---

## 🔄 Troubleshooting

- Use `npm run check:mongodb-utilities` to confirm all setup
- Ensure `.env` file is configured properly
- Whitelist your IP in MongoDB Atlas

---

## 📸 Screenshots

> Work Flow Diagram ....
![tata steel](https://github.com/user-attachments/assets/14d8b528-7179-4abf-93f9-cc3e34b2eb69)

---

> Website previews,Demo certificate ....
![1](https://github.com/user-attachments/assets/870a77fc-5ea5-489b-ba2c-afaaf8a44b44)
![2](https://github.com/user-attachments/assets/6df93ac3-1de0-4a08-85db-2d58ecb2b044)
![3](https://github.com/user-attachments/assets/9e22895e-b1a8-4187-8617-cb29252c3e41)
![4](https://github.com/user-attachments/assets/36be8b34-0b7c-4edb-9674-df22d44fb986)
![4)](https://github.com/user-attachments/assets/f0987c28-9519-4c9f-b161-d54b12c1f8e6)
![5)](https://github.com/user-attachments/assets/ea3323f4-7e5e-4093-809b-494fd6189de9)
![5](https://github.com/user-attachments/assets/18c6f5c8-71e7-495c-9ac2-d908627b834a)
![6](https://github.com/user-attachments/assets/0aedfbbf-cc87-4d18-9fa0-3a94cbfee8cc)
![7](https://github.com/user-attachments/assets/e7320a0a-e8b0-4544-a701-f3f3ad305ed9)
![8](https://github.com/user-attachments/assets/2a267d71-f43b-4793-b898-2d7897c3cdea)
![9](https://github.com/user-attachments/assets/93033895-17f2-437e-97aa-f2f92a4f8e1c)
![10](https://github.com/user-attachments/assets/0e216834-b5ba-48c2-aac2-1d15e69d1077)
![11](https://github.com/user-attachments/assets/e9683008-8345-4dab-b8fa-38ae5638f46b)
![12](https://github.com/user-attachments/assets/573a920a-90b4-458a-a8d8-70eff6d133cd)
![13](https://github.com/user-attachments/assets/4e7a65d8-8e43-4b48-83c0-6f1581457364)
![14](https://github.com/user-attachments/assets/cd8185db-5850-4238-a832-8eb85e4f1178)
![15](https://github.com/user-attachments/assets/9b78bc15-0aa3-4445-9b2d-339a9fad8573)
![16](https://github.com/user-attachments/assets/8752b5c4-7663-4837-8380-03a92fd07a79)
![17](https://github.com/user-attachments/assets/af79f255-1bfd-4cdd-ba95-b91f28eaaa06)
![18](https://github.com/user-attachments/assets/869a3d9d-3d42-4ceb-9358-617ad2c24d0e)
![19](https://github.com/user-attachments/assets/1fcdd85d-10b2-4bb3-8a1c-d8cac5bd3cc3)
![20](https://github.com/user-attachments/assets/9387145d-30fb-4d96-b7db-cf39040e4ef7)
![21](https://github.com/user-attachments/assets/bbcaed98-2c5b-471d-8645-46c1f1351726)
![22](https://github.com/user-attachments/assets/811f9586-3e95-4cc0-9d63-ddd4cd81c476)
![23](https://github.com/user-attachments/assets/69ec53fb-b477-4056-bb22-d645e4608014)


---

#### Guidelines

- Write clean, modular code.
- Include comments and documentation.
- Add or update tests where relevant.

---

📖 [Click here to read more about Tata Steel Kalinganagar](ABOUT.md)

---







# 🏗️ Tata Steel Learning Platform

A comprehensive **Learning & Development** system for Tata Steel employees — enabling upskilling, certifications, and progress tracking 📈 in a modern, responsive interface.

---

## 🚀 Features

- 🎓 **Course Management** — Explore, enroll in, and complete interactive courses  
- 📘 **Training Paths** — Structured, goal-based learning journeys  
- 🧱 **Training Modules** — Bite-sized content for focused learning  
- 📅 **Events** — Register for workshops and training sessions  
- 🏅 **Certification** — Earn certificates upon course completion  
- 📊 **Progress Tracking** — Monitor learning journey in real-time  
- 📈 **Admin Analytics** — Insights into platform usage and learning impact  

---

## 🛠️ Tech Stack

| Layer      | Technology Used                            |
|------------|--------------------------------------------|
| 👨‍💻 Frontend | React, Next.js (App Router), TypeScript     |
| 🎨 Styling   | Tailwind CSS, shadcn/ui components         |
| ⚙️ Backend   | Next.js API Routes, Prisma ORM             |
| 💾 Database | MongoDB (Primary) / SQLite (Dev Support)   |
| 🔐 Auth     | NextAuth.js + JWT                          |
| 🧾 PDFs     | jsPDF for certificates and downloads       |

---

## 📦 Getting Started

### ✅ Prerequisites

- **Node.js** ≥ 18  
- **npm / yarn / pnpm**  
- MongoDB or SQLite installed  

---

### 🧪 Installation

1. **Clone the repository**  
   ```bash
   git clone https://github.com/your-username/tata-steel-learning.git
   cd tata-steel-learning
````

2. **Install dependencies**

   ```bash
   npm install
   # or
   yarn install
   # or
   pnpm install
   ```

3. **Set up environment variables**
   Create a `.env` file with the following:

   ```env
   # For MongoDB
   DATABASE_URL="mongodb://<username>:<password>@localhost:27017/tata-lms?authSource=admin"

   # For SQLite (optional for dev)
   # DATABASE_URL="file:./dev.db"

   NEXTAUTH_URL="http://localhost:3000"
   NEXTAUTH_SECRET="your-secret-key"
   JWT_SECRET="your-jwt-secret"
   ```

4. **Initialize Database**

   * For MongoDB:

     ```bash
     npm run setup:mongodb
     ```

   * For SQLite (dev):

     ```bash
     npx prisma generate
     npx prisma migrate dev --name init
     npx prisma db seed
     ```

   * Optional Database Switcher:

     ```bash
     npm run switch:database
     ```

5. **Start the server**

   ```bash
   npm run dev
   # or
   yarn dev
   # or
   pnpm dev
   ```

6. Open 👉 [http://localhost:3000](http://localhost:3000)

---

## 🗂️ Project Structure

```
├── app/                      # Pages & API (App Router)
│   ├── api/                  # API routes
│   ├── dashboard/            # User dashboard
│   ├── courses/              # Course details & listing
│   └── training-modules/     # Standalone learning units
├── components/
│   ├── course-dashboard-content.tsx
│   ├── course-analytics.tsx
│   ├── course-certificate.tsx
│   └── ui/                   # Shared UI components
├── hooks/                    # Custom React hooks
├── lib/                      # Utility helpers
│   ├── prisma.ts
│   ├── auth-utils.ts
│   └── download-utils.ts
├── prisma/                   # Database schema and seeding
├── public/                   # Static files (PDFs, images)
├── styles/                   # Global & Tailwind styles
├── tailwind.config.ts        # Tailwind config
├── tsconfig.json             # TypeScript config
├── package.json              # Scripts & dependencies
└── README.md
```

---

## 🧪 API Endpoints

### 🔐 Authentication

| Endpoint                  | Purpose                  |
| ------------------------- | ------------------------ |
| `/api/auth/[...nextauth]` | NextAuth internal routes |
| `/api/auth/register`      | Register new user        |
| `/api/auth/login`         | JWT-based login          |
| `/api/auth/me`            | Get current user         |

### 📚 Course & Learning APIs

| Endpoint                | Purpose                       |
| ----------------------- | ----------------------------- |
| `/api/courses`          | Course management             |
| `/api/training-paths`   | Structured learning paths     |
| `/api/training-modules` | Short learning modules        |
| `/api/events`           | Workshops and training events |
| `/api/resources`        | PDFs, videos, notes           |
| `/api/progress`         | Track learner progress        |
| `/api/certificates`     | Manage course certificates    |

### 📈 Analytics (Admin Only)

| Endpoint         | Purpose                        |
| ---------------- | ------------------------------ |
| `/api/dashboard` | User summary stats             |
| `/api/analytics` | Admin-level insights           |
| `/api/reports`   | Exportable performance reports |

---

## 📊 Database Schema (Simplified)

* 👤 `User`
* 📘 `Course`
* 📈 `Progress`
* 🧱 `TrainingModule`
* 🧭 `TrainingPath`
* 🎓 `Certificate`
* 📂 `Resources`
* 📅 `Events` + `Registrations`
* 💬 `Discussions`

---

## 📄 Docs & Guides

* [📥 MongoDB Setup Guide](./MONGODB_SETUP_GUIDE.md)
* [🔁 Migration: SQLite → MongoDB](./MONGODB_MIGRATION.md)
* [🔐 JWT Auth Guide](./JWT_AUTH.md)
* [🛠 MongoDB Troubleshooting](./MONGODB_TROUBLESHOOTING.md)

---

## 🧪 Example Features Implemented

✅ User auth & JWT
✅ Course dashboard with curriculum
✅ Downloadable PDFs (Resources section)
✅ Quizzes & interactive content
✅ Progress analytics
✅ Certificate generation using jsPDF
✅ Mobile responsive layout
✅ Toast notifications

---

## 🧠 Acknowledgements

* ⚛️ [React.js](https://reactjs.org)
* 🔼 [Next.js](https://nextjs.org)
* 🌬️ [Tailwind CSS](https://tailwindcss.com)
* 💾 [Prisma ORM](https://www.prisma.io/)
* 🔐 [NextAuth.js](https://next-auth.js.org/)
* 🧾 [jsPDF](https://github.com/parallax/jsPDF)
* 🧩 [shadcn/ui](https://ui.shadcn.dev)

---

## 🔒 License

This project is **proprietary and confidential**. Not for public distribution.

---

> 📢 *Building Skills for a Sustainable Future* – Tata Steel Learning & Development
