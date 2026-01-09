# MiCloset

A React + Vite frontend application with an Express backend for managing a digital wardrobe/closet.

## Prerequisites

- Node.js (v14 or higher)
- MongoDB (local or cloud instance)
- npm or yarn

## Setup

### 1. Install Frontend Dependencies

```bash
npm install
```

### 2. Install Backend Dependencies

```bash
cd backend
npm install
cd ..
```

### 3. Environment Variables

Create a `.env` file in the root directory (`micloset/`) with your MongoDB connection string:

```
MONGODB_URI=mongodb://localhost:27017/micloset
```

Or if using MongoDB Atlas:

```
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/micloset
```

## Running the Application

You need to run both the frontend and backend servers:

### Terminal 1 - Backend Server

```bash
cd backend
npm run dev
```

The backend will run on `http://localhost:4173`

### Terminal 2 - Frontend Development Server

```bash
npm run dev
```

The frontend will typically run on `http://localhost:5173` (Vite's default port)

Open your browser and navigate to the frontend URL (usually `http://localhost:5173`)

## Available Scripts

### Frontend

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint

### Backend
- `npm run dev` - Start development server with nodemon (auto-reload)
