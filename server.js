require('dotenv').config();

const express = require('express');
const cors = require('cors');
const { MongoClient, ObjectId } = require('mongodb');

const app = express();
const PORT = process.env.PORT || 3000;

// CORS Configuration
const corsOptions = {
    origin: process.env.NODE_ENV === 'production' 
        ? [
            'https://vietnam-history-sage.vercel.app',
            'https://vietnam-history-sage.vercel.app/'
          ]
        : '*',
    credentials: true,
    optionsSuccessStatus: 200
};

app.use(cors(corsOptions));
app.use(express.json());

// MongoDB Configuration
const MONGODB_URI = process.env.MONGODB_URI;
const DB_NAME = 'vietnamese_history';

let db;
let periodsCollection;
let subPeriodsCollection;
let eventsCollection;

// Connect to MongoDB
async function connectToDatabase() {
    try {
        console.log('🔄 Connecting to MongoDB Atlas...');
        const client = new MongoClient(MONGODB_URI);
        await client.connect();
        console.log('✅ Connected to MongoDB Atlas');

        db = client.db(DB_NAME);
        periodsCollection = db.collection('periods');
        subPeriodsCollection = db.collection('subPeriods');
        eventsCollection = db.collection('events');
       
        const periodsCount = await periodsCollection.countDocuments();
        const subPeriodsCount = await subPeriodsCollection.countDocuments();
        const eventsCount = await eventsCollection.countDocuments();
        
        console.log(`📊 Database statistics:`);
        console.log(`   - Periods: ${periodsCount}`);
        console.log(`   - Sub-periods: ${subPeriodsCount}`);
        console.log(`   - Events: ${eventsCount}`);
        
    } catch (error) {
        console.error('❌ MongoDB connection error:', error.message);
        process.exit(1);
    }
}

// ============================================
// ROOT ROUTE (Important for Render!)
// ============================================
app.get('/', (req, res) => {
    res.json({
        message: 'Vietnamese History API',
        status: 'Running',
        version: '1.0.0',
        endpoints: {
            health: '/api/health',
            periods: '/api/periods',
            subperiods: '/api/subperiods',
            events: '/api/events',
            stats: '/api/stats'
        },
        documentation: 'See /api/health for system status'
    });
});

// ============================================
// API ROUTES
// ============================================

// Health check
app.get('/api/health', (req, res) => {
    res.json({ 
        status: 'OK', 
        database: db ? 'Connected' : 'Disconnected',
        environment: process.env.NODE_ENV || 'development',
        timestamp: new Date().toISOString()
    });
});

// Get all periods
app.get('/api/periods', async (req, res) => {
    try {
        const periods = await periodsCollection.find({}).sort({ order: 1 }).toArray();
        res.json(periods);
    } catch (error) {
        console.error('Error fetching periods:', error);
        res.status(500).json({ error: error.message });
    }
});

// Get all sub-periods
app.get('/api/subperiods', async (req, res) => {
    try {
        const subPeriods = await subPeriodsCollection.find({}).sort({ order: 1 }).toArray();
        res.json(subPeriods);
    } catch (error) {
        console.error('Error fetching sub-periods:', error);
        res.status(500).json({ error: error.message });
    }
});

// Get sub-periods by period ID
app.get('/api/subperiods/period/:periodId', async (req, res) => {
    try {
        const periodId = req.params.periodId;
        const subPeriods = await subPeriodsCollection
            .find({ 'periodId.$oid': periodId })
            .sort({ order: 1 })
            .toArray();
        res.json(subPeriods);
    } catch (error) {
        console.error('Error fetching sub-periods by period:', error);
        res.status(500).json({ error: error.message });
    }
});

// Get all events
app.get('/api/events', async (req, res) => {
    try {
        const events = await eventsCollection.find({}).toArray();
        res.json(events);
    } catch (error) {
        console.error('Error fetching events:', error);
        res.status(500).json({ error: error.message });
    }
});

