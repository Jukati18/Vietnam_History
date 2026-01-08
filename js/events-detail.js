// Vietnamese History Event Detail Page - JavaScript
// API Configuration
const API_BASE_URL = 'http://localhost:3000/api';

// Global State
let currentEvent = null;
let allPeriods = [];
let allEvents = [];

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

// Initialize on page load
document.addEventListener('DOMContentLoaded', () => {
    console.log('Event detail page loaded, initializing...');
    
    // Get event ID from URL
    const urlParams = new URLSearchParams(window.location.search);
    const eventId = urlParams.get('id');
    
    if (!eventId) {
        showError('No event ID provided');
        return;
    }
    
    console.log('Loading event:', eventId);
    loadEventData(eventId);
    setupEventListeners();
});

// ============================================
// DATA LOADING
// ============================================

async function loadEventData(eventId) {
    try {
        showLoading(true);

        // Load event, periods, and all events in parallel
        const [eventData, periodsData, eventsData] = await Promise.all([
            fetchAPI(`/events/${eventId}`),
            fetchAPI('/periods'),
            fetchAPI('/events')
        ]);

        if (!eventData || !eventData._id) {
            throw new Error('Event not found');
        }

        currentEvent = eventData;
        allPeriods = Array.isArray(periodsData) ? periodsData : [];
        allEvents = Array.isArray(eventsData) ? eventsData : [];

        console.log('Event data loaded successfully:', currentEvent);

        // Render the event detail
        renderEventDetail();
        
        showLoading(false);
        document.getElementById('detailPage').style.display = 'block';
        
    } catch (error) {
        console.error('Error loading event data:', error);
        showError('Failed to load event details: ' + error.message);
        showLoading(false);
    }
}

async function fetchAPI(endpoint) {
    try {
        console.log(`Fetching: ${API_BASE_URL}${endpoint}`);
        const response = await fetch(`${API_BASE_URL}${endpoint}`);
        
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const data = await response.json();
        console.log(`Received ${endpoint}:`, data);
        return data;
    } catch (error) {
        console.error(`Error fetching ${endpoint}:`, error);
        throw error;
    }
}

// ============================================
// UI RENDERING
// ============================================

function renderEventDetail() {
    if (!currentEvent) return;

    // Update page title
    document.title = `${currentEvent.title || 'Event Detail'} - Vietnamese History`;

    // Update breadcrumb
    const breadcrumbName = document.getElementById('breadcrumbEventName');
    if (breadcrumbName) {
        breadcrumbName.textContent = currentEvent.title || 'Event';
    }

    // Get period information
    const periodId = getObjectId(currentEvent.periodId);
    const period = allPeriods.find(p => getObjectId(p._id) === periodId);
    const periodName = period ? period.name : 'Unknown Period';

    // Format dates
    const dateText = formatEventDate(currentEvent.date);
    const dateTextFull = formatEventDateFull(currentEvent.date);

    // Get location
    const location = currentEvent.location?.name || currentEvent.location?.province || 'Unknown Location';

    // Update hero section
    document.getElementById('detailTitle').textContent = currentEvent.title || 'Untitled Event';
    
    const titleViElement = document.getElementById('detailTitleVi');
    if (currentEvent.titleVietnamese) {
        titleViElement.textContent = currentEvent.titleVietnamese;
        titleViElement.style.display = 'block';
    } else {
        titleViElement.style.display = 'none';
    }

    document.getElementById('detailDate').textContent = `📅 ${dateText}`;
    document.getElementById('detailLocation').textContent = `📍 ${location}`;
    document.getElementById('detailPeriod').textContent = `👑 ${periodName}`;

    // Update sidebar information
    document.getElementById('sidebarDate').textContent = dateTextFull;
    document.getElementById('sidebarLocation').textContent = location;
    document.getElementById('sidebarPeriod').textContent = periodName;

    // Update type if available
    if (currentEvent.type) {
        document.getElementById('sidebarType').textContent = currentEvent.type;
        document.getElementById('sidebarTypeItem').style.display = 'block';
    } else {
        document.getElementById('sidebarTypeItem').style.display = 'none';
    }

    // Update description
    const descriptionEl = document.getElementById('detailDescription');
    if (currentEvent.description) {
        // Split description into paragraphs
        const paragraphs = currentEvent.description.split('\n\n');
        descriptionEl.innerHTML = paragraphs.map(p => `<p>${p}</p>`).join('');
    } else {
        descriptionEl.innerHTML = '<p>No description available.</p>';
    }

    // Update significance
    const significanceEl = document.getElementById('detailSignificance');
    const significanceSection = document.getElementById('significanceSection');
    if (currentEvent.significance) {
        const paragraphs = currentEvent.significance.split('\n\n');
        significanceEl.innerHTML = paragraphs.map(p => `<p>${p}</p>`).join('');
        significanceSection.style.display = 'block';
    } else {
        significanceSection.style.display = 'none';
    }

    // Render key figures if available
    renderKeyFigures();

    // Render related events
    renderRelatedEvents();

    // Render tags if available
    renderTags();

    console.log('Event detail rendered');
}

