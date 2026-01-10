// Vietnamese History Interactive Map with Leaflet & MongoDB Atlas
// API_BASE_URL is now defined in config.js
// It automatically detects local vs production
// Make sure config.js is loaded first in HTML

// Map State
let map;
let markers = [];
let periods = [];
let subPeriods = [];
let events = [];
let selectedPeriodId = null;
let selectedSubPeriodId = null;

// Vietnam center coordinates
const VIETNAM_CENTER = [16.0544, 107.8569];
const VIETNAM_BOUNDS = [
    [8.1790665, 102.14441], // Southwest
    [23.393395, 109.469229]  // Northeast
];

// Initialize when DOM is ready
document.addEventListener('DOMContentLoaded', async () => {
    initializeMap();
    await loadAllData();
    initializeEventListeners();
    
    // Check if there's a selected event from detail page
    checkForSelectedEvent();
});

// Initialize Leaflet Map
function initializeMap() {
    // Create map centered on Vietnam
    map = L.map('map', {
        center: VIETNAM_CENTER,
        zoom: 6,
        minZoom: 5,
        maxZoom: 18,
        maxBounds: [
            [5, 100],  // Southwest bound
            [25, 112]  // Northeast bound
        ]
    });

    // Add OpenStreetMap tiles
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
        maxZoom: 19
    }).addTo(map);

    // Fit map to Vietnam bounds
    map.fitBounds(VIETNAM_BOUNDS);

    console.log('✅ Map initialized');
}

// Check for selected event from detail page
function checkForSelectedEvent() {
    const selectedEventData = sessionStorage.getItem('selectedEvent');
    
    if (selectedEventData) {
        try {
            const eventData = JSON.parse(selectedEventData);
            console.log('Selected event from detail page:', eventData);
            
            // Find the event in our loaded events
            const event = events.find(e => getObjectId(e._id) === eventData.id);
            
            if (event) {
                // Show only this event
                showSingleEvent(event);
            }
            
            // Clear the sessionStorage
            sessionStorage.removeItem('selectedEvent');
        } catch (error) {
            console.error('Error parsing selected event:', error);
        }
    }
}

// Show single event on map (from search or detail page)
function showSingleEvent(event) {
    const coords = getEventCoordinates(event);
    
    if (!coords) {
        alert('This event does not have location coordinates.');
        return;
    }
    
    // Clear all existing markers
    clearMarkers();
    
    // Get event details
    const period = periods.find(p => (p._id.$oid || p._id) === (event.periodId?.$oid || event.periodId));
    const color = period?.color || '#667eea';
    
    // Create custom icon
    const icon = L.divIcon({
        className: 'custom-marker',
        html: `<div class="marker-icon" style="background: ${color};">📍</div>`,
        iconSize: [32, 32],
        iconAnchor: [16, 32],
        popupAnchor: [0, -32]
    });
    
    // Create marker for this event only
    const marker = L.marker([coords.lat, coords.lng], { icon })
        .addTo(map)
        .bindPopup(createPopupContent(event, period))
        .openPopup(); // Automatically open popup
    
    markers.push(marker);
    
    // Zoom to this event (closer zoom level)
    map.setView([coords.lat, coords.lng], 12);
    
    // Update annotations to show only this event
    renderAnnotations([event]);
    document.getElementById('visibleCount').textContent = '1';
}

// Helper function to get ID from MongoDB object
function getObjectId(obj) {
    if (!obj) return null;
    if (typeof obj === 'string') return obj;
    if (obj.$oid) return obj.$oid;
    if (obj._id) {
        if (typeof obj._id === 'string') return obj._id;
        if (obj._id.$oid) return obj._id.$oid;
    }
    return String(obj);
}