// Get single event by ID
app.get('/api/events/:id', async (req, res) => {
    try {
        const event = await eventsCollection.findOne({ 
            _id: new ObjectId(req.params.id) 
        });
        
        if (event) {
            res.json(event);
        } else {
            res.status(404).json({ error: 'Event not found' });
        }
    } catch (error) {
        console.error('Error fetching event:', error);
        res.status(500).json({ error: error.message });
    }
});

// Search events
app.get('/api/events/search', async (req, res) => {
    try {
        const query = req.query.q;
        
        if (!query) {
            return res.status(400).json({ error: 'Search query required' });
        }
        
        const events = await eventsCollection.find({
            $text: { $search: query }
        }).toArray();
        
        res.json(events);
    } catch (error) {
        console.error('Error searching events:', error);
        res.status(500).json({ error: error.message });
    }
});

// Get events by period
app.get('/api/events/period/:periodId', async (req, res) => {
    try {
        const periodId = req.params.periodId;
        const events = await eventsCollection
            .find({ 'periodId.$oid': periodId })
            .sort({ 'date.year': 1 })
            .toArray();
        res.json(events);
    } catch (error) {
        console.error('Error fetching events by period:', error);
        res.status(500).json({ error: error.message });
    }
});

// Get events by sub-period
app.get('/api/events/subperiod/:subPeriodId', async (req, res) => {
    try {
        const subPeriodId = req.params.subPeriodId;
        const events = await eventsCollection
            .find({ 'subPeriodId.$oid': subPeriodId })
            .sort({ 'date.year': 1 })
            .toArray();
        res.json(events);
    } catch (error) {
        console.error('Error fetching events by sub-period:', error);
        res.status(500).json({ error: error.message });
    }
});

// Get events by year range
app.get('/api/events/range', async (req, res) => {
    try {
        const startYear = parseInt(req.query.start);
        const endYear = parseInt(req.query.end);
        
        if (isNaN(startYear) || isNaN(endYear)) {
            return res.status(400).json({ error: 'Valid start and end years required' });
        }
        
        const events = await eventsCollection.find({
            'date.year': { $gte: startYear, $lte: endYear }
        }).sort({ 'date.year': 1 }).toArray();
        
        res.json(events);
    } catch (error) {
        console.error('Error fetching events by range:', error);
        res.status(500).json({ error: error.message });
    }
});

// Get statistics
app.get('/api/stats', async (req, res) => {
    try {
        const stats = await eventsCollection.aggregate([
            {
                $group: {
                    _id: '$periodId',
                    count: { $sum: 1 }
                }
            }
        ]).toArray();
        
        const totalEvents = await eventsCollection.countDocuments();
        const totalPeriods = await periodsCollection.countDocuments();
        const totalSubPeriods = await subPeriodsCollection.countDocuments();
        
        res.json({
            totalEvents,
            totalPeriods,
            totalSubPeriods,
            eventsByPeriod: stats
        });
    } catch (error) {
        console.error('Error fetching statistics:', error);
        res.status(500).json({ error: error.message });
    }
});

// 404 handler for undefined routes
app.use((req, res) => {
    res.status(404).json({
        error: 'Not Found',
        message: `Route ${req.method} ${req.path} not found`,
        availableEndpoints: [
            'GET /',
            'GET /api/health',
            'GET /api/periods',
            'GET /api/subperiods',
            'GET /api/events',
            'GET /api/stats'
        ]
    });
});

// Start server
async function startServer() {
    await connectToDatabase();
    
    app.listen(PORT, '0.0.0.0', () => {
        console.log(`\n🚀 Server running on port ${PORT}`);
        console.log(`📍 Environment: ${process.env.NODE_ENV || 'development'}`);
        console.log(`\n✅ API is ready!`);
        console.log(`   Root: http://localhost:${PORT}/`);
        console.log(`   Health: http://localhost:${PORT}/api/health`);
    });
}

// Graceful shutdown
process.on('SIGINT', async () => {
    console.log('\n🛑 Shutting down server...');
    process.exit(0);
});

process.on('SIGTERM', async () => {
    console.log('\n🛑 Shutting down server...');
    process.exit(0);
});

startServer();