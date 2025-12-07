# Deployment Checklist

## Pre-Deployment

- [x] Backend configured for production
- [x] Frontend API URL uses environment variable
- [x] CORS configured for production
- [x] Environment variables documented
- [x] Build scripts configured
- [x] Health check endpoint ready
- [x] Error handling implemented
- [x] Rate limiting configured

## GitHub Setup

- [ ] Code pushed to GitHub repository
- [ ] Repository is public (or connected to Vercel/Render accounts)
- [ ] All files committed (except .env files)

## Backend Deployment (Render)

- [ ] Created Render account
- [ ] Connected GitHub account to Render
- [ ] Created new Web Service
- [ ] Set Root Directory: `backend`
- [ ] Set Build Command: `npm install`
- [ ] Set Start Command: `npm start`
- [ ] Added Environment Variables:
  - [ ] `MONGODB_URI` = Your MongoDB Atlas connection string
  - [ ] `NODE_ENV` = `production`
  - [ ] `FRONTEND_URL` = (will add after frontend deployment)
- [ ] Service deployed successfully
- [ ] Health check works: `https://your-backend.onrender.com/api/health`
- [ ] Copied backend URL for frontend configuration

## Frontend Deployment (Vercel)

- [ ] Created Vercel account
- [ ] Connected GitHub account to Vercel
- [ ] Imported project
- [ ] Set Root Directory: `frontend`
- [ ] Set Framework Preset: Vite
- [ ] Added Environment Variable:
  - [ ] `VITE_API_BASE_URL` = `https://your-backend.onrender.com/api`
- [ ] Frontend deployed successfully
- [ ] Frontend URL accessible

## Post-Deployment

- [ ] Updated backend `FRONTEND_URL` environment variable
- [ ] Backend redeployed (if CORS was updated)
- [ ] Tested frontend → backend connection
- [ ] Tested search functionality
- [ ] Tested filters
- [ ] Tested pagination
- [ ] Tested sorting
- [ ] Verified summary cards display data
- [ ] Checked browser console for errors
- [ ] Tested on mobile device (responsive)

## MongoDB Atlas Configuration

- [ ] Network Access: Added `0.0.0.0/0` (or specific Render IPs)
- [ ] Database user has read/write permissions
- [ ] Connection string is correct
- [ ] Data imported successfully

## Final Verification

- [ ] Frontend loads without errors
- [ ] API calls are successful (check Network tab)
- [ ] No CORS errors
- [ ] Data displays correctly
- [ ] All features working
- [ ] Performance is acceptable

## URLs to Save

- Frontend URL: `https://________________.vercel.app`
- Backend URL: `https://________________.onrender.com`
- MongoDB Atlas: `mongodb+srv://...`

## Notes

- Render free tier: Services spin down after 15 min inactivity
- First request after spin-down takes ~30 seconds
- Consider upgrading to paid tier for production use