// Load all data from MongoDB Atlas via backend API
async function loadAllData() {
    const loadingIndicator = document.getElementById('loadingIndicator');
    
    try {
        loadingIndicator.classList.remove('hidden');
        
        // Load periods
        const periodsResponse = await fetch(`${API_URL}/periods`);
        if (periodsResponse.ok) {
            periods = await periodsResponse.json();
            renderMainPeriods();
        }
        
        // Load subPeriods
        const subPeriodsResponse = await fetch(`${API_URL}/subperiods`);
        if (subPeriodsResponse.ok) {
            subPeriods = await subPeriodsResponse.json();
        }
        
        // Load all events
        const eventsResponse = await fetch(`${API_URL}/events`);
        if (eventsResponse.ok) {
            events = await eventsResponse.json();
            console.log(`✅ Loaded ${events.length} events from database`);
        }
        
        loadingIndicator.classList.add('hidden');
        
    } catch (error) {
        console.error('Error loading data:', error);
        loadingIndicator.innerHTML = `
            <div style="color: #ef4444;">
                <p>⚠️ Unable to connect to database</p>
                <p style="font-size: 12px; margin-top: 10px;">Make sure your backend server is running</p>
            </div>
        `;
    }
}

// Render main period filter buttons
function renderMainPeriods() {
    const container = document.getElementById('mainPeriodsFilter');
    container.innerHTML = '';
    
    const sortedPeriods = [...periods].sort((a, b) => a.order - b.order);
    
    sortedPeriods.forEach(period => {
        const button = document.createElement('button');
        button.className = 'filter-btn';
        button.textContent = period.name;
        button.dataset.periodId = period._id.$oid || period._id;
        button.style.background = period.color || '#94a3b8';
        
        button.addEventListener('click', () => selectMainPeriod(period));
        container.appendChild(button);
    });
}

// Select main period
function selectMainPeriod(period) {
    selectedPeriodId = period._id.$oid || period._id;
    
    document.querySelectorAll('#mainPeriodsFilter .filter-btn').forEach(btn => {
        btn.classList.remove('active');
        if (btn.dataset.periodId === selectedPeriodId) {
            btn.classList.add('active');
        }
    });
    
    renderSubPeriods(selectedPeriodId);
    selectedSubPeriodId = null;
    updateMapDisplay();
}

// Render sub-period filter buttons
function renderSubPeriods(periodId) {
    const container = document.getElementById('subPeriodsFilter');
    container.innerHTML = '';
    
    const filteredSubPeriods = subPeriods.filter(sp => {
        const spPeriodId = sp.periodId?.$oid || sp.periodId;
        return spPeriodId === periodId;
    });
    
    if (filteredSubPeriods.length === 0) {
        container.innerHTML = '<span class="filter-placeholder">No sub-periods for this period</span>';
        return;
    }
    
    const sortedSubPeriods = [...filteredSubPeriods].sort((a, b) => a.order - b.order);
    
    sortedSubPeriods.forEach(subPeriod => {
        const button = document.createElement('button');
        button.className = 'filter-btn';
        button.textContent = subPeriod.name;
        button.dataset.subPeriodId = subPeriod._id.$oid || subPeriod._id;
        
        const parentPeriod = periods.find(p => (p._id.$oid || p._id) === periodId);
        button.style.background = subPeriod.color || parentPeriod?.color || '#94a3b8';
        
        button.addEventListener('click', () => selectSubPeriod(subPeriod));
        container.appendChild(button);
    });
}

// Select sub-period
function selectSubPeriod(subPeriod) {
    selectedSubPeriodId = subPeriod._id.$oid || subPeriod._id;
    
    document.querySelectorAll('#subPeriodsFilter .filter-btn').forEach(btn => {
        btn.classList.remove('active');
        if (btn.dataset.subPeriodId === selectedSubPeriodId) {
            btn.classList.add('active');
        }
    });
    
    updateMapDisplay();
}

// Update map display based on filters
function updateMapDisplay() {
    let filteredEvents = events;
    
    if (selectedPeriodId) {
        filteredEvents = filteredEvents.filter(event => {
            const eventPeriodId = event.periodId?.$oid || event.periodId;
            return eventPeriodId === selectedPeriodId;
        });
    }
    
    if (selectedSubPeriodId) {
        filteredEvents = filteredEvents.filter(event => {
            const eventSubPeriodId = event.subPeriodId?.$oid || event.subPeriodId;
            return eventSubPeriodId === selectedSubPeriodId;
        });
    }
    
    renderEventMarkers(filteredEvents);
    renderAnnotations(filteredEvents);
    
    // Update visible count
    document.getElementById('visibleCount').textContent = filteredEvents.length;
}

