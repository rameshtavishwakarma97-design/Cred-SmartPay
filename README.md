# CRED Smart Pay

CRED Smart Pay is an intelligent payment optimization engine that helps users find the best card for every transaction, maximizing rewards and savings using a smart recommendation engine.

## 🚀 Quick Start

### 1. Prerequisite
- Node.js (v20 or higher)

### 2. Installation
```bash
npm install
```

### 3. Build & Start
```bash
# Build the frontend
npm run build

# Start the backend server
npm run server
```

The application will be available at [http://localhost:3005](http://localhost:3005).

## 🔑 Demo Credentials

For testing and evaluation, the following accounts are pre-seeded in the database:

| Role | Email | Password |
|------|-------|----------|
| **Test User** | `test@example.com` | `password123` |
| **Admin User** | `admin@cred.club` | `admin123` |

You can use the **Demo Credentials** buttons on the login screen to automatically log in.

## ✨ Key Features

- **Smart Recommendation Engine**: Dynamically calculates the best card for any merchant/category.
- **Card Wallet**: Manage your credit and debit cards securely.
- **Transaction History**: Track your spends and total savings.
- **Admin Dashboard**: Visualize analytics, funnel metrics, and recommendation accuracy.
- **neoPOP Design**: A custom, premium UI inspired by the CRED design system.

## 🛠️ Technology Stack

- **Frontend**: Vanilla JS, Vite, neoPOP (Custom CSS)
- **Backend**: Express, Node.js
- **Database**: SQLite (better-sqlite3)
- **Deployment**: Configured for Railway (via `nixpacks.toml`)

---
Built with conviction for the Digital Product Management track.
