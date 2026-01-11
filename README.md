# 🇻🇳 Vietnamese History Interactive Platform

An interactive web application that brings 4,000+ years of Vietnamese history to life through interactive maps, timelines, and detailed historical narratives.

![Vietnamese History](https://img.shields.io/badge/History-4000%2B%20Years-red)
![MongoDB Atlas](https://img.shields.io/badge/Database-MongoDB%20Atlas-green)
![Vercel](https://img.shields.io/badge/Frontend-Vercel-black)
![Render](https://img.shields.io/badge/Backend-Render-blue)
![License](https://img.shields.io/badge/License-Educational-blue)

## 🌐 Live Demo

**Frontend (Vercel):** https://vietnam-history-sage.vercel.app

**Backend API (Render):** https://vietnamese-history-api-dvwf.onrender.com

## 📖 Overview

The Vietnamese History project addresses the challenge of making Vietnamese history more accessible and engaging by developing an interactive web application. This platform allows users to explore historical events through:

- **🗺️ Interactive Map**: Explore events on a geographical map of Vietnam
- **⏳ Timeline Visualization**: Navigate through centuries using an interactive timeline
- **📚 Detailed Events**: Access comprehensive information about historical events
- **🔍 Smart Search**: Quickly find events, periods, and locations
- **📱 Responsive Design**: Works seamlessly on desktop, tablet, and mobile

## ✨ Features

### Interactive Map
- Leaflet.js powered interactive map
- Historical events marked with location-based pins
- Filter events by period and sub-period
- Click markers for detailed event information
- Geographical exploration of Vietnamese history

### Timeline View
- Visual timeline spanning from 2879 BC to present
- Zoom and pan through different time periods
- Color-coded events by historical period
- Filter by main periods and sub-periods
- Event details modal on click

### Events Browser
- Grid view of all historical events
- Sort by date or name
- Filter by historical period
- Rich event cards with images and descriptions
- Direct links to detailed event pages

### Event Detail Pages
- Comprehensive event information
- Historical significance
- Key figures involved
- Related events
- Location and date information
- Share functionality

## 🚀 Architecture

### Frontend (Vercel)
- **Platform**: Vercel (Static Site Hosting)
- **URL**: https://vietnam-history-sage.vercel.app
- **Technologies**: HTML5, CSS3, JavaScript ES6+
- **Libraries**: Leaflet.js, Vis.js Timeline

### Backend API (Render)
- **Platform**: Render (Node.js Web Service)
- **URL**: https://vietnamese-history-api-dvwf.onrender.com
- **Technologies**: Node.js, Express.js
- **Features**: RESTful API, CORS enabled

### Database (MongoDB Atlas)
- **Platform**: MongoDB Atlas (Cloud Database)
- **Tier**: Free M0 Sandbox
- **Collections**: periods, subPeriods, events
- **Features**: Geospatial queries, text search

## 🛠️ Technology Stack

### Frontend
- **HTML5 & CSS3**: Modern semantic markup and styling
- **JavaScript ES6+**: Vanilla JavaScript for interactivity
- **Leaflet.js**: Interactive map visualization
- **Vis.js**: Timeline visualization library
- **Vercel**: Static site hosting and deployment

### Backend
- **Node.js**: JavaScript runtime
- **Express.js**: Web application framework
- **MongoDB Atlas**: Cloud database service
- **Render**: Backend API hosting
- **CORS**: Cross-origin resource sharing

### Libraries & Tools
- **Leaflet.js v1.9.4**: Map rendering
- **Vis.js v4.21.0**: Timeline component
- **MongoDB Driver**: Database connectivity

## 📁 Project Structure

```
Vietnam_History/
├── css/                      # Stylesheets
│   ├── style.css            # Homepage styles
│   ├── map.css              # Map page styles
│   ├── timeline.css         # Timeline page styles
│   ├── events.css           # Events list styles
│   └── events-detail.css    # Event detail styles
├── js/                       # JavaScript files
│   ├── config.js            # API configuration (auto-detects environment)
│   ├── script.js            # Homepage logic
│   ├── map.js               # Map functionality
│   ├── timeline.js          # Timeline functionality
│   ├── events.js            # Events list logic
│   └── events-detail.js     # Event detail logic
├── images/                   # Event images
├── docs/                     # Documentation
│   ├── API.md               # API documentation
│   ├── USER_GUIDE.md        # User guide
│   ├── DEPLOYMENT.md        # Deployment guide
│   └── DATABASE_SCHEMA.md   # Database schema
├── server.js                 # Express server (deployed on Render)
├── package.json              # Dependencies
├── vercel.json              # Vercel configuration
├── render.yaml              # Render configuration
├── .env.example             # Environment variables template
└── README.md                # This file
```

## 🚀 Quick Start

### Prerequisites

- Node.js (v14 or higher) - for local development only
- MongoDB Atlas account (for database)
- Vercel account (for frontend deployment)
- Render account (for backend deployment)

### Local Development

1. **Clone the repository**
```bash
git clone https://github.com/yourusername/Vietnam_History.git
cd Vietnam_History
```

2. **Install dependencies**
```bash
npm install
```

3. **Configure environment**
```bash
# Create .env file
cp .env.example .env

# Edit .env with your MongoDB Atlas connection string
MONGODB_URI=your_mongodb_atlas_connection_string
PORT=3000
NODE_ENV=development
```

4. **Start the backend server**
```bash
node server.js
```

5. **Open frontend**
```
# Open index.html in your browser or use a local server
# The frontend will automatically connect to localhost:3000
```

### Production Deployment

The project is already configured for deployment:

- **Frontend**: Automatically deploys to Vercel on push to main branch
- **Backend**: Automatically deploys to Render on push to main branch
- **Database**: Already hosted on MongoDB Atlas

See [DEPLOYMENT.md](docs/DEPLOYMENT.md) for detailed deployment instructions.

## 📚 Documentation

- **[API Documentation](docs/API.md)** - Complete API endpoint reference
- **[User Guide](docs/USER_GUIDE.md)** - How to use the platform
- **[Deployment Guide](docs/DEPLOYMENT.md)** - How to deploy the application
- **[Database Schema](docs/DATABASE_SCHEMA.md)** - Database structure and models

## 🎯 Key Historical Periods

The platform covers these major periods of Vietnamese history:

1. **Ancient Period** (2879 BC - 111 BC)
   - Hồng Bàng Dynasty
   - Thục Dynasty
   - Triệu Dynasty

2. **Chinese Domination** (111 BC - 938 AD)
   - Various periods of Chinese rule
   - Resistance movements

3. **Monarchical Period** (938 - 1858)
   - Multiple dynasties including Lý, Trần, Lê
   - Golden ages of Vietnamese culture

4. **French Colonial Period** (1858 - 1945)
   - French Indochina
   - Resistance movements

5. **Indochina Wars** (1945 - 1975)
   - First Indochina War
   - Vietnam War

6. **Modern Vietnam** (1975 - Present)
   - Reunification
   - Economic reforms (Đổi Mới)

## 🤝 Contributing

We welcome contributions from the community! Whether you're fixing bugs, adding features, or improving documentation, your help is appreciated.

Please read [CONTRIBUTING.md](docs/CONTRIBUTING.md) for details on our code of conduct and the process for submitting pull requests.

## 📝 License

This project is licensed for educational purposes. All historical content is provided for learning and research.

## 🌟 Deployment Status

- ✅ **Frontend**: Deployed on Vercel
- ✅ **Backend API**: Deployed on Render
- ✅ **Database**: Hosted on MongoDB Atlas
- ✅ **CORS**: Configured for cross-origin requests
- ✅ **SSL**: HTTPS enabled on all services

## 🔗 Important URLs

- **Live Site**: https://vietnam-history-sage.vercel.app
- **API Base URL**: https://vietnamese-history-api-dvwf.onrender.com/api
- **API Health Check**: https://vietnamese-history-api-dvwf.onrender.com/api/health
- **GitHub Repository**: [Your Repository URL]

## 👥 Team

- **Development Team**: Software engineering and architecture
- **History Researchers**: Content accuracy and validation
- **Design Team**: UI/UX design
- **Community**: Contributors and supporters

## 🙏 Acknowledgments

- Vietnamese historians and educators for their invaluable expertise
- Open-source community for amazing tools and libraries
- MongoDB Atlas for cloud database hosting
- Vercel for frontend hosting
- Render for backend API hosting
- Leaflet.js and Vis.js communities
- All contributors and supporters of this project

## 📧 Contact

For questions, suggestions, or collaboration opportunities:
- Email: contact@vietnamesehistory.edu.vn
- GitHub Issues: [Report an issue](https://github.com/yourusername/Vietnam_History/issues)

## 🌟 Support

If you find this project helpful, please consider:
- ⭐ Starring the repository
- 🐛 Reporting bugs
- 💡 Suggesting new features
- 📖 Improving documentation
- 🤝 Contributing code

---

**Made with ❤️ for education and cultural preservation**

*Preserving 4,000 years of Vietnamese heritage through technology*

**Live at**: https://vietnam-history-sage.vercel.app