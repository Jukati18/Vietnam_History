# 🇻🇳 Vietnamese History Interactive Platform

An interactive web application that brings 4,000+ years of Vietnamese history to life through interactive maps, timelines, and detailed historical narratives.

![Vietnamese History](https://img.shields.io/badge/History-4000%2B%20Years-red)
![MongoDB](https://img.shields.io/badge/Database-MongoDB%20Atlas-green)
![License](https://img.shields.io/badge/License-Educational-blue)

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

## 🚀 Quick Start

### Prerequisites

- Node.js (v14 or higher)
- MongoDB Atlas account
- Modern web browser

### Installation

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
```

4. **Start the server**
```bash
node server.js
```

5. **Open in browser**
```
http://localhost:3000
```

## 🛠️ Technology Stack

### Frontend
- **HTML5 & CSS3**: Modern semantic markup and styling
- **JavaScript ES6+**: Vanilla JavaScript for interactivity
- **Leaflet.js**: Interactive map visualization
- **Vis.js**: Timeline visualization library

### Backend
- **Node.js**: JavaScript runtime
- **Express.js**: Web application framework
- **MongoDB Atlas**: Cloud database service
- **dotenv**: Environment variable management

### Libraries & Tools
- **Leaflet.js v1.9.4**: Map rendering
- **Vis.js v4.21.0**: Timeline component
- **CORS**: Cross-origin resource sharing
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
│   ├── script.js            # Homepage logic
│   ├── map.js               # Map functionality
│   ├── timeline.js          # Timeline functionality
│   ├── events.js            # Events list logic
│   └── events-detail.js     # Event detail logic
├── images/                   # Event images
├── docs/                     # Documentation
│   ├── API.md               # API documentation
│   ├── USER_GUIDE.md        # User guide
│   ├── SETUP.md             # Setup instructions
│   └── DATABASE_SCHEMA.md   # Database schema
├── server.js                 # Express server
├── package.json              # Dependencies
├── .env                      # Environment variables
└── README.md                 # This file
```

## 📚 Documentation

- **[API Documentation](docs/API.md)** - Complete API endpoint reference
- **[User Guide](docs/USER_GUIDE.md)** - How to use the platform
- **[Setup Guide](docs/SETUP.md)** - Detailed installation instructions
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

## 👥 Team

- **Development Team**: Software engineering and architecture
- **History Researchers**: Content accuracy and validation
- **Design Team**: UI/UX design
- **Community**: Contributors and supporters

## 🙏 Acknowledgments

- Vietnamese historians and educators for their invaluable expertise
- Open-source community for amazing tools and libraries
- MongoDB Atlas for cloud database hosting
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