# API Documentation

Complete reference for the Vietnamese History API endpoints.

## Base URLs

### Production (Recommended)
```
https://vietnamese-history-api-dvwf.onrender.com/api
```

### Local Development
```
http://localhost:3000/api
```

## 🌐 Live API

The API is currently deployed on **Render** and accessible at:
- **API Root**: https://vietnamese-history-api-dvwf.onrender.com
- **API Base**: https://vietnamese-history-api-dvwf.onrender.com/api
- **Health Check**: https://vietnamese-history-api-dvwf.onrender.com/api/health

## Table of Contents

- [Authentication](#authentication)
- [Root Endpoint](#root-endpoint)
- [Health Check](#health-check)
- [Periods](#periods)
- [Sub-Periods](#sub-periods)
- [Events](#events)
- [Search](#search)
- [Statistics](#statistics)
- [Error Handling](#error-handling)
- [Rate Limiting](#rate-limiting)

---

## Authentication

Currently, the API does not require authentication. All endpoints are publicly accessible for educational purposes.

**Note**: In future versions, authentication may be added for write operations.

---

## Root Endpoint

### GET /

Returns API information and available endpoints.

**Production URL:**
```
https://vietnamese-history-api-dvwf.onrender.com/
```

**Response:**
```json
{
  "message": "Vietnamese History API",
  "status": "Running",
  "version": "1.0.0",
  "endpoints": {
    "health": "/api/health",
    "periods": "/api/periods",
    "subperiods": "/api/subperiods",
    "events": "/api/events",
    "stats": "/api/stats"
  },
  "documentation": "See /api/health for system status"
}
```

---

## Health Check

### GET /api/health

Check if the API server is running and database is connected.

**Production URL:**
```
https://vietnamese-history-api-dvwf.onrender.com/api/health
```

**Response:**
```json
{
  "status": "OK",
  "database": "Connected",
  "environment": "production",
  "timestamp": "2026-01-09T10:30:00.000Z"
}
```

**Status Codes:**
- `200`: API is healthy and database is connected
- `500`: API is running but database connection failed

---

## Periods

### GET /api/periods

Get all historical periods sorted by order.

**Production URL:**
```
https://vietnamese-history-api-dvwf.onrender.com/api/periods
```

**Response:**
```json
[
  {
    "_id": { "$oid": "..." },
    "name": "Ancient Period",
    "slug": "ancient",
    "startYear": -2879,
    "endYear": -111,
    "order": 1,
    "color": "#8B4513",
    "description": "The ancient period of Vietnamese history..."
  }
]
```

**Fields:**
- `_id`: MongoDB ObjectId
- `name`: Display name of the period
- `slug`: URL-friendly identifier
- `startYear`: Start year (negative for BC)
- `endYear`: End year
- `order`: Display order
- `color`: Hex color code for visualization
- `description`: Brief description

---

## Sub-Periods

### GET /api/subperiods

Get all sub-periods sorted by order.

**Production URL:**
```
https://vietnamese-history-api-dvwf.onrender.com/api/subperiods
```

**Response:**
```json
[
  {
    "_id": { "$oid": "..." },
    "name": "Hồng Bàng Dynasty",
    "periodId": { "$oid": "..." },
    "startYear": -2879,
    "endYear": -258,
    "order": 1,
    "color": "#A0522D",
    "description": "The legendary first dynasty..."
  }
]
```

### GET /api/subperiods/period/:periodId

Get all sub-periods for a specific period.

**Production URL:**
```
https://vietnamese-history-api-dvwf.onrender.com/api/subperiods/period/507f1f77bcf86cd799439011
```

**Parameters:**
- `periodId`: MongoDB ObjectId of the parent period

**Response:**
```json
[
  {
    "_id": { "$oid": "..." },
    "name": "Hồng Bàng Dynasty",
    "periodId": { "$oid": "507f1f77bcf86cd799439011" },
    "startYear": -2879,
    "endYear": -258,
    "order": 1
  }
]
```

---

## Events

### GET /api/events

Get all historical events.

**Production URL:**
```
https://vietnamese-history-api-dvwf.onrender.com/api/events
```

**Response:**
```json
[
  {
    "_id": { "$oid": "..." },
    "title": "Founding of Văn Lang",
    "titleVietnamese": "Dựng nước Văn Lang",
    "periodId": { "$oid": "..." },
    "subPeriodId": { "$oid": "..." },
    "date": {
      "year": -2879,
      "month": null,
      "day": null,
      "displayDate": "2879 BC"
    },
    "location": {
      "name": "Red River Delta",
      "province": "Multiple provinces",
      "coordinates": {
        "lat": 20.8449,
        "lng": 106.1876
      }
    },
    "description": "Full event description...",
    "shortDescription": "Brief summary...",
    "significance": "Historical importance...",
    "tags": ["dynasty", "founding"],
    "featured": true
  }
]
```

### GET /api/events/:id

Get a single event by ID.

**Production URL:**
```
https://vietnamese-history-api-dvwf.onrender.com/api/events/507f1f77bcf86cd799439011
```

**Parameters:**
- `id`: MongoDB ObjectId of the event

**Response:**
```json
{
  "_id": { "$oid": "507f1f77bcf86cd799439011" },
  "title": "Founding of Văn Lang",
  "description": "...",
  "date": { ... },
  "location": { ... }
}
```

**Error Response (404):**
```json
{
  "error": "Event not found"
}
```

### GET /api/events/period/:periodId

Get all events from a specific period.

**Production URL:**
```
https://vietnamese-history-api-dvwf.onrender.com/api/events/period/507f1f77bcf86cd799439011
```

**Parameters:**
- `periodId`: MongoDB ObjectId of the period

**Response:**
Array of events sorted by date (year ascending)

### GET /api/events/subperiod/:subPeriodId

Get all events from a specific sub-period.

**Production URL:**
```
https://vietnamese-history-api-dvwf.onrender.com/api/events/subperiod/507f1f77bcf86cd799439011
```

**Parameters:**
- `subPeriodId`: MongoDB ObjectId of the sub-period

**Response:**
Array of events sorted by date (year ascending)

### GET /api/events/range

Get events within a year range.

**Production URL:**
```
https://vietnamese-history-api-dvwf.onrender.com/api/events/range?start=-2879&end=-111
```

**Query Parameters:**
- `start`: Start year (integer, negative for BC)
- `end`: End year (integer)

**Example:**
```
https://vietnamese-history-api-dvwf.onrender.com/api/events/range?start=-2879&end=-111
```

**Response:**
Array of events between the specified years

**Error Response (400):**
```json
{
  "error": "Valid start and end years required"
}
```

---

## Search

### GET /api/events/search

Search events by text query.

**Production URL:**
```
https://vietnamese-history-api-dvwf.onrender.com/api/events/search?q=battle
```

**Query Parameters:**
- `q`: Search query string

**Example:**
```
https://vietnamese-history-api-dvwf.onrender.com/api/events/search?q=battle
```

**Response:**
Array of events matching the search query

**Error Response (400):**
```json
{
  "error": "Search query required"
}
```

**Note:** Search uses MongoDB text index on `title` and `description` fields.

---

## Statistics

### GET /api/stats

Get database statistics.

**Production URL:**
```
https://vietnamese-history-api-dvwf.onrender.com/api/stats
```

**Response:**
```json
{
  "totalEvents": 150,
  "totalPeriods": 7,
  "totalSubPeriods": 25,
  "eventsByPeriod": [
    {
      "_id": { "$oid": "..." },
      "count": 32
    }
  ]
}
```

**Fields:**
- `totalEvents`: Total number of events in database
- `totalPeriods`: Total number of historical periods
- `totalSubPeriods`: Total number of sub-periods
- `eventsByPeriod`: Event count grouped by period

---

## Error Handling

All endpoints may return the following error responses:

### 400 Bad Request
Invalid input parameters or missing required fields.

```json
{
  "error": "Valid start and end years required"
}
```

### 404 Not Found
Resource not found (event, period, etc.).

```json
{
  "error": "Event not found"
}
```

### 500 Internal Server Error
Server or database error.

```json
{
  "error": "Internal server error message"
}
```

**Standard Error Response Format:**
```json
{
  "error": "Error message description"
}
```

---

## Rate Limiting

**Current Status**: No rate limiting implemented on Render deployment.

**Note**: Render's free tier has the following limitations:
- Services spin down after 15 minutes of inactivity
- First request after spin down may take 30-60 seconds
- 750 hours of free runtime per month (shared across all services)

---

## CORS

The API supports Cross-Origin Resource Sharing (CORS) with the following configuration:

**Production**: 
- Allowed origins: 
  - https://vietnam-history-sage.vercel.app
  - https://vietnam-history-sage.vercel.app/

**Development**: 
- Allowed origins: All origins (*)

---

## Examples

### JavaScript Fetch (Production)

```javascript
// Get all events
fetch('https://vietnamese-history-api-dvwf.onrender.com/api/events')
  .then(response => response.json())
  .then(data => console.log(data))
  .catch(error => console.error('Error:', error));

// Search events
fetch('https://vietnamese-history-api-dvwf.onrender.com/api/events/search?q=battle')
  .then(response => response.json())
  .then(data => console.log(data));

// Get events by year range
fetch('https://vietnamese-history-api-dvwf.onrender.com/api/events/range?start=1945&end=1975')
  .then(response => response.json())
  .then(data => console.log(data));
```

### cURL (Production)

```bash
# Get all periods
curl https://vietnamese-history-api-dvwf.onrender.com/api/periods

# Get specific event
curl https://vietnamese-history-api-dvwf.onrender.com/api/events/507f1f77bcf86cd799439011

# Search events
curl "https://vietnamese-history-api-dvwf.onrender.com/api/events/search?q=battle"

# Health check
curl https://vietnamese-history-api-dvwf.onrender.com/api/health
```

### Axios (Production)

```javascript
import axios from 'axios';

const API_BASE_URL = 'https://vietnamese-history-api-dvwf.onrender.com/api';

// Get all events
const events = await axios.get(`${API_BASE_URL}/events`);

// Search events
const searchResults = await axios.get(`${API_BASE_URL}/events/search`, {
  params: { q: 'battle' }
});

// Get events by period
const periodEvents = await axios.get(`${API_BASE_URL}/events/period/${periodId}`);
```

---

## Testing the API

You can test the API using:

1. **Browser**: Visit https://vietnamese-history-api-dvwf.onrender.com/api/health
2. **Postman**: Import the endpoints and test
3. **cURL**: Use the examples above
4. **Frontend**: The deployed frontend at https://vietnam-history-sage.vercel.app

---

## Important Notes

### Cold Start
- The Render free tier spins down services after 15 minutes of inactivity
- First request after spin down takes 30-60 seconds
- Subsequent requests are fast (~100-200ms)

### Performance
- API responses are typically under 500ms (after warm-up)
- Large collections (all events) may take 1-2 seconds
- Consider implementing pagination for large datasets

### Best Practices
1. **Cache responses** when possible
2. **Handle loading states** for cold starts
3. **Use specific queries** instead of fetching all data
4. **Implement error handling** for all requests
5. **Show loading indicators** for better UX

---

## Future Enhancements

Planned API improvements:

- [ ] Authentication and authorization
- [ ] Rate limiting
- [ ] Pagination for large result sets
- [ ] Filtering with multiple parameters
- [ ] Sorting options
- [ ] API versioning (/api/v1/)
- [ ] WebSocket support for real-time updates
- [ ] GraphQL endpoint
- [ ] Caching layer (Redis)
- [ ] CDN integration

---

## Support

For API issues or questions:
- **GitHub Issues**: [Report an issue](https://github.com/yourusername/Vietnam_History/issues)
- **Email**: contact@vietnamesehistory.edu.vn

---

**API Version**: 1.0.0  
**Last Updated**: January 2026  
**Status**: ✅ Production - Live on Render