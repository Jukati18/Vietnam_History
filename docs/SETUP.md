# Setup Guide

Complete installation and setup instructions for the Vietnamese History Interactive Platform.

## Table of Contents

1. [Prerequisites](#prerequisites)
2. [Installation](#installation)
3. [MongoDB Atlas Setup](#mongodb-atlas-setup)
4. [Environment Configuration](#environment-configuration)
5. [Database Import](#database-import)
6. [Running the Application](#running-the-application)
7. [Development Setup](#development-setup)
8. [Deployment](#deployment)
9. [Troubleshooting](#troubleshooting)

---

## Prerequisites

Before you begin, ensure you have the following installed:

### Required Software

- **Node.js** (v14.0.0 or higher)
  - Download: https://nodejs.org/
  - Verify installation: `node --version`

- **npm** (v6.0.0 or higher)
  - Comes with Node.js
  - Verify installation: `npm --version`

- **Git** (optional, for cloning repository)
  - Download: https://git-scm.com/
  - Verify installation: `git --version`

### Required Accounts

- **MongoDB Atlas** (free tier available)
  - Sign up: https://www.mongodb.com/cloud/atlas
  - Free tier includes 512MB storage

### Recommended Tools

- **VS Code** - Code editor
- **MongoDB Compass** - GUI for MongoDB (optional)
- **Postman** - API testing (optional)

---

## Installation

### Option 1: Clone with Git

```bash
# Clone the repository
git clone https://github.com/yourusername/Vietnam_History.git

# Navigate to project directory
cd Vietnam_History
```

### Option 2: Download ZIP

1. Download ZIP file from GitHub
2. Extract to your desired location
3. Open terminal/command prompt in extracted folder

### Install Dependencies

```bash
# Install all required npm packages
npm install
```

This will install:
- `express` - Web framework
- `mongodb` - MongoDB driver
- `cors` - Cross-origin resource sharing
- `dotenv` - Environment variable management

**Expected Output:**
```
added 50 packages in 5s
```

---

## MongoDB Atlas Setup

### Step 1: Create Account

1. Go to https://www.mongodb.com/cloud/atlas
2. Click **"Try Free"**
3. Sign up with email or Google account
4. Verify your email

### Step 2: Create Cluster

1. **Select Plan:**
   - Choose **"Shared"** (Free tier)
   - Click **"Create"**

2. **Configure Cluster:**
   - **Cloud Provider:** Choose any (AWS recommended)
   - **Region:** Choose closest to you
   - **Cluster Tier:** M0 Sandbox (Free)
   - **Cluster Name:** `vietnamese-history` (or your choice)

3. Click **"Create Cluster"**
   - Wait 3-5 minutes for cluster to deploy

### Step 3: Configure Database Access

1. Click **"Database Access"** in left sidebar
2. Click **"Add New Database User"**
3. **Authentication Method:** Password
4. **Username:** `historyAdmin` (or your choice)
5. **Password:** Generate secure password and **SAVE IT**
6. **Database User Privileges:** Read and write to any database
7. Click **"Add User"**

### Step 4: Configure Network Access

1. Click **"Network Access"** in left sidebar
2. Click **"Add IP Address"**
3. Choose one:
   - **Allow Access from Anywhere:** Click this button
     - IP: `0.0.0.0/0` (for development only)
   - **Add Current IP Address:** For production
4. Click **"Confirm"**

### Step 5: Get Connection String

1. Go to **"Database"** (Clusters)
2. Click **"Connect"** on your cluster
3. Select **"Connect your application"**
4. **Driver:** Node.js
5. **Version:** 4.1 or later
6. Copy the connection string:
   ```
   mongodb+srv://<username>:<password>@cluster0.xxxxx.mongodb.net/?retryWrites=true&w=majority
   ```
7. **Save this string** - you'll need it next

---

## Environment Configuration

### Create .env File

In your project root directory, create a file named `.env`:

```bash
# On macOS/Linux
touch .env

# On Windows
type nul > .env
```

### Configure Environment Variables

Open `.env` in a text editor and add:

```env
# MongoDB Atlas Connection
MONGODB_URI=mongodb+srv://historyAdmin:YOUR_PASSWORD@cluster0.xxxxx.mongodb.net/vietnamese_history?retryWrites=true&w=majority

# Server Configuration
PORT=3000

# Node Environment
NODE_ENV=development
```

**Replace:**
- `YOUR_PASSWORD` with your database user password
- `cluster0.xxxxx` with your actual cluster address
- Database name: `vietnamese_history`

### Verify Configuration

Your `.env` file should look like:

```env
MONGODB_URI=mongodb+srv://historyAdmin:SecurePass123@cluster0.abc12.mongodb.net/vietnamese_history?retryWrites=true&w=majority
PORT=3000
NODE_ENV=development
```

**⚠️ Security Note:** Never commit `.env` to Git. It's already in `.gitignore`.

---

## Database Import

### Understanding Collections

The database has three main collections:
1. **periods** - Historical periods
2. **subPeriods** - Sub-periods within periods
3. **events** - Historical events

### Option 1: Import via MongoDB Compass

1. **Download MongoDB Compass:**
   - https://www.mongodb.com/products/compass

2. **Connect to Atlas:**
   - Open Compass
   - Paste your connection string
   - Click "Connect"

3. **Create Database:**
   - Click "Create Database"
   - Database name: `vietnamese_history`
   - Collection name: `periods`

4. **Import Data:**
   - Select `vietnamese_history` database
   - For each collection (periods, subPeriods, events):
     - Click "ADD DATA" → "Import File"
     - Select your JSON file
     - Click "Import"

### Option 2: Import via mongoimport CLI

If you have `mongoimport` installed:

```bash
# Import periods
mongoimport --uri "YOUR_CONNECTION_STRING" --collection periods --file data/periods.json --jsonArray

# Import sub-periods
mongoimport --uri "YOUR_CONNECTION_STRING" --collection subPeriods --file data/subPeriods.json --jsonArray

# Import events
mongoimport --uri "YOUR_CONNECTION_STRING" --collection events --file data/events.json --jsonArray
```

### Option 3: Create Sample Data

If you don't have data files, create minimal test data:

1. Start the server (see next section)
2. Use API to create data:

```javascript
// Use Postman or curl to POST to /api/events
// Example creates a test event
```

### Verify Import

Start the server and visit:
```
http://localhost:3000/api/health
```

Should show: `"database": "Connected"`

Check stats:
```
http://localhost:3000/api/stats
```

Should show counts > 0

---

## Running the Application

### Start the Server

```bash
# Start with Node
node server.js
```

**Expected Output:**
```
🔄 Connecting to MongoDB Atlas...
✅ Connected to MongoDB Atlas
📊 Database statistics:
   - Periods: 7
   - Sub-periods: 25
   - Events: 150

🚀 Server running on http://localhost:3000
📍 API available at http://localhost:3000/api
```

### Verify Server is Running

Open browser and visit:

1. **Homepage:**
   ```
   http://localhost:3000
   ```

2. **Health Check:**
   ```
   http://localhost:3000/api/health
   ```

3. **API Stats:**
   ```
   http://localhost:3000/api/stats
   ```

### Access the Application

Navigate to different pages:
- **Homepage:** `http://localhost:3000/index.html`
- **Map:** `http://localhost:3000/map.html`
- **Timeline:** `http://localhost:3000/timeline.html`
- **Events:** `http://localhost:3000/events.html`
- **About:** `http://localhost:3000/about.html`

---

## Development Setup

### Install Development Tools

```bash
# Install nodemon for auto-restart (optional)
npm install -g nodemon
```

### Run with Auto-Restart

```bash
# Using nodemon
nodemon server.js
```

This automatically restarts the server when you save changes.

### Development Workflow

1. **Edit files** in your code editor
2. **Save changes**
3. **Refresh browser** to see updates
   - Frontend changes: Just refresh
   - Backend changes: Server auto-restarts (with nodemon)

### Browser Developer Tools

Press `F12` to open developer tools:
- **Console:** View errors and logs
- **Network:** Monitor API requests
- **Elements:** Inspect HTML/CSS

### Testing API Endpoints

Use browser or Postman to test:

```bash
# Get all periods
curl http://localhost:3000/api/periods

# Get all events
curl http://localhost:3000/api/events

# Search events
curl "http://localhost:3000/api/events/search?q=battle"
```

---

## Deployment

### Prerequisites for Deployment

- Server or hosting service (Heroku, DigitalOcean, AWS, etc.)
- MongoDB Atlas (already set up)
- Domain name (optional)

### Deploy to Heroku

1. **Install Heroku CLI:**
   ```bash
   npm install -g heroku
   ```

2. **Login to Heroku:**
   ```bash
   heroku login
   ```

3. **Create Heroku App:**
   ```bash
   heroku create vietnamese-history-app
   ```

4. **Set Environment Variables:**
   ```bash
   heroku config:set MONGODB_URI="your_connection_string"
   heroku config:set NODE_ENV=production
   ```

5. **Deploy:**
   ```bash
   git add .
   git commit -m "Deploy to Heroku"
   git push heroku main
   ```

6. **Open App:**
   ```bash
   heroku open
   ```

### Deploy to DigitalOcean

1. **Create Droplet** (Ubuntu 20.04)
2. **SSH into server:**
   ```bash
   ssh root@your_server_ip
   ```

3. **Install Node.js:**
   ```bash
   curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
   sudo apt-get install -y nodejs
   ```

4. **Clone repository:**
   ```bash
   git clone https://github.com/yourusername/Vietnam_History.git
   cd Vietnam_History
   npm install
   ```

5. **Set up environment:**
   ```bash
   nano .env
   # Add your configuration
   ```

6. **Install PM2:**
   ```bash
   npm install -g pm2
   pm2 start server.js
   pm2 startup
   pm2 save
   ```

7. **Set up Nginx (optional):**
   ```bash
   sudo apt install nginx
   # Configure as reverse proxy
   ```

### Environment Variables for Production

Update `.env` for production:

```env
MONGODB_URI=your_production_connection_string
PORT=3000
NODE_ENV=production
```

### Security Considerations

1. **MongoDB Access:**
   - Restrict IP addresses in Atlas Network Access
   - Use strong passwords
   - Don't allow 0.0.0.0/0 in production

2. **Environment Variables:**
   - Never commit `.env` to Git
   - Use hosting platform's environment variable system

3. **CORS:**
   - Configure CORS for specific origins in production
   - Don't allow all origins (*)

4. **HTTPS:**
   - Use SSL certificate (Let's Encrypt is free)
   - Force HTTPS redirect

---

## Troubleshooting

### Server Won't Start

**Problem:** `Error: Cannot find module 'express'`
```bash
# Solution: Install dependencies
npm install
```

**Problem:** `MongoServerError: bad auth`
```bash
# Solution: Check MongoDB credentials
# Verify username/password in .env
# Make sure user has correct permissions in Atlas
```

**Problem:** `EADDRINUSE: address already in use`
```bash
# Solution: Port 3000 is in use
# Kill existing process:
# macOS/Linux:
lsof -ti:3000 | xargs kill -9
# Windows:
netstat -ano | findstr :3000
taskkill /PID <PID> /F

# Or use different port in .env:
PORT=3001
```

### MongoDB Connection Issues

**Problem:** `MongoNetworkError: failed to connect`

**Solutions:**
1. Check internet connection
2. Verify connection string is correct
3. Check Network Access in Atlas (IP whitelist)
4. Try pinging MongoDB:
   ```bash
   ping cluster0.xxxxx.mongodb.net
   ```

**Problem:** `Database is empty`

**Solutions:**
1. Verify data was imported correctly
2. Check correct database name in connection string
3. Import data using MongoDB Compass or mongoimport

### Frontend Issues

**Problem:** Events not loading on map/timeline

**Solutions:**
1. Open browser console (F12)
2. Check for API errors
3. Verify server is running
4. Test API directly:
   ```
   http://localhost:3000/api/events
   ```

**Problem:** Search not working

**Solutions:**
1. Check browser console for errors
2. Verify events exist in database
3. Make sure server is running
4. Test search API:
   ```
   http://localhost:3000/api/events/search?q=test
   ```

### Performance Issues

**Problem:** Slow loading

**Solutions:**
1. Check MongoDB Atlas cluster region
2. Optimize queries (add indexes)
3. Reduce number of events displayed
4. Use pagination (future enhancement)

### Common Error Messages

**Error:** `CORS policy: No 'Access-Control-Allow-Origin' header`
```bash
# Solution: Check CORS is enabled in server.js
# Should have: app.use(cors());
```

**Error:** `Cannot GET /api/events`
```bash
# Solution: Check server.js routes are defined
# Verify Express is set up correctly
```

**Error:** `404 Not Found`
```bash
# Solution: Check file paths
# Verify HTML files are in correct location
# Check server is serving static files
```

### Getting Help

If issues persist:

1. **Check logs:**
   - Server console output
   - Browser console (F12)

2. **Verify setup:**
   - Node.js version: `node --version`
   - MongoDB connection: Test in Compass
   - Environment variables: Check `.env`

3. **Search for similar issues:**
   - Check GitHub issues
   - Search Stack Overflow

4. **Ask for help:**
   - Create GitHub issue
   - Include error messages
   - Describe what you tried

---

## Next Steps

After successful setup:

1. ✅ Verify all pages load correctly
2. ✅ Test map functionality
3. ✅ Test timeline visualization
4. ✅ Test search feature
5. ✅ Import your historical data
6. ✅ Customize colors and styling
7. ✅ Add your own events
8. ✅ Deploy to production

---

## Additional Resources

### Documentation
- [API Documentation](API.md)
- [User Guide](USER_GUIDE.md)
- [Database Schema](DATABASE_SCHEMA.md)

### External Resources
- [Node.js Documentation](https://nodejs.org/docs/)
- [Express.js Guide](https://expressjs.com/en/guide/routing.html)
- [MongoDB Atlas Docs](https://www.mongodb.com/docs/atlas/)
- [Leaflet.js Documentation](https://leafletjs.com/reference.html)
- [Vis.js Timeline](https://visjs.github.io/vis-timeline/docs/timeline/)

### Community
- GitHub Repository: [Link to repo]
- Issues: [Link to issues]
- Discussions: [Link to discussions]

---

**Setup complete! Start exploring Vietnamese history! 🇻🇳**