function renderKeyFigures() {
    const container = document.getElementById('keyFiguresContainer');
    const section = document.getElementById('keyFiguresSection');

    if (!currentEvent.keyFigures || currentEvent.keyFigures.length === 0) {
        section.style.display = 'none';
        return;
    }

    container.innerHTML = currentEvent.keyFigures.map(figure => `
        <div class="figure-card">
            <h4 class="figure-name">${figure.name || 'Unknown'}</h4>
            <p class="figure-role">${figure.role || 'Role not specified'}</p>
            <p class="figure-description">${figure.description || 'No description available.'}</p>
        </div>
    `).join('');

    section.style.display = 'block';
}

function renderRelatedEvents() {
    const container = document.getElementById('relatedEventsContainer');
    const section = document.getElementById('relatedEventsSection');

    if (!currentEvent) {
        section.style.display = 'none';
        return;
    }

    // Find related events from the same period
    const periodId = getObjectId(currentEvent.periodId);
    const currentEventId = getObjectId(currentEvent._id);
    
    const relatedEvents = allEvents
        .filter(event => {
            const eventPeriodId = getObjectId(event.periodId);
            const eventId = getObjectId(event._id);
            return eventPeriodId === periodId && eventId !== currentEventId;
        })
        .slice(0, 4); // Limit to 4 related events

    if (relatedEvents.length === 0) {
        section.style.display = 'none';
        return;
    }

    container.innerHTML = relatedEvents.map(event => {
        const eventId = getObjectId(event._id);
        const dateText = formatEventDate(event.date);
        const description = event.shortDescription || event.description || 'No description available';
        
        return `
            <div class="related-event-card" onclick="window.location.href='events-detail.html?id=${eventId}'">
                <div class="related-card-image"></div>
                <div class="related-card-content">
                    <div class="related-card-date">📅 ${dateText}</div>
                    <h4 class="related-card-title">${event.title || 'Untitled'}</h4>
                    <p class="related-card-description">${description}</p>
                </div>
            </div>
        `;
    }).join('');

    section.style.display = 'block';
}

function renderTags() {
    const container = document.getElementById('eventTags');
    const box = document.getElementById('tagsBox');

    if (!currentEvent.tags || currentEvent.tags.length === 0) {
        box.style.display = 'none';
        return;
    }

    container.innerHTML = currentEvent.tags.map(tag => 
        `<span class="card-tag">${tag}</span>`
    ).join('');

    box.style.display = 'block';
}

// ============================================
// EVENT LISTENERS
// ============================================

function setupEventListeners() {
    // View on Map button
    const viewOnMapBtn = document.getElementById('viewOnMapBtn');
    if (viewOnMapBtn) {
        viewOnMapBtn.addEventListener('click', viewOnMap);
    }

    // View on Timeline button
    const viewOnTimelineBtn = document.getElementById('viewOnTimelineBtn');
    if (viewOnTimelineBtn) {
        viewOnTimelineBtn.addEventListener('click', viewOnTimeline);
    }

    // Share button
    const shareBtn = document.getElementById('shareBtn');
    if (shareBtn) {
        shareBtn.addEventListener('click', shareEvent);
    }

    console.log('Event listeners set up');
}

function viewOnMap() {
    if (!currentEvent) return;

    const eventId = getObjectId(currentEvent._id);
    
    // Check if event has coordinates
    if (currentEvent.location?.coordinates?.lat && currentEvent.location?.coordinates?.lng) {
        // Store event data in sessionStorage to be picked up by map.html
        sessionStorage.setItem('selectedEvent', JSON.stringify({
            id: eventId,
            lat: currentEvent.location.coordinates.lat,
            lng: currentEvent.location.coordinates.lng,
            title: currentEvent.title,
            period: currentEvent.periodId
        }));
        
        // Redirect to map
        window.location.href = 'map.html';
    } else {
        alert('This event does not have location coordinates to display on the map.');
    }
}

