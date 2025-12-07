# Quick Deployment Guide

## 🚀 Fast Track Deployment

### 1. Push to GitHub
```bash
cd /Users/prajwalkumar/Assignment
git init
git add .
git commit -m "Ready for deployment"
git remote add origin https://github.com/YOUR_USERNAME/retail-sales-system.git
git push -u origin main
```

### 2. Deploy Backend (Render) - 5 minutes

1. Go to https://dashboard.render.com
2. Click "New +" → "Web Service"
3. Connect GitHub → Select your repo
4. Configure:
   - **Name**: `retail-sales-backend`
   - **Root Directory**: `backend`
   - **Build Command**: `npm install`
   - **Start Command**: `npm start`
5. Add Environment Variables:
   ```
   MONGODB_URI=mongodb+srv://prajwalkum03airs:Prajwal9001@cluster0.m5tcg0p.mongodb.net/retail_sales?retryWrites=true&w=majority
   NODE_ENV=production
   ```
6. Click "Create Web Service"
7. **Copy the URL** (e.g., `https://retail-sales-backend-xxx.onrender.com`)

### 3. Deploy Frontend (Vercel) - 3 minutes

1. Go to https://vercel.com
2. Click "Add New..." → "Project"
3. Import your GitHub repo
4. Configure:
   - **Root Directory**: `frontend`
   - **Framework Preset**: Vite
5. Add Environment Variable:
   ```
   VITE_API_BASE_URL=https://YOUR_RENDER_URL.onrender.com/api
   ```
   (Replace with your actual Render URL from step 2)
6. Click "Deploy"

### 4. Update Backend CORS (if needed)

After frontend is deployed, update backend environment variable:
- In Render dashboard, add:
  ```
  FRONTEND_URL=https://your-frontend.vercel.app
  ```
- Redeploy backend

### ✅ Done!

Your app is live:
- Frontend: `https://your-project.vercel.app`
- Backend: `https://retail-sales-backend-xxx.onrender.com`

## 🔧 Troubleshooting

**Backend not responding?**
- Check Render logs
- Verify MongoDB Atlas IP whitelist includes `0.0.0.0/0` (for testing)

**Frontend can't connect to backend?**
- Verify `VITE_API_BASE_URL` is set correctly
- Check browser console for CORS errors
- Ensure backend URL includes `/api` at the end

**MongoDB connection failed?**
- Verify connection string in Render environment variables
- Check MongoDB Atlas Network Access (whitelist IPs)

## 📝 Important Notes

1. **Render Free Tier**: Services spin down after 15 min inactivity (first request takes ~30s)
2. **Vercel**: No spin-down, instant responses
3. **MongoDB Atlas**: Ensure your IP is whitelisted or use `0.0.0.0/0` for testing

