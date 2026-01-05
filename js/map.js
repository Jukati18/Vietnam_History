// Vietnamese History Interactive Map
// Updated version with periods/subPeriods filtering and location mapping

// Configuration
const API_URL = 'http://localhost:3000/api';

// Vietnam Location Coordinates Mapping
const LOCATION_MAP = {
    // Northern Vietnam (y: 20-220)
    'Hà Nội': { x: 150, y: 150 },
    'Hanoi': { x: 150, y: 150 },
    'Thăng Long': { x: 150, y: 150 },
    'Phú Thọ': { x: 140, y: 120 },
    'Phong Châu': { x: 140, y: 120 },
    'Bạch Đằng': { x: 165, y: 170 },
    'Điện Biên Phủ': { x: 120, y: 90 },
    'Cao Bằng': { x: 155, y: 60 },
    
    // North-Central (y: 220-400)
    'Thanh Hóa': { x: 145, y: 260 },
    'Nghệ An': { x: 140, y: 320 },
    'Hà Tĩnh': { x: 145, y: 360 },
    
    // Central (y: 400-550)
    'Huế': { x: 155, y: 430 },
    'Thừa Thiên Huế': { x: 155, y: 430 },
    'Đà Nẵng': { x: 160, y: 460 },
    'Quảng Nam': { x: 158, y: 490 },
    'Hội An': { x: 158, y: 495 },
    
    // South-Central (y: 550-700)
    'Quy Nhơn': { x: 165, y: 580 },
    'Nha Trang': { x: 168, y: 630 },
    'Đà Lạt': { x: 155, y: 650 },
    
    // Southern (y: 700-790)
    'Sài Gòn': { x: 145, y: 740 },
    'Saigon': { x: 145, y: 740 },
    'Hồ Chí Minh': { x: 145, y: 740 },
    'Cần Thơ': { x: 135, y: 770 },
    'Cà Mau': { x: 128, y: 785 },
    
    // Default
    'Vietnam': { x: 150, y: 400 },
    'Việt Nam': { x: 150, y: 400 }
};

// State
let periods = [];
let subPeriods = [];
let events = [];
let currentZoom = 1;
let selectedPeriodId = null;
let selectedSubPeriodId = null;
let currentEventId = null;

// Initialize
document.addEventListener('DOMContentLoaded', async () => {
    await loadAllData();
    initializeEventListeners();
});

// Load data from JSON files
async function loadAllData() {
    try {
        // Load periods
        const periodsResponse = await fetch('js/Vietnam_History.periods.json');
        periods = await periodsResponse.json();
        
        // Load subPeriods
        const subPeriodsResponse = await fetch('js/Vietnam_History.subPeriods.json');
        subPeriods = await subPeriodsResponse.json();
        
        // Load events (sample - replace with your events file)
        const eventsResponse = await fetch('js/Vietnam_History.events.json');
        events = await eventsResponse.json();
        
        // Initialize UI
        renderMainPeriods();
        console.log('✅ Data loaded successfully');
        
    } catch (error) {
        console.error('Error loading data:', error);
        // Use fallback data if files not found
        initializeFallbackData();
    }
}

// Initialize with fallback data if JSON files not available
function initializeFallbackData() {
    // This will be called if JSON files aren't found
    console.log('Using fallback data');
}

// Render main period filter buttons
function renderMainPeriods() {
    const container = document.getElementById('mainPeriodsFilter');
    container.innerHTML = '';
    
    // Sort periods by order
    const sortedPeriods = [...periods].sort((a, b) => a.order - b.order);
    
    sortedPeriods.forEach(period => {
        const button = document.createElement('button');
        button.className = 'filter-btn';
        button.textContent = period.name;
        button.dataset.periodId = period._id.$oid;
        button.style.background = period.color || '#94a3b8';
        
        button.addEventListener('click', () => selectMainPeriod(period));
        
        container.appendChild(button);
    });
}

// Select main period
function selectMainPeriod(period) {
    selectedPeriodId = period._id.$oid;
    
    // Update button states
    document.querySelectorAll('#mainPeriodsFilter .filter-btn').forEach(btn => {
        btn.classList.remove('active');
        if (btn.dataset.periodId === selectedPeriodId) {
            btn.classList.add('active');
        }
    });
    
    // Render sub-periods for this period
    renderSubPeriods(selectedPeriodId);
    
    // Reset sub-period selection
    selectedSubPeriodId = null;
    
    // Update map
    updateMapDisplay();
}

