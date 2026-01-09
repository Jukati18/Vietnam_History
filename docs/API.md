# API Documentation

Complete reference for the Vietnamese History API endpoints.

## Base URL

```
http://localhost:3000/api
```

## Table of Contents

- [Health Check](#health-check)
- [Periods](#periods)
- [Sub-Periods](#sub-periods)
- [Events](#events)
- [Search](#search)
- [Statistics](#statistics)

---

## Health Check

### GET /api/health

Check if the API server is running and database is connected.

**Response:**
```json
{
  "status": "OK",
  "database": "Connected",
  "timestamp": "2026-01-09T10:30:00.000Z"
}
```

---

## Periods

### GET /api/periods

Get all historical periods sorted by order.

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

**Parameters:**
- `periodId`: MongoDB ObjectId of the parent period

**Example:**
```
GET /api/subperiods/period/507f1f77bcf86cd799439011
```

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

**Parameters:**
- `id`: MongoDB ObjectId of the event

**Example:**
```
GET /api/events/507f1f77bcf86cd799439011
```

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

**Parameters:**
- `periodId`: MongoDB ObjectId of the period

**Example:**
```
GET /api/events/period/507f1f77bcf86cd799439011
```

**Response:**
Array of events sorted by date (year ascending)

### GET /api/events/subperiod/:subPeriodId

Get all events from a specific sub-period.

**Parameters:**
- `subPeriodId`: MongoDB ObjectId of the sub-period

**Example:**
```
GET /api/events/subperiod/507f1f77bcf86cd799439011
```

**Response:**
Array of events sorted by date (year ascending)

### GET /api/events/range

Get events within a year range.

**Query Parameters:**
- `start`: Start year (integer, negative for BC)
- `end`: End year (integer)

**Example:**
```
GET /api/events/range?start=-2879&end=-111
```

**Response:**
Array of events between the specified years

**Error Response (400):**
```json
{
  "error": "Valid start and end years required"
}
```

### GET /api/events/near

Get events near a geographical location (geospatial query).

**Query Parameters:**
- `lat`: Latitude (float)
- `lng`: Longitude (float)
- `distance`: Maximum distance in meters (integer, default: 100000)

**Example:**
```
GET /api/events/near?lat=21.0285&lng=105.8542&distance=50000
```

**Response:**
Array of events within the specified distance

**Error Response (400):**
```json
{
  "error": "Valid latitude and longitude required"
}
```

---

## Search

### GET /api/events/search

Search events by text query.

**Query Parameters:**
- `q`: Search query string

**Example:**
```
GET /api/events/search?q=battle
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

## Create, Update, Delete (Admin Operations)

### POST /api/events

Create a new event.

**Request Body:**
```json
{
  "title": "Event Title",
  "periodId": { "$oid": "..." },
  "date": {
    "year": 1945,
    "month": 8,
    "day": 19
  },
  "location": {
    "name": "Hanoi",
    "coordinates": {
      "lat": 21.0285,
      "lng": 105.8542
    }
  },
  "description": "Full description...",
  "shortDescription": "Brief summary..."
}
```

**Required Fields:**
- `title`
- `periodId`
- `date` (with at least `year`)

**Response (201):**
```json
{
  "_id": { "$oid": "..." },
  "title": "Event Title",
  ...
}
```

**Error Response (400):**
```json
{
  "error": "Title, periodId, and date are required"
}
```

### PUT /api/events/:id

Update an existing event.

**Parameters:**
- `id`: MongoDB ObjectId of the event

**Request Body:**
```json
{
  "title": "Updated Title",
  "description": "Updated description..."
}
```

**Response:**
```json
{
  "message": "Event updated successfully"
}
```

**Error Response (404):**
```json
{
  "error": "Event not found"
}
```

### DELETE /api/events/:id

Delete an event.

**Parameters:**
- `id`: MongoDB ObjectId of the event

**Response:**
```json
{
  "message": "Event deleted successfully"
}
```

**Error Response (404):**
```json
{
  "error": "Event not found"
}
```

---

## Statistics

### GET /api/stats

Get database statistics.

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

### 404 Not Found
Resource not found (event, period, etc.).

### 500 Internal Server Error
Server or database error.

**Standard Error Response Format:**
```json
{
  "error": "Error message description"
}
```

---

## Data Types

### MongoDB ObjectId

ObjectIds are represented as:
```json
{
  "$oid": "507f1f77bcf86cd799439011"
}
```

Or as plain strings in some contexts:
```json
"507f1f77bcf86cd799439011"
```

### Date Format

Dates use a custom format:
```json
{
  "year": 1945,      // Integer, negative for BC
  "month": 8,        // Integer 0-11 (null if not specified)
  "day": 19,         // Integer 1-31 (null if not specified)
  "displayDate": "August 19, 1945 AD"  // Formatted string
}
```

### Location Format

Locations include name and coordinates:
```json
{
  "name": "Hanoi",
  "province": "Hanoi",
  "coordinates": {
    "lat": 21.0285,  // Latitude (float)
    "lng": 105.8542   // Longitude (float)
  }
}
```

---

## Rate Limiting

Currently, there are no rate limits implemented. For production use, consider implementing rate limiting to prevent abuse.

---

## CORS

The API supports Cross-Origin Resource Sharing (CORS) and accepts requests from all origins in development mode.

---

## Examples

### JavaScript Fetch

```javascript
// Get all events
fetch('http://localhost:3000/api/events')
  .then(response => response.json())
  .then(data => console.log(data))
  .catch(error => console.error('Error:', error));

// Search events
fetch('http://localhost:3000/api/events/search?q=battle')
  .then(response => response.json())
  .then(data => console.log(data));

// Get events by year range
fetch('http://localhost:3000/api/events/range?start=1945&end=1975')
  .then(response => response.json())
  .then(data => console.log(data));
```

### cURL

```bash
# Get all periods
curl http://localhost:3000/api/periods

# Get specific event
curl http://localhost:3000/api/events/507f1f77bcf86cd799439011

# Search events
curl "http://localhost:3000/api/events/search?q=battle"

# Create new event (POST)
curl -X POST http://localhost:3000/api/events \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Test Event",
    "periodId": {"$oid": "507f1f77bcf86cd799439011"},
    "date": {"year": 1945}
  }'
```

---

## Future Enhancements

Planned API improvements:

- [ ] Authentication and authorization
- [ ] Rate limiting
- [ ] Pagination for large result sets
- [ ] Filtering with multiple parameters
- [ ] Sorting options
- [ ] API versioning
- [ ] WebSocket support for real-time updates
- [ ] GraphQL endpoint