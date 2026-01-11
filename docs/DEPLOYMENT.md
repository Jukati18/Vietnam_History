# Deployment Guide

Complete guide for deploying the Vietnamese History platform to production using Vercel (frontend), Render (backend), and MongoDB Atlas (database).

## 📋 Table of Contents

1. [Architecture Overview](#architecture-overview)
2. [Prerequisites](#prerequisites)
3. [MongoDB Atlas Setup](#mongodb-atlas-setup)
4. [Backend Deployment (Render)](#backend-deployment-render)
5. [Frontend Deployment (Vercel)](#frontend-deployment-vercel)
6. [Configuration](#configuration)
7. [Testing Deployment](#testing-deployment)
8. [Monitoring & Maintenance](#monitoring--maintenance)
9. [Troubleshooting](#troubleshooting)
10. [Rollback Procedures](#rollback-procedures)

---

## Architecture Overview

### Current Production Stack

```
┌─────────────────────────────────────────────────────────┐
│                        USERS                             │
└────────────────────┬────────────────────────────────────┘
                     │
                     ▼
        ┌────────────────────────────┐
        │   Vercel (Frontend)        │
        │   Static Site Hosting      │
        │   vietnam-history-sage     │
        │   .vercel.app              │
        └────────────┬───────────────┘
                     │
                     │ API Requests
                     ▼
        ┌────────────────────────────┐
        │   Render (Backend API)     │
        │   Node.js + Express        │
        │   vietnamese-history-api   │
        │   -dvwf.onrender.com       │
        └────────────┬───────────────┘
                     │
                     │ Database Queries
                     ▼
        ┌────────────────────────────┐
        │   MongoDB Atlas            │
        │   Cloud Database (M0)      │
        │   vietnamese_history DB    │
        └────────────────────────────┘
```

### Services

| Service | Platform | Purpose | URL |
|---------|----------|---------|-----|
| Frontend | Vercel | Static site hosting | https://vietnam-history-sage.vercel.app |
| Backend API | Render | REST API server | https://vietnamese-history-api-dvwf.onrender.com |
| Database | MongoDB Atlas | Cloud database | M0 Sandbox (Free Tier) |

---

## Prerequisites

Before deploying, you need:

### Accounts
- ✅ **GitHub Account** (for repository hosting)
- ✅ **Vercel Account** (sign up at https://vercel.com)
- ✅ **Render Account** (sign up at https://render.com)
- ✅ **MongoDB Atlas Account** (sign up at https://mongodb.com/cloud/atlas)

### Local Setup
- ✅ **Git** installed
- ✅ **Node.js** v14+ installed
- ✅ Code pushed to GitHub repository

---

## MongoDB Atlas Setup

### Step 1: Create Cluster

1. Log in to MongoDB Atlas: https://cloud.mongodb.com
2. Click **"Create"** to create a new project
3. Name your project: `Vietnamese History`
4. Click **"Build a Database"**
5. Choose **"M0 FREE"** tier
6. Select a cloud provider and region (closest to your users)
7. Cluster name: `Cluster0` (or custom name)
8. Click **"Create Cluster"**

⏱️ Wait 3-5 minutes for cluster to provision

### Step 2: Configure Database Access

1. In left sidebar, click **"Database Access"**
2. Click **"Add New Database User"**
3. **Authentication Method**: Password
4. **Username**: `historyAdmin` (or your choice)
5. **Password**: Generate a secure password
   - **⚠️ IMPORTANT**: Save this password securely!
6. **Database User Privileges**: 
   - Select **"Read and write to any database"**
7. Click **"Add User"**

### Step 3: Configure Network Access

1. In left sidebar, click **"Network Access"**
2. Click **"Add IP Address"**
3. Click **"Allow Access from Anywhere"**
   - IP Address: `0.0.0.0/0`
   - ⚠️ Note: In production, restrict to Render's IP ranges
4. Click **"Confirm"**

### Step 4: Get Connection String

1. Click **"Database"** in left sidebar
2. Click **"Connect"** button on your cluster
3. Select **"Connect your application"**
4. **Driver**: Node.js
5. **Version**: 4.1 or later
6. Copy the connection string:
   ```
   mongodb+srv://<username>:<password>@cluster0.xxxxx.mongodb.net/?retryWrites=true&w=majority
   ```
7. Replace `<username>` and `<password>` with your credentials
8. Add database name: `vietnamese_history`

**Final connection string format:**
```
mongodb+srv://historyAdmin:YourPassword@cluster0.xxxxx.mongodb.net/vietnamese_history?retryWrites=true&w=majority
```

### Step 5: Import Data

Use MongoDB Compass or `mongoimport` to import your collections:
- `periods`
- `subPeriods`
- `events`

**Verify data import:**
- Go to **"Browse Collections"** in Atlas
- Check that all collections have data

---

## Backend Deployment (Render)

### Step 1: Create Web Service

1. Log in to Render: https://dashboard.render.com
2. Click **"New +"** → **"Web Service"**
3. Connect your GitHub repository
4. **Name**: `vietnamese-history-api`
5. **Region**: Choose closest to your users
6. **Branch**: `main` (or your default branch)
7. **Root Directory**: Leave empty (or `.` if needed)
8. **Runtime**: `Node`
9. **Build Command**: `npm install`
10. **Start Command**: `node server.js`
11. **Plan**: `Free`

### Step 2: Configure Environment Variables

In the **Environment** section, add:

| Key | Value |
|-----|-------|
| `NODE_ENV` | `production` |
| `PORT` | `10000` |
| `MONGODB_URI` | Your MongoDB Atlas connection string |

**Example:**
```env
NODE_ENV=production
PORT=10000
MONGODB_URI=mongodb+srv://historyAdmin:YourPassword@cluster0.xxxxx.mongodb.net/vietnamese_history?retryWrites=true&w=majority
```

### Step 3: Deploy

1. Click **"Create Web Service"**
2. Wait for deployment (3-5 minutes)
3. Render will:
   - Clone your repository
   - Run `npm install`
   - Start the server with `node server.js`

### Step 4: Get Backend URL

After deployment, you'll receive a URL:
```
https://vietnamese-history-api-dvwf.onrender.com
```

**Save this URL** - you'll need it for frontend configuration!

### Step 5: Test Backend

Visit these URLs to verify:

1. **Root**: https://vietnamese-history-api-dvwf.onrender.com/
2. **Health Check**: https://vietnamese-history-api-dvwf.onrender.com/api/health
3. **Get Events**: https://vietnamese-history-api-dvwf.onrender.com/api/events

Expected responses:
- ✅ Status 200
- ✅ JSON data returned
- ✅ Database showing "Connected"

---

## Frontend Deployment (Vercel)

### Step 1: Update Configuration

**IMPORTANT**: Update `js/config.js` with your Render backend URL:

```javascript
// js/config.js
const config = {
  isDevelopment: window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1',
  
  getApiUrl: function() {
    if (this.isDevelopment) {
      return 'http://localhost:3000/api';
    } else {
      // ⚠️ IMPORTANT: Replace with YOUR Render URL
      return 'https://vietnamese-history-api-dvwf.onrender.com/api'
    }
  }
};

const API_BASE_URL = config.getApiUrl();
```

**Commit and push this change to GitHub before deploying!**

### Step 2: Create Vercel Project

1. Log in to Vercel: https://vercel.com/dashboard
2. Click **"Add New..."** → **"Project"**
3. Import your GitHub repository
4. Configure project:
   - **Project Name**: `vietnam-history` (or your choice)
   - **Framework Preset**: `Other` (static site)
   - **Root Directory**: `./`
   - **Build Command**: Leave empty (no build needed)
   - **Output Directory**: Leave empty (uses root)

### Step 3: Deploy

1. Click **"Deploy"**
2. Wait 1-2 minutes for deployment
3. Vercel will:
   - Clone your repository
   - Deploy static files
   - Generate a production URL

### Step 4: Get Frontend URL

After deployment, you'll receive URLs:
```
Production: https://vietnam-history-sage.vercel.app
```

### Step 5: Test Frontend

1. Visit: https://vietnam-history-sage.vercel.app
2. Test all pages:
   - ✅ Homepage loads
   - ✅ Map page loads events
   - ✅ Timeline displays
   - ✅ Events page shows cards
   - ✅ Search works
   - ✅ Event details load

---

## Configuration

### Update CORS on Backend

After deploying frontend, update CORS in `server.js`:

```javascript
// server.js
const corsOptions = {
    origin: process.env.NODE_ENV === 'production' 
        ? [
            'https://vietnam-history-sage.vercel.app',  // Your Vercel URL
            'https://vietnam-history-sage.vercel.app/'
          ]
        : '*',
    credentials: true,
    optionsSuccessStatus: 200
};
```

**Commit and push to trigger redeployment on Render!**

### vercel.json Configuration

Already configured in `vercel.json`:
```json
{
  "version": 2,
  "buildCommand": "echo 'No build needed for static site'",
  "outputDirectory": ".",
  "cleanUrls": true,
  "trailingSlash": false,
  "rewrites": [
    {
      "source": "/",
      "destination": "/index.html"
    }
  ]
}
```

### render.yaml Configuration

Already configured in `render.yaml`:
```yaml
services:
  - type: web
    name: vietnamese-history-api
    runtime: node
    buildCommand: npm install
    startCommand: node server.js
    envVars:
      - key: NODE_ENV
        value: production
      - key: PORT
        value: 10000
      - key: MONGODB_URI
        sync: false
```

---

## Testing Deployment

### Automated Testing Checklist

Run through this checklist to verify deployment:

#### Backend Tests

```bash
# 1. Health Check
curl https://vietnamese-history-api-dvwf.onrender.com/api/health
# Expected: {"status":"OK","database":"Connected",...}

# 2. Get Periods
curl https://vietnamese-history-api-dvwf.onrender.com/api/periods
# Expected: Array of period objects

# 3. Get Events
curl https://vietnamese-history-api-dvwf.onrender.com/api/events
# Expected: Array of event objects

# 4. Search
curl "https://vietnamese-history-api-dvwf.onrender.com/api/events/search?q=battle"
# Expected: Array of matching events

# 5. Statistics
curl https://vietnamese-history-api-dvwf.onrender.com/api/stats
# Expected: Stats object with counts
```

#### Frontend Tests

1. **Homepage**:
   - Visit https://vietnam-history-sage.vercel.app
   - ✅ Page loads without errors
   - ✅ Featured events display
   - ✅ Statistics show numbers

2. **Map Page**:
   - Visit https://vietnam-history-sage.vercel.app/map.html
   - ✅ Map renders
   - ✅ Period filters load
   - ✅ Markers appear when period selected
   - ✅ Popup opens on marker click

3. **Timeline Page**:
   - Visit https://vietnam-history-sage.vercel.app/timeline.html
   - ✅ Timeline renders
   - ✅ Events display
   - ✅ Period filter works
   - ✅ Modal opens on event click

4. **Events Page**:
   - Visit https://vietnam-history-sage.vercel.app/events.html
   - ✅ Event cards display
   - ✅ Images load
   - ✅ Filters work
   - ✅ Sort works

5. **Event Detail**:
   - Click any event
   - ✅ Detail page loads
   - ✅ All information displays
   - ✅ Related events show
   - ✅ "View on Map" works

6. **Search**:
   - Use search on any page
   - ✅ Results appear
   - ✅ Can click to view event

### Performance Testing

Use **PageSpeed Insights** or **GTmetrix**:
- Target: 90+ performance score
- Time to Interactive < 3 seconds
- First Contentful Paint < 1.5 seconds

---

## Monitoring & Maintenance

### Render Dashboard

Monitor your backend:
- **Logs**: View real-time logs
- **Metrics**: CPU, memory usage
- **Events**: Deployment history

Access: https://dashboard.render.com

### Vercel Dashboard

Monitor your frontend:
- **Deployments**: History and status
- **Analytics**: Traffic, performance
- **Logs**: Build and runtime logs

Access: https://vercel.com/dashboard

### MongoDB Atlas

Monitor your database:
- **Metrics**: Operations, connections
- **Performance**: Query performance
- **Alerts**: Set up email alerts

Access: https://cloud.mongodb.com

### Important Monitoring Points

1. **Render Free Tier Limits**:
   - 750 hours/month free runtime
   - Service spins down after 15 min inactivity
   - Cold start: 30-60 seconds

2. **MongoDB Atlas M0 Limits**:
   - 512 MB storage
   - Shared RAM
   - Shared cluster

3. **Vercel Free Tier**:
   - 100 GB bandwidth/month
   - Unlimited deployments
   - Automatic HTTPS

---

## Troubleshooting

### Backend Issues

#### Issue: API not responding
**Symptoms**: 502/503 errors, timeouts

**Solutions**:
1. Check if service is awake (visit any endpoint)
2. View Render logs for errors
3. Verify environment variables are set
4. Check MongoDB Atlas connection

#### Issue: Database not connected
**Symptoms**: `"database": "Disconnected"` in health check

**Solutions**:
1. Verify `MONGODB_URI` is correct
2. Check MongoDB Atlas network access (0.0.0.0/0)
3. Verify database user credentials
4. Check Atlas cluster is running

#### Issue: CORS errors
**Symptoms**: Browser console shows CORS errors

**Solutions**:
1. Update CORS origins in `server.js`
2. Ensure Vercel URL is in allowed origins
3. Redeploy backend after changes

### Frontend Issues

#### Issue: API requests failing
**Symptoms**: Events not loading, empty pages

**Solutions**:
1. Check `js/config.js` has correct Render URL
2. Verify backend is running (health check)
3. Check browser console for errors
4. Verify CORS is configured correctly

#### Issue: Assets not loading
**Symptoms**: Images missing, CSS broken

**Solutions**:
1. Check file paths are correct
2. Verify files are committed to Git
3. Check Vercel deployment logs
4. Clear browser cache

### Database Issues

#### Issue: Out of storage
**Symptoms**: Cannot insert new documents

**Solutions**:
1. Check storage usage in Atlas
2. Delete unnecessary data
3. Upgrade to paid tier if needed

---

## Rollback Procedures

### Backend Rollback (Render)

1. Go to Render dashboard
2. Navigate to your service
3. Click **"Events"** tab
4. Find previous successful deployment
5. Click **"Rollback"** button
6. Confirm rollback

### Frontend Rollback (Vercel)

1. Go to Vercel dashboard
2. Navigate to your project
3. Click **"Deployments"** tab
4. Find previous deployment
5. Click **"..."** menu
6. Select **"Promote to Production"**
7. Confirm promotion

---

## Continuous Deployment

### Automatic Deployments

Both Vercel and Render are configured for automatic deployment:

**Trigger**: Push to `main` branch

**Process**:
1. Push code to GitHub
2. Vercel auto-deploys frontend (1-2 min)
3. Render auto-deploys backend (3-5 min)

### Manual Deployment

**Vercel**:
1. Dashboard → Project → Deployments
2. Click **"Redeploy"**

**Render**:
1. Dashboard → Service → Manual Deploy
2. Click **"Deploy latest commit"**

---

## Security Best Practices

### Environment Variables
- ✅ Never commit `.env` files
- ✅ Use platform environment variable systems
- ✅ Rotate credentials periodically

### Database
- ✅ Use strong passwords
- ✅ Limit IP access in production
- ✅ Enable audit logs in Atlas

### API
- ✅ Implement rate limiting (future)
- ✅ Add authentication for write operations (future)
- ✅ Monitor for unusual traffic

---

## Cost Breakdown

### Current Setup (Free Tier)

| Service | Plan | Cost | Limits |
|---------|------|------|--------|
| Vercel | Free | $0/month | 100GB bandwidth, unlimited deployments |
| Render | Free | $0/month | 750 hours/month, shared CPU |
| MongoDB Atlas | M0 | $0/month | 512MB storage, shared cluster |

**Total Monthly Cost**: $0

### Scaling Costs

When you need to upgrade:

| Service | Next Tier | Cost |
|---------|-----------|------|
| Vercel | Pro | $20/month |
| Render | Starter | $7/month (per service) |
| MongoDB Atlas | M10 | $57/month |

---

## Next Steps

After deployment:

1. ✅ Set up custom domain (optional)
2. ✅ Configure analytics
3. ✅ Set up monitoring alerts
4. ✅ Implement backup strategy
5. ✅ Add API authentication
6. ✅ Implement rate limiting
7. ✅ Add caching layer

---

## Support

For deployment issues:
- **Vercel**: https://vercel.com/support
- **Render**: https://render.com/docs/support
- **MongoDB Atlas**: https://docs.atlas.mongodb.com

For project-specific issues:
- **GitHub Issues**: [Your Repository]/issues
- **Email**: contact@vietnamesehistory.edu.vn

---

**Deployment Guide Version**: 1.0.0  
**Last Updated**: January 2026  
**Status**: ✅ Production Deployed