// Render sub-period filter buttons
function renderSubPeriods(periodId) {
    const container = document.getElementById('subPeriodsFilter');
    container.innerHTML = '';
    
    // Filter sub-periods by selected period
    const filteredSubPeriods = subPeriods.filter(sp => {
        return sp.periodId && sp.periodId.$oid === periodId;
    });
    
    if (filteredSubPeriods.length === 0) {
        container.innerHTML = '<span class="filter-placeholder">No sub-periods available for this period</span>';
        return;
    }
    
    // Sort by order
    const sortedSubPeriods = [...filteredSubPeriods].sort((a, b) => a.order - b.order);
    
    sortedSubPeriods.forEach(subPeriod => {
        const button = document.createElement('button');
        button.className = 'filter-btn';
        button.textContent = subPeriod.name;
        button.dataset.subPeriodId = subPeriod._id.$oid;
        
        // Use parent period color if subPeriod doesn't have one
        const parentPeriod = periods.find(p => p._id.$oid === periodId);
        button.style.background = subPeriod.color || parentPeriod?.color || '#94a3b8';
        
        button.addEventListener('click', () => selectSubPeriod(subPeriod));
        
        container.appendChild(button);
    });
}

// Select sub-period
function selectSubPeriod(subPeriod) {
    selectedSubPeriodId = subPeriod._id.$oid;
    
    // Update button states
    document.querySelectorAll('#subPeriodsFilter .filter-btn').forEach(btn => {
        btn.classList.remove('active');
        if (btn.dataset.subPeriodId === selectedSubPeriodId) {
            btn.classList.add('active');
        }
    });
    
    // Update map
    updateMapDisplay();
}

// Update map display based on selected filters
function updateMapDisplay() {
    // Filter events based on selections
    let filteredEvents = events;
    
    if (selectedPeriodId) {
        filteredEvents = filteredEvents.filter(event => {
            return event.periodId && event.periodId.$oid === selectedPeriodId;
        });
    }
    
    if (selectedSubPeriodId) {
        filteredEvents = filteredEvents.filter(event => {
            return event.subPeriodId && event.subPeriodId.$oid === selectedSubPeriodId;
        });
    }
    
    // Render markers
    renderEventMarkers(filteredEvents);
    
    // Update annotations
    renderAnnotations(filteredEvents);
}

// Convert location to coordinates
function getCoordinatesFromLocation(location) {
    if (!location) return null;
    
    // If location already has coordinates
    if (location.coordinates) {
        // Scale from lat/lng to SVG coordinates
        // Vietnam spans approximately 8°N to 24°N, 102°E to 110°E
        const lat = location.coordinates.lat;
        const lng = location.coordinates.lng;
        
        // Map to SVG viewBox (600 x 1200)
        const x = ((lng - 102) / 8) * 200 + 250; // Adjust for width
        const y = ((24 - lat) / 16) * 1000 + 100; // Adjust for height (inverted)
        
        return { x, y };
    }
    
    // Try to find location in map
    const locationName = location.name || location.modernName || location;
    
    // Direct match
    if (LOCATION_MAP[locationName]) {
        return LOCATION_MAP[locationName];
    }
    
    // Try province
    if (location.province && LOCATION_MAP[location.province]) {
        return LOCATION_MAP[location.province];
    }
    
    // Search for partial match
    const keys = Object.keys(LOCATION_MAP);
    for (let key of keys) {
        if (locationName.includes(key) || key.includes(locationName)) {
            return LOCATION_MAP[key];
        }
    }
    
    // Default fallback
    console.warn('Location not found in map:', locationName);
    return LOCATION_MAP['Vietnam'];
}

// Render event markers on map
function renderEventMarkers(filteredEvents) {
    const markersGroup = document.getElementById('eventMarkers');
    markersGroup.innerHTML = '';
    
    filteredEvents.forEach(event => {
        const coords = getCoordinatesFromLocation(event.location);
        if (!coords) return;
        
        const marker = createEventMarker(event, coords);
        markersGroup.appendChild(marker);
    });
}

