# MongoDB Atlas Authentication Fix for Render

## Problem
`Error: bad auth : authentication failed` when deploying to Render

## Solutions

### Solution 1: Verify MongoDB Atlas Connection String

1. **Go to MongoDB Atlas Dashboard**
   - Visit https://cloud.mongodb.com
   - Log in to your account

2. **Get the Correct Connection String**
   - Click "Database" → Select your cluster
   - Click "Connect" → "Connect your application"
   - Copy the connection string
   - It should look like:
     ```
     mongodb+srv://<username>:<password>@cluster0.xxxxx.mongodb.net/?retryWrites=true&w=majority
     ```

3. **Update Connection String**
   - Replace `<username>` with your actual username
   - Replace `<password>` with your actual password (URL-encoded if it has special characters)
   - Add database name: `/retail_sales` before the `?`
   - Final format:
     ```
     mongodb+srv://username:password@cluster0.xxxxx.mongodb.net/retail_sales?retryWrites=true&w=majority
     ```

4. **Update in Render**
   - Go to Render Dashboard → Your Service → Environment
   - Update `MONGODB_URI` with the corrected connection string
   - Click "Save Changes"
   - Service will auto-redeploy

### Solution 2: Check MongoDB Atlas Network Access

1. **Go to Network Access**
   - In MongoDB Atlas Dashboard → "Network Access"

2. **Add IP Address**
   - Click "Add IP Address"
   - For Render deployment, add: `0.0.0.0/0` (allows from anywhere)
   - **Note**: For production, you should restrict this, but for now this will work
   - Click "Confirm"

3. **Wait 1-2 minutes** for changes to propagate

### Solution 3: Verify Database User Credentials

1. **Go to Database Access**
   - In MongoDB Atlas Dashboard → "Database Access"

2. **Check Your User**
   - Find your database user (e.g., `prajwalkum03airs`)
   - Click "Edit" to verify:
     - Username is correct
     - Password is correct
     - User has "Read and write to any database" permissions

3. **Reset Password (if needed)**
   - Click "Edit" on your user
   - Click "Edit Password"
   - Set a new password
   - **Important**: Update the connection string in Render with the new password

### Solution 4: URL Encode Special Characters in Password

If your password has special characters, they need to be URL-encoded:

- `@` → `%40`
- `#` → `%23`
- `$` → `%24`
- `%` → `%25`
- `&` → `%26`
- `+` → `%2B`
- `=` → `%3D`
- `?` → `%3F`
- `/` → `%2F`
- ` ` (space) → `%20`

Example:
- Password: `Prajwal@9001`
- URL-encoded: `Prajwal%409001`
- Connection string: `mongodb+srv://username:Prajwal%409001@cluster0.xxxxx.mongodb.net/retail_sales?retryWrites=true&w=majority`

### Solution 5: Test Connection String Locally

Test the connection string before deploying:

```bash
cd backend
node -e "import('mongoose').then(m => m.default.connect('YOUR_CONNECTION_STRING').then(() => { console.log('✅ Connected!'); process.exit(0); }).catch(e => { console.error('❌ Error:', e.message); process.exit(1); }))"
```

Replace `YOUR_CONNECTION_STRING` with your actual connection string.

## Quick Fix Checklist

- [ ] Connection string includes database name: `/retail_sales`
- [ ] Username and password are correct (no extra spaces)
- [ ] Password is URL-encoded if it has special characters
- [ ] Network Access allows `0.0.0.0/0` or Render IPs
- [ ] Database user has "Read and write" permissions
- [ ] Connection string format is correct

## Correct Connection String Format

```
mongodb+srv://USERNAME:PASSWORD@cluster0.xxxxx.mongodb.net/retail_sales?retryWrites=true&w=majority
```

Where:
- `USERNAME` = Your MongoDB Atlas username
- `PASSWORD` = Your MongoDB Atlas password (URL-encoded if needed)
- `cluster0.xxxxx.mongodb.net` = Your cluster address
- `retail_sales` = Database name
- Query parameters are optional but recommended

## After Fixing

1. Update `MONGODB_URI` in Render environment variables
2. Render will automatically redeploy
3. Check Render logs to verify connection
4. Test health endpoint: `https://your-backend.onrender.com/api/health`

## Still Having Issues?

1. **Check Render Logs**: Look for more detailed error messages
2. **Test Locally**: Try connecting with the same connection string locally
3. **Create New Database User**: Sometimes creating a fresh user helps
4. **Check MongoDB Atlas Status**: Ensure your cluster is running

