# ⚙️ Installation & Setup

## Requirements

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