// Create event marker SVG element
function createEventMarker(event, coords) {
    const g = document.createElementNS('http://www.w3.org/2000/svg', 'g');
    g.classList.add('event-marker');
    g.setAttribute('data-event-id', event._id?.$oid || event.id);
    
    // Get color from period
    const period = periods.find(p => p._id.$oid === event.periodId?.$oid);
    const color = period?.color || '#667eea';
    
    // Pulsing circle
    const pulseCircle = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
    pulseCircle.setAttribute('cx', coords.x);
    pulseCircle.setAttribute('cy', coords.y);
    pulseCircle.setAttribute('r', '12');
    pulseCircle.setAttribute('fill', color);
    pulseCircle.setAttribute('opacity', '0.3');
    pulseCircle.classList.add('marker-pulse');
    
    // Main marker
    const circle = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
    circle.setAttribute('cx', coords.x);
    circle.setAttribute('cy', coords.y);
    circle.setAttribute('r', '10');
    circle.setAttribute('fill', color);
    
    g.appendChild(pulseCircle);
    g.appendChild(circle);
    
    // Add click event
    g.addEventListener('click', (e) => {
        e.stopPropagation();
        showEventPopup(event, coords);
    });
    
    return g;
}

// Show event popup
function showEventPopup(event, coords) {
    const popup = document.getElementById('eventPopup');
    currentEventId = event._id?.$oid || event.id;
    
    // Get period name
    const period = periods.find(p => p._id.$oid === event.periodId?.$oid);
    const subPeriod = subPeriods.find(sp => sp._id.$oid === event.subPeriodId?.$oid);
    
    // Update popup content
    document.getElementById('popupTitle').textContent = event.title || event.titleVietnamese;
    document.getElementById('popupPeriod').textContent = period?.name || 'Unknown Period';
    document.getElementById('popupDate').textContent = `📅 ${event.date?.displayDate || event.date?.year || 'Unknown'}`;
    
    const locationText = event.location?.name || event.location?.province || 'Unknown Location';
    document.getElementById('popupLocation').textContent = `📍 ${locationText}`;
    
    document.getElementById('popupDescription').textContent = 
        event.shortDescription || event.description || 'No description available';
    
    // Position popup relative to marker
    const mapWrapper = document.getElementById('mapWrapper');
    const mapRect = mapWrapper.getBoundingClientRect();
    const svgRect = document.getElementById('vietnamMap').getBoundingClientRect();
    
    // Calculate position
    const scaleX = svgRect.width / 600;
    const scaleY = svgRect.height / 1200;
    
    const left = coords.x * scaleX + (svgRect.left - mapRect.left);
    const top = coords.y * scaleY + (svgRect.top - mapRect.top) - 10;
    
    popup.style.left = left + 'px';
    popup.style.top = top + 'px';
    popup.style.transform = 'translate(-50%, -100%)';
    popup.classList.add('active');
}

// Close popup
function closePopup() {
    document.getElementById('eventPopup').classList.remove('active');
    currentEventId = null;
}

// Render annotations list
function renderAnnotations(filteredEvents) {
    const container = document.getElementById('annotationsList');
    container.innerHTML = '';
    
    if (filteredEvents.length === 0) {
        container.innerHTML = '<div class="no-events-message">No events to display. Select a period to see events.</div>';
        return;
    }
    
    // Sort by year
    const sortedEvents = [...filteredEvents].sort((a, b) => {
        const yearA = a.date?.year || 0;
        const yearB = b.date?.year || 0;
        return yearA - yearB;
    });
    
    sortedEvents.forEach(event => {
        const period = periods.find(p => p._id.$oid === event.periodId?.$oid);
        const color = period?.color || '#667eea';
        
        const item = document.createElement('div');
        item.className = 'annotation-item';
        item.dataset.eventId = event._id?.$oid || event.id;
        
        item.innerHTML = `
            <div class="annotation-color" style="background: ${color}"></div>
            <div class="annotation-text">
                <div class="annotation-name">${event.title || event.titleVietnamese}</div>
                <div class="annotation-date">${event.date?.displayDate || event.date?.year || 'Unknown'}</div>
            </div>
        `;
        
        item.addEventListener('click', () => {
            const coords = getCoordinatesFromLocation(event.location);
            if (coords) {
                showEventPopup(event, coords);
                
                // Scroll map to event
                const marker = document.querySelector(`[data-event-id="${event._id?.$oid || event.id}"]`);
                if (marker) {
                    marker.scrollIntoView({ behavior: 'smooth', block: 'center' });
                }
            }
        });
        
        container.appendChild(item);
    });
}

