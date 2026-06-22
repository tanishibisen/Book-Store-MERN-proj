# BookSwap - MERN Stack Application

A full-stack Book Exchange platform built using MongoDB, Express.js, React.js (Vite), and Node.js. 
Features include real-time geolocation-based book matching, debounced searches, user authentication, and a complete trade request lifecycle.

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

### 3. Open the App

Simply open your web browser and navigate to the frontend URL provided in your terminal:
👉 **http://localhost:5173/**

---

## ⚙️ Environment Variables

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

## 🛠️ Tech Stack
- **Frontend**: React 19, Redux Toolkit, React Router DOM, Vite, Tailwind CSS v4.
- **Backend**: Node.js, Express.js, Mongoose, JWT Auth, bcryptjs.
- **Database**: MongoDB Atlas (with `2dsphere` indexes for Geospatial queries).

---

## 🌍 How to Deploy to Production

Deploying a MERN stack application involves hosting the **Frontend** and **Backend** separately. Here is the recommended, free approach:

### Step 1: Deploy the Backend (e.g., to Render or Railway)
1. Push your code to a GitHub repository.
2. Sign up for [Render.com](https://render.com) and create a new **Web Service**.
3. Connect your GitHub repository and select the `backend` folder as your Root Directory.
4. Set the Build Command to `npm install` and the Start Command to `node server.js`.
5. Under **Environment Variables**, add:
   - `MONGODB_URI` = (Your MongoDB Atlas connection string)
   - `JWT_SECRET` = (Your secure random string)
6. Deploy! Render will give you a live URL like `https://bookswap-api.onrender.com`.

### Step 2: Prepare the Frontend
Before deploying the frontend, you must update its environment variable so it knows how to talk to your live backend.
1. Open `frontend/.env` (or create production environment variables wherever you host).
2. Change the API URL to point to your new backend URL:
   ```env
   VITE_API_URL=https://bookswap-api.onrender.com/api
   ```

### Step 3: Deploy the Frontend (e.g., to Vercel or Netlify)
1. Sign up for [Vercel.com](https://vercel.com) and click **Add New Project**.
2. Connect your GitHub repository and select the `frontend` folder as your Root Directory.
3. Vercel will automatically detect that you are using Vite. 
4. Under **Environment Variables**, add `VITE_API_URL` and set its value to your backend URL.
5. Click **Deploy**. Vercel will run `npm run build` and publish your app globally!