// Clear all markers from map
function clearMarkers() {
    markers.forEach(marker => map.removeLayer(marker));
    markers = [];
}

// Render event markers on Leaflet map
function renderEventMarkers(filteredEvents) {
    clearMarkers();
    
    filteredEvents.forEach(event => {
        const coords = getEventCoordinates(event);
        if (!coords) {
            console.warn('No coordinates for event:', event.title);
            return;
        }
        
        const period = periods.find(p => (p._id.$oid || p._id) === (event.periodId?.$oid || event.periodId));
        const color = period?.color || '#667eea';
        
        // Create custom icon
        const icon = L.divIcon({
            className: 'custom-marker',
            html: `<div class="marker-icon" style="background: ${color};">📍</div>`,
            iconSize: [32, 32],
            iconAnchor: [16, 32],
            popupAnchor: [0, -32]
        });
        
        // Create marker
        const marker = L.marker([coords.lat, coords.lng], { icon })
            .addTo(map)
            .bindPopup(createPopupContent(event, period));
        
        markers.push(marker);
    });
    
    // Fit map to show all markers
    if (markers.length > 0) {
        const group = L.featureGroup(markers);
        map.fitBounds(group.getBounds().pad(0.1));
    }
}

// Get coordinates from event
function getEventCoordinates(event) {
    // Check if event has coordinates
    if (event.location?.coordinates) {
        return {
            lat: event.location.coordinates.lat,
            lng: event.location.coordinates.lng
        };
    }
    
    // Try to get from location name
    const locationName = event.location?.name || event.location?.province;
    if (locationName) {
        console.warn(`Event "${event.title}" has no coordinates. Add lat/lng to location.`);
    }
    
    return null;
}

// Create popup content HTML
function createPopupContent(event, period) {
    const title = event.title || event.titleVietnamese || 'Unknown Event';
    const periodName = period?.name || 'Unknown Period';
    const date = event.date?.displayDate || event.date?.year || 'Unknown Date';
    const location = event.location?.name || event.location?.province || 'Unknown Location';
    const description = event.shortDescription || event.description || 'No description available';
    const eventId = event._id?.$oid || event._id;
    
    return `
        <div class="event-popup-content">
            <div class="event-popup-title">${title}</div>
            <div class="event-popup-period">${periodName}</div>
            <div class="event-popup-date">📅 ${date}</div>
            <div class="event-popup-location">📍 ${location}</div>
            <div class="event-popup-description">${description}</div>
            <div class="event-popup-actions">
                <button class="event-popup-btn primary" onclick="viewEventDetails('${eventId}')">
                    View Details
                </button>
            </div>
        </div>
    `;
}

// Render annotations list
function renderAnnotations(filteredEvents) {
    const container = document.getElementById('annotationsList');
    container.innerHTML = '';
    
    if (filteredEvents.length === 0) {
        container.innerHTML = '<div class="no-events-message">No events to display. Select a period to see events.</div>';
        return;
    }
    
    const sortedEvents = [...filteredEvents].sort((a, b) => {
        const yearA = a.date?.year || 0;
        const yearB = b.date?.year || 0;
        return yearA - yearB;
    });
    
    sortedEvents.forEach(event => {
        const period = periods.find(p => (p._id.$oid || p._id) === (event.periodId?.$oid || event.periodId));
        const color = period?.color || '#667eea';
        const coords = getEventCoordinates(event);
        
        const item = document.createElement('div');
        item.className = 'annotation-item';
        
        item.innerHTML = `
            <div class="annotation-color" style="background: ${color}"></div>
            <div class="annotation-text">
                <div class="annotation-name">${event.title || event.titleVietnamese}</div>
                <div class="annotation-date">${event.date?.displayDate || event.date?.year || 'Unknown'}</div>
            </div>
        `;
        
        if (coords) {
            item.addEventListener('click', () => {
                map.setView([coords.lat, coords.lng], 10);
                const marker = markers.find(m => {
                    const pos = m.getLatLng();
                    return pos.lat === coords.lat && pos.lng === coords.lng;
                });
                if (marker) marker.openPopup();
            });
        }
        
        container.appendChild(item);
    });
}