function viewOnTimeline() {
    if (!currentEvent) return;

    const eventId = getObjectId(currentEvent._id);
    
    // Store event data in sessionStorage to be picked up by timeline.html
    sessionStorage.setItem('selectedTimelineEvent', JSON.stringify({
        id: eventId,
        year: currentEvent.date?.year,
        period: currentEvent.periodId
    }));
    
    // Redirect to timeline
    window.location.href = 'timeline.html';
}

function shareEvent() {
    if (!currentEvent) return;

    const url = window.location.href;
    const title = currentEvent.title || 'Vietnamese History Event';

    if (navigator.share) {
        // Use Web Share API if available
        navigator.share({
            title: title,
            text: currentEvent.shortDescription || currentEvent.description || '',
            url: url
        }).then(() => {
            console.log('Event shared successfully');
        }).catch((error) => {
            console.log('Error sharing:', error);
            fallbackShare(url);
        });
    } else {
        // Fallback: Copy to clipboard
        fallbackShare(url);
    }
}

function fallbackShare(url) {
    // Copy URL to clipboard
    navigator.clipboard.writeText(url).then(() => {
        alert('Link copied to clipboard!');
    }).catch(() => {
        // If clipboard API fails, show the URL
        prompt('Copy this link:', url);
    });
}

// ============================================
// HELPER FUNCTIONS
// ============================================

function formatEventDate(dateObj) {
    if (!dateObj || typeof dateObj.year !== 'number') {
        return 'Unknown date';
    }

    const year = dateObj.year;
    const absYear = Math.abs(year);
    const era = year < 0 ? ' BC' : ' AD';

    if (typeof dateObj.month === 'number' && typeof dateObj.day === 'number') {
        const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
                       'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
        return `${months[dateObj.month]} ${dateObj.day}, ${absYear}${era}`;
    } else if (typeof dateObj.month === 'number') {
        const months = ['January', 'February', 'March', 'April', 'May', 'June',
                       'July', 'August', 'September', 'October', 'November', 'December'];
        return `${months[dateObj.month]} ${absYear}${era}`;
    } else {
        return `${absYear}${era}`;
    }
}

function formatEventDateFull(dateObj) {
    if (!dateObj || typeof dateObj.year !== 'number') {
        return 'Unknown date';
    }

    const year = dateObj.year;
    const absYear = Math.abs(year);
    const era = year < 0 ? ' BC' : ' AD';

    if (typeof dateObj.month === 'number' && typeof dateObj.day === 'number') {
        const months = ['January', 'February', 'March', 'April', 'May', 'June',
                       'July', 'August', 'September', 'October', 'November', 'December'];
        return `${months[dateObj.month]} ${dateObj.day}, ${absYear}${era}`;
    } else if (typeof dateObj.month === 'number') {
        const months = ['January', 'February', 'March', 'April', 'May', 'June',
                       'July', 'August', 'September', 'October', 'November', 'December'];
        return `${months[dateObj.month]} ${absYear}${era}`;
    } else {
        return `${absYear}${era}`;
    }
}

function showLoading(show) {
    const loader = document.getElementById('loadingIndicator');
    if (loader) {
        if (show) {
            loader.classList.remove('hidden');
        } else {
            loader.classList.add('hidden');
        }
    }
}

function showError(message) {
    console.error('Error:', message);
    
    const errorEl = document.getElementById('errorMessage');
    if (errorEl) {
        errorEl.style.display = 'block';
    }
    
    const detailPage = document.getElementById('detailPage');
    if (detailPage) {
        detailPage.style.display = 'none';
    }
}

// Export for debugging
window.eventDetailDebug = {
    get currentEvent() { return currentEvent; },
    get allPeriods() { return allPeriods; },
    get allEvents() { return allEvents; },
    reloadEvent: () => {
        const urlParams = new URLSearchParams(window.location.search);
        const eventId = urlParams.get('id');
        if (eventId) loadEventData(eventId);
    }
};

console.log('events-detail.js loaded. Use eventDetailDebug in console for debugging.');