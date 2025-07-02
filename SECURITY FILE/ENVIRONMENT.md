# 🌱 Environment Setup

This document outlines the essential software, libraries, and hardware required to set up and run the Tata Steel Learning & Development platform locally or for development.

---

## 🖥️ Software

The platform is built using a **modern web development stack** based on React and Next.js.

| Tool        | Version (Recommended) |
| ----------- | --------------------- |
| **Node.js** | v16.0.0 or above      |
| **npm**     | v7.0.0 or above       |
| **Git**     | Latest                |
| **MongoDB** | Atlas (Cloud) or v6+  |
| **VS Code** | Optional (for coding) |
| **Browser** | Chrome / Edge         |

> ✅ Install [Node.js & npm](https://nodejs.org) and [MongoDB](https://www.mongodb.com/cloud/atlas) before starting.

---

## 📦 Libraries

Here are the major libraries used across the project:

### 🔹 Frontend (React + Next.js)

| Library               | Purpose                     |
| --------------------- | --------------------------- |
| **React**             | UI Components               |
| **Next.js**           | Routing, API Routes         |
| **TypeScript**        | Static Typing               |
| **TailwindCSS**       | Utility-first CSS framework |
| **Axios**             | HTTP Requests               |
| **React Icons**       | Icon Library                |
| **NextAuth / JWT**    | Authentication              |
| **SWR / React Query** | API Data Fetching (if used) |

### 🔹 Backend & Database

| Library        | Purpose                      |
| -------------- | ---------------------------- |
| **Prisma ORM** | MongoDB schema & queries     |
| **MongoDB**    | NoSQL database               |
| **dotenv**     | Environment variable support |
| **bcrypt**     | Password hashing (if used)   |

---

## 🖧 API & Tools

| Tool/API          | Description            |
| ----------------- | ---------------------- |
| **REST API**      | Next.js API routes     |
| **MongoDB Atlas** | Cloud database         |
| **Vercel**        | Deployment platform    |
| **Postman**       | API testing (optional) |

---

## 💻 Hardware Requirements

For local development or testing, ensure your system meets the following minimum requirements:

| Component    | Minimum Spec             |
| ------------ | ------------------------ |
| **RAM**      | 4 GB (8 GB Recommended)  |
| **CPU**      | Dual-core                |
| **Disk**     | 1–2 GB free space        |
| **Internet** | Required for APIs, Atlas |

> 💡 Cloud deployment does not require these specs — only for local use.

---

## 📚 Getting Started

After setting up the environment, follow the steps in [`HOW_TO_RUN.md`](./HOW_TO_RUN.md) to install dependencies and start the development server.

---
