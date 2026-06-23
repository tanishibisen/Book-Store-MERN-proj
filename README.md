# BookSwap - MERN Stack Application

A full-stack Book Exchange platform built using MongoDB, Express.js, React.js (Vite), and Node.js. 
Features include real-time geolocation-based book matching, debounced searches, user authentication, and a complete trade request lifecycle.

🌐 **Live Demo:** [https://book-store-mern-proj.vercel.app/](https://book-store-mern-proj.vercel.app/)

---

## 🛠️ Tech Stack
- **Frontend**: React 19, Redux Toolkit, React Router DOM, Vite, Tailwind CSS v4.
- **Backend**: Node.js, Express.js, Mongoose, JWT Auth, bcryptjs.
- **Database**: MongoDB Atlas (with `2dsphere` indexes for Geospatial queries).

---

## 🚀 How to Run the Project Locally

To run this application on your local machine, you will need to start both the **Backend API Server** and the **Frontend React Server** simultaneously. 

### 1. Start the Backend Server

Open a terminal or command prompt, navigate to the `backend` folder, and start the development server:

```bash
cd backend
npm run dev
```

*This will start the Node.js API on `http://localhost:5000` using `nodemon` (which auto-restarts when you make code changes).*

### 2. Start the Frontend Server

Open a **second** separate terminal window, navigate to the `frontend` folder, and start the Vite development server:

```bash
cd frontend
npm run dev
```

*This will start the React interface. Vite will give you a local URL (usually `http://localhost:5173/`).*

### 3. Environment Variables

If you clone this project to a new machine, make sure you configure your `.env` files:

**`backend/.env`**
```env
PORT=5000
MONGODB_URI=mongodb+srv://<username>:<password>@your-cluster.mongodb.net/bookswap?retryWrites=true&w=majority
JWT_SECRET=your_super_secret_jwt_key_here
```

**`frontend/.env`**
```env
VITE_API_URL=http://localhost:5000/api
```
