require('dotenv').config();

// Vietnamese History Map - Backend Server with MongoDB Atlas
const express = require('express');
const cors = require('cors');
const { MongoClient, ObjectId } = require('mongodb');

const app = express();
const PORT = process.env.PORT || 3000;

// CORS Configuration - Updated for production
const corsOptions = {
    origin: process.env.NODE_ENV === 'production' 
        ? [
            'https://your-vercel-app.vercel.app', // Replace with your Vercel domain
            'https://your-custom-domain.com' // Add custom domain if you have one
          ]
        : '*', // Allow all origins in development
    credentials: true,
    optionsSuccessStatus: 200
};

// Middleware
app.use(cors(corsOptions));
app.use(express.json());

// MongoDB Atlas Configuration
const MONGODB_URI = process.env.MONGODB_URI;
const DB_NAME = 'vietnamese_history';

let db;
let periodsCollection;
let subPeriodsCollection;
let eventsCollection;

// Connect to MongoDB Atlas
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
       
        // Check if collections have data
        const periodsCount = await periodsCollection.countDocuments();
        const subPeriodsCount = await subPeriodsCollection.countDocuments();
        const eventsCount = await eventsCollection.countDocuments();
        
        console.log(`📊 Database statistics:`);
        console.log(`   - Periods: ${periodsCount}`);
        console.log(`   - Sub-periods: ${subPeriodsCount}`);
        console.log(`   - Events: ${eventsCount}`);
        
        if (periodsCount === 0 || subPeriodsCount === 0 || eventsCount === 0) {
            console.log('⚠️  Database is empty. Please import your data.');
            console.log('📝 Use the import script or MongoDB Compass to add data.');
        }
        
    } catch (error) {
        console.error('❌ MongoDB Atlas connection error:', error.message);
        console.log('\n💡 Troubleshooting tips:');
        console.log('   1. Check your MONGODB_URI connection string');
        console.log('   2. Ensure your IP is whitelisted in MongoDB Atlas');
        console.log('   3. Verify your username and password are correct');
        console.log('   4. Check your network connection\n');
        process.exit(1);
    }
}

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

// Get events near location (geospatial query)
app.get('/api/events/near', async (req, res) => {
    try {
        const lat = parseFloat(req.query.lat);
        const lng = parseFloat(req.query.lng);
        const maxDistance = parseInt(req.query.distance) || 100000; // meters
        
        if (isNaN(lat) || isNaN(lng)) {
            return res.status(400).json({ error: 'Valid latitude and longitude required' });
        }
        
        const events = await eventsCollection.find({
            'location.coordinates': {
                $near: {
                    $geometry: {
                        type: 'Point',
                        coordinates: [lng, lat]
                    },
                    $maxDistance: maxDistance
                }
            }
        }).toArray();
        
        res.json(events);
    } catch (error) {
        console.error('Error fetching nearby events:', error);
        res.status(500).json({ error: error.message });
    }
});

// Create new event (admin)
app.post('/api/events', async (req, res) => {
    try {
        const eventData = req.body;
        
        if (!eventData.title || !eventData.periodId || !eventData.date) {
            return res.status(400).json({ 
                error: 'Title, periodId, and date are required' 
            });
        }
        
        const result = await eventsCollection.insertOne(eventData);
        
        res.status(201).json({
            _id: result.insertedId,
            ...eventData
        });
    } catch (error) {
        console.error('Error creating event:', error);
        res.status(500).json({ error: error.message });
    }
});

// Update event (admin)
app.put('/api/events/:id', async (req, res) => {
    try {
        const eventId = req.params.id;
        const updateData = req.body;
        
        const result = await eventsCollection.updateOne(
            { _id: new ObjectId(eventId) },
            { $set: updateData }
        );
        
        if (result.matchedCount === 0) {
            return res.status(404).json({ error: 'Event not found' });
        }
        
        res.json({ message: 'Event updated successfully' });
    } catch (error) {
        console.error('Error updating event:', error);
        res.status(500).json({ error: error.message });
    }
});

// Delete event (admin)
app.delete('/api/events/:id', async (req, res) => {
    try {
        const eventId = req.params.id;
        
        const result = await eventsCollection.deleteOne({ 
            _id: new ObjectId(eventId) 
        });
        
        if (result.deletedCount === 0) {
            return res.status(404).json({ error: 'Event not found' });
        }
        
        res.json({ message: 'Event deleted successfully' });
    } catch (error) {
        console.error('Error deleting event:', error);
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

// Start server
async function startServer() {
    await connectToDatabase();
    
    app.listen(PORT, '0.0.0.0', () => {
        console.log(`\n🚀 Server running on port ${PORT}`);
        console.log(`📍 Environment: ${process.env.NODE_ENV || 'development'}`);
        console.log(`\n📚 Available endpoints:`);
        console.log(`   GET    /api/health`);
        console.log(`   GET    /api/periods`);
        console.log(`   GET    /api/subperiods`);
        console.log(`   GET    /api/events`);
        console.log(`   GET    /api/events/:id`);
        console.log(`   GET    /api/events/search?q=query`);
        console.log(`   GET    /api/events/period/:periodId`);
        console.log(`   GET    /api/events/subperiod/:subPeriodId`);
        console.log(`   GET    /api/events/range?start=year&end=year`);
        console.log(`   GET    /api/events/near?lat=x&lng=y&distance=m`);
        console.log(`   POST   /api/events`);
        console.log(`   PUT    /api/events/:id`);
        console.log(`   DELETE /api/events/:id`);
        console.log(`   GET    /api/stats\n`);
    });
}

// Handle graceful shutdown
process.on('SIGINT', async () => {
    console.log('\n🛑 Shutting down server...');
    process.exit(0);
});

process.on('SIGTERM', async () => {
    console.log('\n🛑 Shutting down server...');
    process.exit(0);
});

// Start the server
startServer();