// Initialize event listeners
function initializeEventListeners() {
    // Map controls
    document.getElementById('centerVietnam').addEventListener('click', () => {
        map.setView(VIETNAM_CENTER, 6);
    });
    
    document.getElementById('resetFilters').addEventListener('click', () => {
        selectedPeriodId = null;
        selectedSubPeriodId = null;
        
        document.querySelectorAll('.filter-btn').forEach(btn => btn.classList.remove('active'));
        document.getElementById('subPeriodsFilter').innerHTML = '<span class="filter-placeholder">Select a main period first</span>';
        
        clearMarkers();
        document.getElementById('annotationsList').innerHTML = '<div class="no-events-message">Select a period to see events on the map</div>';
        document.getElementById('visibleCount').textContent = '0';
        
        map.setView(VIETNAM_CENTER, 6);
    });
    
    // Search
    const searchInput = document.getElementById('searchInput');
    searchInput.addEventListener('input', debounce(handleSearch, 300));
    
    document.addEventListener('click', (e) => {
        if (!e.target.closest('.search-container')) {
            document.getElementById('searchResults').classList.remove('active');
        }
    });
}

// Search functionality with improved algorithm
function handleSearch(e) {
    const query = e.target.value.trim().toLowerCase();
    const resultsContainer = document.getElementById('searchResults');
    
    if (query.length < 2) {
        resultsContainer.classList.remove('active');
        return;
    }
    
    // Improved search algorithm with relevance scoring
    const results = events.map(event => {
        let score = 0;
        const title = (event.title || '').toLowerCase();
        const titleVi = (event.titleVietnamese || '').toLowerCase();
        const desc = (event.description || '').toLowerCase();
        const shortDesc = (event.shortDescription || '').toLowerCase();
        
        // Exact title match - highest priority
        if (title === query || titleVi === query) {
            score = 1000;
        }
        // Title starts with query - high priority
        else if (title.startsWith(query) || titleVi.startsWith(query)) {
            score = 500;
        }
        // Title contains query - medium priority
        else if (title.includes(query) || titleVi.includes(query)) {
            score = 300;
        }
        // Description contains query - lower priority
        else if (shortDesc.includes(query)) {
            score = 100;
        }
        else if (desc.includes(query)) {
            score = 50;
        }
        
        return { event, score };
    })
    .filter(item => item.score > 0) // Only keep matches
    .sort((a, b) => b.score - a.score) // Sort by relevance
    .map(item => item.event);
    
    displaySearchResults(results);
}

// Display search results
function displaySearchResults(results) {
    const resultsContainer = document.getElementById('searchResults');
    
    if (results.length === 0) {
        resultsContainer.innerHTML = '<div style="padding: 20px; text-align: center; color: #94a3b8;">No events found</div>';
        resultsContainer.classList.add('active');
        return;
    }
    
    resultsContainer.innerHTML = results.slice(0, 8).map(event => {
        const period = periods.find(p => (p._id.$oid || p._id) === (event.periodId?.$oid || event.periodId));
        return `
            <div class="search-result-item" data-event-id="${event._id?.$oid || event._id}">
                <div class="search-result-title">${event.title || event.titleVietnamese}</div>
                <div class="search-result-info">${event.date?.displayDate || 'Unknown'} • ${period?.name || 'Unknown Period'}</div>
            </div>
        `;
    }).join('');
    
    resultsContainer.classList.add('active');
    
    // Add click handlers to show only the selected event
    resultsContainer.querySelectorAll('.search-result-item').forEach(item => {
        item.addEventListener('click', () => {
            const eventId = item.dataset.eventId;
            const event = events.find(e => (e._id?.$oid || e._id) === eventId);
            
            if (event) {
                // Clear all filters
                selectedPeriodId = null;
                selectedSubPeriodId = null;
                document.querySelectorAll('.filter-btn').forEach(btn => btn.classList.remove('active'));
                
                // Show only this event on map
                showSingleEvent(event);
            }
            
            resultsContainer.classList.remove('active');
            document.getElementById('searchInput').value = '';
        });
    });
}

// View event details (placeholder)
function viewEventDetails(eventId) {
    window.location.href = `events-detail.html?id=${eventId}`;
}

// View on timeline (placeholder)
function viewOnTimeline(eventId) {
    window.location.href = `timeline.html?event=${eventId}`;
}

// Utility: Debounce
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}