// Initialize event listeners
function initializeEventListeners() {
    // Map controls
    document.getElementById('zoomIn').addEventListener('click', zoomIn);
    document.getElementById('zoomOut').addEventListener('click', zoomOut);
    document.getElementById('resetView').addEventListener('click', resetView);
    
    // Popup close
    document.querySelector('.popup-close').addEventListener('click', closePopup);
    
    // Close popup when clicking outside
    document.getElementById('mapWrapper').addEventListener('click', (e) => {
        if (e.target.id === 'mapWrapper' || e.target.id === 'vietnamMap') {
            closePopup();
        }
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

// Search functionality
function handleSearch(e) {
    const query = e.target.value.trim().toLowerCase();
    const resultsContainer = document.getElementById('searchResults');
    
    if (query.length < 2) {
        resultsContainer.classList.remove('active');
        return;
    }
    
    const results = events.filter(event => 
        event.title?.toLowerCase().includes(query) ||
        event.titleVietnamese?.toLowerCase().includes(query) ||
        event.description?.toLowerCase().includes(query) ||
        event.shortDescription?.toLowerCase().includes(query)
    );
    
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
        const period = periods.find(p => p._id.$oid === event.periodId?.$oid);
        return `
            <div class="search-result-item" data-event-id="${event._id?.$oid || event.id}">
                <div class="search-result-title">${event.title || event.titleVietnamese}</div>
                <div class="search-result-info">${event.date?.displayDate || 'Unknown'} • ${period?.name || 'Unknown Period'}</div>
            </div>
        `;
    }).join('');
    
    resultsContainer.classList.add('active');
    
    // Add click handlers
    resultsContainer.querySelectorAll('.search-result-item').forEach(item => {
        item.addEventListener('click', () => {
            const eventId = item.dataset.eventId;
            const event = events.find(e => (e._id?.$oid || e.id) === eventId);
            if (event) {
                // Set filters
                if (event.periodId) {
                    const period = periods.find(p => p._id.$oid === event.periodId.$oid);
                    if (period) selectMainPeriod(period);
                }
                if (event.subPeriodId) {
                    const subPeriod = subPeriods.find(sp => sp._id.$oid === event.subPeriodId.$oid);
                    if (subPeriod) selectSubPeriod(subPeriod);
                }
                
                // Show popup
                const coords = getCoordinatesFromLocation(event.location);
                if (coords) showEventPopup(event, coords);
            }
            
            resultsContainer.classList.remove('active');
            document.getElementById('searchInput').value = '';
        });
    });
}

// Zoom functions
function zoomIn() {
    currentZoom = Math.min(currentZoom + 0.2, 2.5);
    applyZoom();
}

function zoomOut() {
    currentZoom = Math.max(currentZoom - 0.2, 0.5);
    applyZoom();
}

function resetView() {
    currentZoom = 1;
    applyZoom();
    closePopup();
}

function applyZoom() {
    const mapWrapper = document.getElementById('mapWrapper');
    const svg = document.getElementById('vietnamMap');
    
    // Scale the entire wrapper for better control
    mapWrapper.style.transform = `scale(${currentZoom})`;
    mapWrapper.style.transformOrigin = 'center center';
    
    // Also update the viewBox of the SVG if needed
    const baseViewBox = "0 0 300 800";
    if (currentZoom !== 1) {
        // Calculate new viewBox dimensions
        const scaleFactor = 1 / currentZoom;
        const [x, y, width, height] = baseViewBox.split(' ').map(Number);
        const newWidth = width * scaleFactor;
        const newHeight = height * scaleFactor;
        const newX = x + (width - newWidth) / 2;
        const newY = y + (height - newHeight) / 2;
        
        svg.setAttribute('viewBox', `${newX} ${newY} ${newWidth} ${newHeight}`);
    } else {
        svg.setAttribute('viewBox', baseViewBox);
    }
}

// View event details (placeholder)
function viewEventDetails() {
    if (currentEventId) {
        window.location.href = `event-detail.html?id=${currentEventId}`;
    }
}

// View on timeline (placeholder)
function viewOnTimeline() {
    if (currentEventId) {
        window.location.href = `timeline.html?event=${currentEventId}`;
    }
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