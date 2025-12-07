# Deployment Steps - Vercel (Frontend) & Render (Backend)

## Prerequisites
- GitHub account
- Vercel account (sign up at https://vercel.com)
- Render account (sign up at https://render.com)
- MongoDB Atlas connection string ready

## Step 1: Push Code to GitHub

1. Initialize git repository (if not already done):
```bash
cd /Users/prajwalkumar/Assignment
git init
git add .
git commit -m "Initial commit - Retail Sales Management System"
```

2. Create a new repository on GitHub:
   - Go to https://github.com/new
   - Create a new repository (e.g., `retail-sales-system`)
   - **DO NOT** initialize with README, .gitignore, or license

3. Push code to GitHub:
```bash
git remote add origin https://github.com/YOUR_USERNAME/retail-sales-system.git
git branch -M main
git push -u origin main
```

## Step 2: Deploy Backend to Render

### Option A: Using Render Dashboard

1. **Go to Render Dashboard**
   - Visit https://dashboard.render.com
   - Sign up or log in

2. **Create New Web Service**
   - Click "New +" → "Web Service"
   - Connect your GitHub account if not already connected
   - Select your repository: `retail-sales-system`

3. **Configure Service**
   - **Name**: `retail-sales-backend`
   - **Root Directory**: `backend`
   - **Environment**: `Node`
   - **Build Command**: `npm install`
   - **Start Command**: `npm start`
   - **Plan**: Free (or choose paid for better performance)

4. **Set Environment Variables**
   Click "Advanced" → "Add Environment Variable":
   - `NODE_ENV` = `production`
   - `MONGODB_URI` = `mongodb+srv://prajwalkum03airs:Prajwal9001@cluster0.m5tcg0p.mongodb.net/retail_sales?retryWrites=true&w=majority`
   - `PORT` = `10000` (Render automatically assigns port, but this is a fallback)

5. **Deploy**
   - Click "Create Web Service"
   - Wait for deployment to complete (5-10 minutes)
   - Note the service URL (e.g., `https://retail-sales-backend.onrender.com`)

### Option B: Using render.yaml (Recommended)

1. The `render.yaml` file is already created in the backend directory
2. In Render dashboard:
   - Go to "New +" → "Blueprint"
   - Connect your GitHub repository
   - Render will automatically detect `render.yaml`
   - Review and deploy

## Step 3: Deploy Frontend to Vercel

### Option A: Using Vercel Dashboard

1. **Go to Vercel Dashboard**
   - Visit https://vercel.com
   - Sign up or log in with GitHub

2. **Import Project**
   - Click "Add New..." → "Project"
   - Import your GitHub repository: `retail-sales-system`

3. **Configure Project**
   - **Framework Preset**: Vite
   - **Root Directory**: `frontend`
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`
   - **Install Command**: `npm install`

4. **Set Environment Variables**
   Click "Environment Variables" and add:
   - `VITE_API_BASE_URL` = `https://YOUR_RENDER_BACKEND_URL.onrender.com/api`
     (Replace with your actual Render backend URL from Step 2)

5. **Deploy**
   - Click "Deploy"
   - Wait for deployment (2-3 minutes)
   - Your app will be live at `https://your-project.vercel.app`

### Option B: Using Vercel CLI

1. **Install Vercel CLI**:
```bash
npm install -g vercel
```

2. **Login to Vercel**:
```bash
vercel login
```

3. **Deploy Frontend**:
```bash
cd frontend
vercel
```

4. **Set Environment Variable**:
```bash
vercel env add VITE_API_BASE_URL
# Enter: https://YOUR_RENDER_BACKEND_URL.onrender.com/api
```

5. **Redeploy**:
```bash
vercel --prod
```

## Step 4: Update CORS in Backend (if needed)

The backend should already have CORS enabled, but verify in `backend/src/index.js`:
```javascript
app.use(cors()); // This allows all origins
```

For production, you might want to restrict CORS:
```javascript
app.use(cors({
  origin: ['https://your-frontend.vercel.app', 'http://localhost:3000'],
  credentials: true
}));
```

## Step 5: Verify Deployment

1. **Test Backend**:
   - Visit: `https://YOUR_BACKEND_URL.onrender.com/api/health`
   - Should return: `{"status":"OK","message":"Server is running"}`

2. **Test Frontend**:
   - Visit your Vercel URL
   - Check browser console for any errors
   - Test search, filters, pagination

3. **Test API Connection**:
   - Open browser DevTools → Network tab
   - Check if API calls are going to Render backend
   - Verify responses are successful

## Troubleshooting

### Backend Issues

1. **Build Fails**:
   - Check Render logs
   - Verify `package.json` has correct scripts
   - Ensure all dependencies are listed

2. **MongoDB Connection Error**:
   - Verify MongoDB Atlas IP whitelist includes Render IPs
   - Check connection string is correct
   - Ensure database user has proper permissions

3. **Service Crashes**:
   - Check Render logs for error messages
   - Verify environment variables are set correctly
   - Check MongoDB connection

### Frontend Issues

1. **API Calls Failing**:
   - Verify `VITE_API_BASE_URL` environment variable is set
   - Check CORS settings in backend
   - Verify backend URL is correct

2. **Build Errors**:
   - Check Vercel build logs
   - Ensure all dependencies are in `package.json`
   - Verify Node.js version compatibility

3. **404 Errors**:
   - Verify `vercel.json` rewrite rules are correct
   - Check that `dist` folder is being generated

## Environment Variables Summary

### Backend (Render)
- `NODE_ENV` = `production`
- `MONGODB_URI` = Your MongoDB Atlas connection string
- `PORT` = `10000` (optional, Render auto-assigns)

### Frontend (Vercel)
- `VITE_API_BASE_URL` = `https://YOUR_BACKEND_URL.onrender.com/api`

## Post-Deployment Checklist

- [ ] Backend health check works
- [ ] Frontend loads without errors
- [ ] API calls are successful
- [ ] Search functionality works
- [ ] Filters work correctly
- [ ] Pagination works
- [ ] Sorting works
- [ ] Summary cards display data
- [ ] No CORS errors in browser console
- [ ] MongoDB connection is stable

## Free Tier Limitations

### Render (Free Tier)
- Services spin down after 15 minutes of inactivity
- First request after spin-down takes ~30 seconds
- 750 hours/month free
- Limited to 1 web service

### Vercel (Free Tier)
- Unlimited deployments
- 100GB bandwidth/month
- Automatic HTTPS
- No spin-down issues

## Upgrading to Paid Tiers

If you need:
- **No spin-down** (Render): Upgrade to Starter plan ($7/month)
- **Better performance**: Consider paid tiers
- **Custom domains**: Available on both platforms

## Support

- Render Docs: https://render.com/docs
- Vercel Docs: https://vercel.com/docs
- Check deployment logs for specific errors

