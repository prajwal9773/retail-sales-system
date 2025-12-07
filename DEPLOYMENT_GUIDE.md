# Deployment Guide

## Current Status

✅ Backend configured for MongoDB Atlas
✅ Connection to Atlas working
⚠️ Data import partially complete (hit free tier storage limit)

## Storage Issue

MongoDB Atlas Free Tier (M0) has a **512 MB storage limit**. Your dataset requires approximately **532 MB**, which exceeds this limit.

### Options:

#### Option 1: Upgrade to Paid Tier (Recommended for Production)
1. Go to MongoDB Atlas Dashboard
2. Click **Upgrade** on your cluster
3. Choose **M2** or **M5** tier (starts at ~$9/month)
4. Complete the import after upgrade

#### Option 2: Use Sample Data (For Testing/Demo)
Import only a subset of data (e.g., first 500,000 records) for testing.

#### Option 3: Optimize Data Storage
- Remove unnecessary fields
- Compress data
- Use data sampling

## Next Steps for Deployment

### 1. Backend Deployment (Vercel, Railway, Render, etc.)

#### Using Vercel:
```bash
cd backend
npm install -g vercel
vercel
# Follow prompts, set environment variables:
# MONGODB_URI=mongodb+srv://...
# PORT=5000 (or let Vercel assign)
```

#### Using Railway:
1. Go to https://railway.app
2. New Project → Deploy from GitHub
3. Select your repository
4. Set environment variables:
   - `MONGODB_URI`
   - `PORT`

#### Using Render:
1. Go to https://render.com
2. New → Web Service
3. Connect GitHub repository
4. Set:
   - Build Command: `npm install`
   - Start Command: `npm start`
   - Environment Variables:
     - `MONGODB_URI`
     - `PORT=5000`

### 2. Frontend Deployment (Vercel, Netlify, etc.)

#### Using Vercel (Recommended):
```bash
cd frontend
npm install -g vercel
vercel
# Follow prompts
```

#### Using Netlify:
1. Go to https://netlify.com
2. New site from Git
3. Connect repository
4. Build settings:
   - Build command: `npm run build`
   - Publish directory: `dist`
5. Add environment variable:
   - `VITE_API_BASE_URL` = your backend URL

### 3. Environment Variables

#### Backend (.env or platform settings):
```
MONGODB_URI=mongodb+srv://prajwalkum03airs:Prajwal9001@cluster0.m5tcg0p.mongodb.net/retail_sales?retryWrites=true&w=majority
PORT=5000
```

#### Frontend (.env or platform settings):
```
VITE_API_BASE_URL=https://your-backend-url.vercel.app/api
```

### 4. Complete Data Import

Once you upgrade Atlas or decide on data strategy:

```bash
cd backend
npm run import-atlas ../truestate_assignment_dataset.csv
```

Or import sample data:
```bash
# Create sample CSV (first 500k rows)
head -n 500001 ../truestate_assignment_dataset.csv > sample_data.csv
npm run import-atlas sample_data.csv
```

### 5. Test Deployment

1. **Backend Health Check**: `https://your-backend-url/api/health`
2. **Frontend**: `https://your-frontend-url`
3. Test search, filters, sorting, pagination

## Security Checklist

- [ ] Remove `0.0.0.0/0` from Atlas IP whitelist
- [ ] Add only your server IPs to Atlas Network Access
- [ ] Use environment variables (never commit .env)
- [ ] Enable HTTPS (automatic with Vercel/Netlify)
- [ ] Use strong database passwords
- [ ] Review CORS settings for production

## Monitoring

- Monitor Atlas cluster performance
- Check application logs
- Monitor API response times
- Track database query performance

## Troubleshooting

### Connection Issues
- Verify IP whitelist in Atlas
- Check environment variables
- Verify connection string format

### Performance Issues
- Check database indexes
- Monitor Atlas cluster metrics
- Optimize queries if needed

### Import Issues
- Check storage quota
- Verify network connectivity
- Review error logs

