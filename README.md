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

---

### 🔧 Step 1: Clone the Repository

```bash
git clone https://github.com/your-username/your-repo-name.git
cd your-repo-name
```

---

### 📦 Step 2: Install Dependencies (Handle Peer Deps Issues)

```bash
npm install --legacy-peer-deps
```

> 🔍 This command installs all the required node modules while ignoring peer dependency conflicts (which may occur with packages like React 18, Tailwind, etc.).

---

### 🛠️ Step 3: Install Additional Dependency (react-is)

```bash
npm install react-is
```

> ✅ This package is often needed by libraries like `react-dom`, `formik`, or other React utility tools.

---

### 🏗️ Step 4: Build the Application

```bash
npm run build
```

> 🧱 This will compile the Next.js project for production. It performs static optimization, transpiles TypeScript/JSX, and prepares everything in the `.next` folder.

---

### 🌐 Step 5: Start the Development Server

```bash
npm run dev
```

> 🖥️ This launches your frontend at:
> `http://localhost:3000`
> Open it in your browser to view the app.

---

### ✅ Output

Once it's running, you should see your **Tata Steel L\&D Platform homepage**, complete with:

- 📚 Course modules
- 👤 User dashboard
- 🎓 Registration & Certificate section
- 📥 Learning content and resources

---

### ⚠️ Common Tips

- If the server fails to start, delete `node_modules` and `package-lock.json`, then reinstall:

  ```bash
  rm -rf node_modules package-lock.json
  npm install --legacy-peer-deps
  ```

- Use `.env.local` if you have environment variables (e.g., `NEXT_PUBLIC_API_URL`, etc.)

---

Here's a complete **step-by-step guide** to help you or any team member run the **Tata Steel Learning & Development Platform** — including both **frontend and backend**, with **MongoDB integration**. This also covers what to install on a fresh system and how to run the project locally. 👇

---

# 🛠️ How to Run the Project (Frontend + Backend + Database)

> 💻 Platform Stack: React (Next.js), Node.js, Prisma, MongoDB
> 🌐 Deployment-ready: Yes (Vercel + MongoDB Atlas)

---

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

## ⚙️ Step-by-Step: Setup & Run (Clean System)

---

## 1️⃣ Clone the Repository

```bash
git clone https://github.com/your-username/tata-steel-learning-platform.git
cd tata-steel-learning-platform
```

---

## 2️⃣ Install All Dependencies (Frontend + Backend Shared)

```bash
npm install --legacy-peer-deps
npm install react-is
```

---

## 3️⃣ Configure Environment Variables

Create a `.env` file in the root directory and add your MongoDB URI like this:

```env
DATABASE_URL="mongodb+srv://<username>:<password>@cluster0.mongodb.net/tata-steel-learning?retryWrites=true&w=majority"
```

📌 Replace `<username>` and `<password>` with your MongoDB Atlas credentials.

> 📖 Refer to [`MongoDB Setup Guide`](f) for step-by-step help.

---

## 4️⃣ Connect to MongoDB

✅ Option A: If this is a fresh setup

```bash
npm run setup:mongodb
```

This will:

- Generate Prisma client
- Push schema to MongoDB
- Seed initial data

✅ Option B: If you're migrating from SQLite

```bash
npm run migrate:sqlite-to-mongodb
```

---

## 5️⃣ Run Backend (API + DB Connectivity)

This project uses **Next.js API routes**, so **you don’t need a separate Express server**.

> The backend will automatically work when `npm run dev` is started from the root.

---

## 6️⃣ Start the Frontend (Local Dev Server)

```bash
npm run dev
```

Then visit [http://localhost:3000](http://localhost:3000) 🚀

---

## 🧪 Optional: Build for Production

```bash
npm run build
```

To preview a production build:

```bash
npm run start
```

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
