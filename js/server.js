// Vietnamese History Map - Backend Server
// This file handles MongoDB connections and API endpoints

const express = require('express');
const cors = require('cors');
const { MongoClient, ObjectId } = require('mongodb');

const app = express();
const PORT = 3000;

// Middleware
app.use(cors());
app.use(express.json());

// MongoDB Configuration
const MONGODB_URI = 'mongodb://localhost:27017';
const DB_NAME = 'vietnamese_history';
const COLLECTION_NAME = 'events';

let db;
let eventsCollection;

// Connect to MongoDB
async function connectToDatabase() {
    try {
        const client = new MongoClient(MONGODB_URI);
        await client.connect();
        
        console.log('✅ Connected to MongoDB');
        
        db = client.db(DB_NAME);
        eventsCollection = db.collection(COLLECTION_NAME);
        
        // Create indexes for better search performance
        await eventsCollection.createIndex({ title: 'text', description: 'text' });
        await eventsCollection.createIndex({ period: 1 });
        await eventsCollection.createIndex({ year: 1 });
        
        console.log('✅ Database indexes created');
        
        // Insert sample data if collection is empty
        const count = await eventsCollection.countDocuments();
        if (count === 0) {
            await insertSampleData();
        }
        
    } catch (error) {
        console.error('❌ MongoDB connection error:', error);
        process.exit(1);
    }
}

// ============================================
// API ROUTES
// ============================================

// Get all events
app.get('/api/events', async (req, res) => {
    try {
        const events = await eventsCollection.find({}).toArray();
        res.json(events);
    } catch (error) {
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
        res.status(500).json({ error: error.message });
    }
});

// Search events (text search)
app.get('/api/events/search', async (req, res) => {
    try {
        const query = req.query.q;
        
        if (!query) {
            return res.status(400).json({ error: 'Search query required' });
        }
        
        // Text search on indexed fields
        const events = await eventsCollection.find({
            $text: { $search: query }
        }).toArray();
        
        res.json(events);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Get events by period
app.get('/api/events/period/:period', async (req, res) => {
    try {
        const period = req.params.period;
        
        const events = await eventsCollection.find({ 
            period: period 
        }).toArray();
        
        res.json(events);
    } catch (error) {
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
            year: { $gte: startYear, $lte: endYear }
        }).sort({ year: 1 }).toArray();
        
        res.json(events);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Create new event
app.post('/api/events', async (req, res) => {
    try {
        const eventData = req.body;
        
        // Validate required fields
        if (!eventData.title || !eventData.period || !eventData.year) {
            return res.status(400).json({ 
                error: 'Title, period, and year are required' 
            });
        }
        
        const result = await eventsCollection.insertOne(eventData);
        
        res.status(201).json({
            _id: result.insertedId,
            ...eventData
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Update event
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
        res.status(500).json({ error: error.message });
    }
});

// Delete event
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
        res.status(500).json({ error: error.message });
    }
});

// Get statistics
app.get('/api/stats', async (req, res) => {
    try {
        const stats = await eventsCollection.aggregate([
            {
                $group: {
                    _id: '$period',
                    count: { $sum: 1 }
                }
            }
        ]).toArray();
        
        const totalEvents = await eventsCollection.countDocuments();
        
        res.json({
            totalEvents,
            byPeriod: stats
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Health check endpoint
app.get('/api/health', (req, res) => {
    res.json({ 
        status: 'OK', 
        database: db ? 'Connected' : 'Disconnected' 
    });
});

// Start server
async function startServer() {
    await connectToDatabase();
    
    app.listen(PORT, () => {
        console.log(`🚀 Server running on http://localhost:${PORT}`);
        console.log(`📍 API available at http://localhost:${PORT}/api`);
        console.log('\nAvailable endpoints:');
        console.log('  GET    /api/events');
        console.log('  GET    /api/events/:id');
        console.log('  GET    /api/events/search?q=query');
        console.log('  GET    /api/events/period/:period');
        console.log('  GET    /api/events/range?start=year&end=year');
        console.log('  POST   /api/events');
        console.log('  PUT    /api/events/:id');
        console.log('  DELETE /api/events/:id');
        console.log('  GET    /api/stats');
        console.log('  GET    /api/health');
    });
}

// Handle graceful shutdown
process.on('SIGINT', async () => {
    console.log('\n🛑 Shutting down server...');
    process.exit(0);
});

// Start the server
startServer();