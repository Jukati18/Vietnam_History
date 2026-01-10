// Vietnamese History Events Page - JavaScript
// API_BASE_URL is now defined in config.js
// It automatically detects local vs production
// Make sure config.js is loaded first in HTML

// Global State
let allPeriods = [];
let allEvents = [];
let filteredEvents = [];
let selectedPeriodId = 'all';
let currentSort = 'date-asc';

// Available images in the images folder
const AVAILABLE_IMAGES = [
    'event1.png',
    'event2.png',
    'event3.png',
    'event4.png',
    'event5.png',
    'event6.png',
    'event7.png',
    'event8.png',
    'event9.png',
    'event10.png',
    'event11.png',
    'event12.png',
    'event13.png',
    'event14.png',
    'event15.png',
    'event16.png',
    'event17.png',
    'event18.png',
    'event19.png',
    'event20.png'
];

// Fallback gradient colors if image fails to load
const GRADIENT_FALLBACKS = [
    'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
    'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)',
    'linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)',
    'linear-gradient(135deg, #fa709a 0%, #fee140 100%)',
    'linear-gradient(135deg, #30cfd0 0%, #330867 100%)',
    'linear-gradient(135deg, #a8edea 0%, #fed6e3 100%)',
    'linear-gradient(135deg, #ff9a9e 0%, #fecfef 100%)',
    'linear-gradient(135deg, #ffecd2 0%, #fcb69f 100%)',
    'linear-gradient(135deg, #ff6e7f 0%, #bfe9ff 100%)'
];

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

// Simple hash function to convert string to number
function hashString(str) {
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
        const char = str.charCodeAt(i);
        hash = ((hash << 5) - hash) + char;
        hash = hash & hash; // Convert to 32-bit integer
    }
    return Math.abs(hash);
}

// Get consistent image for event based on event ID
function getEventImage(event) {
    const eventId = getObjectId(event._id);
    
    // Use hash of event ID to get consistent image index
    const hash = hashString(eventId);
    const imageIndex = hash % AVAILABLE_IMAGES.length;
    
    return `images/${AVAILABLE_IMAGES[imageIndex]}`;
}

// Get consistent fallback gradient based on event ID
function getFallbackGradient(event) {
    const eventId = getObjectId(event._id);
    const hash = hashString(eventId);
    return GRADIENT_FALLBACKS[hash % GRADIENT_FALLBACKS.length];
}

// Initialize on page load
document.addEventListener('DOMContentLoaded', () => {
    console.log('Events page loaded, initializing...');
    loadAllData();
    setupEventListeners();
});

// ============================================
// DATA LOADING
// ============================================

async function loadAllData() {
    try {
        console.log('Starting to load data from API...');
        showLoading(true);

        // Load periods and events in parallel
        const [periodsData, eventsData] = await Promise.all([
            fetchAPI('/periods'),
            fetchAPI('/events')
        ]);

        allPeriods = Array.isArray(periodsData) ? periodsData : [];
        allEvents = Array.isArray(eventsData) ? eventsData : [];
        filteredEvents = [...allEvents];

        console.log('Data loaded successfully:', {
            periods: allPeriods.length,
            events: allEvents.length
        });

        // Render UI components
        renderPeriodFilters();
        renderEvents();
        updateStats();

        showLoading(false);
        
        if (allEvents.length === 0) {
            showNoResults(true);
        }
    } catch (error) {
        console.error('Error loading data:', error);
        showError('Failed to load events data. Error: ' + error.message);
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
        console.log(`Received ${endpoint}:`, data.length || 0, 'items');
        return data;
    } catch (error) {
        console.error(`Error fetching ${endpoint}:`, error);
        return [];
    }
}

// ============================================
// UI RENDERING
// ============================================

function renderPeriodFilters() {
    const container = document.getElementById('periodsFilter');
    
    if (!container) {
        console.error('Period filter container not found!');
        return;
    }

    container.innerHTML = '';

    // Add "All Periods" button
    const allBtn = createFilterButton('All Periods', 'all', true);
    container.appendChild(allBtn);

    if (allPeriods.length === 0) {
        return;
    }

    // Sort periods by order
    const sortedPeriods = [...allPeriods].sort((a, b) => (a.order || 0) - (b.order || 0));

    // Add period buttons
    sortedPeriods.forEach(period => {
        const periodId = getObjectId(period._id);
        const btn = createFilterButton(period.name, periodId);
        container.appendChild(btn);
    });

    console.log('Period filters rendered:', sortedPeriods.length);
}

function createFilterButton(text, value, active = false) {
    const btn = document.createElement('button');
    btn.className = `filter-btn ${active ? 'active' : ''}`;
    btn.textContent = text;
    btn.dataset.period = value;
    
    btn.addEventListener('click', () => {
        console.log('Filter clicked:', text, value);
        document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        filterByPeriod(value);
    });
    
    return btn;
}

function renderEvents() {
    const container = document.getElementById('eventsGrid');
    
    if (!container) {
        console.error('Events grid container not found!');
        return;
    }

    // Sort events
    sortEvents();

    if (filteredEvents.length === 0) {
        showNoResults(true);
        container.innerHTML = '';
        return;
    }

    showNoResults(false);
    container.innerHTML = '';

    filteredEvents.forEach((event, index) => {
        const eventCard = createEventCard(event, index);
        container.appendChild(eventCard);
    });

    console.log('Events rendered:', filteredEvents.length);
}

function createEventCard(event, displayIndex) {
    const card = document.createElement('div');
    card.className = 'event-card';
    card.style.animationDelay = `${displayIndex * 0.1}s`;
    
    const eventId = getObjectId(event._id);
    const periodId = getObjectId(event.periodId);
    const period = allPeriods.find(p => getObjectId(p._id) === periodId);
    
    // Get display date
    const dateText = formatEventDate(event.date);
    
    // Get location
    const location = event.location?.name || event.location?.province || 'Unknown Location';
    
    // Get description
    const description = event.shortDescription || event.description || 'No description available';
    
    // Get CONSISTENT image for this specific event (based on event ID, not display index)
    const imageUrl = getEventImage(event);
    const fallbackGradient = getFallbackGradient(event);
    
    card.innerHTML = `
        <div class="card-image" style="background: ${fallbackGradient};">
            <img src="${imageUrl}" 
                 alt="${event.title || 'Event'}" 
                 class="card-image-img"
                 onerror="this.style.display='none'">
            ${event.featured ? '<div class="card-badge">FEATURED</div>' : ''}
        </div>
        <div class="card-content">
            <div class="card-meta">
                <div class="card-date">📅 ${dateText}</div>
                <div class="card-period">${period ? period.name : 'Unknown Period'}</div>
            </div>
            <h3 class="card-title">${event.title || 'Untitled Event'}</h3>
            ${event.titleVietnamese ? `<p class="card-title-vi">${event.titleVietnamese}</p>` : ''}
            <p class="card-description">${description}</p>
            ${event.tags && event.tags.length > 0 ? `
                <div class="card-tags">
                    ${event.tags.slice(0, 3).map(tag => `<span class="card-tag">${tag}</span>`).join('')}
                </div>
            ` : ''}
            <div class="card-footer">
                <div class="card-location">📍 ${location}</div>
                <button class="card-button" onclick="viewEventDetail('${eventId}')">View Details</button>
            </div>
        </div>
    `;
    
    // Add click handler to entire card
    card.addEventListener('click', (e) => {
        if (!e.target.classList.contains('card-button')) {
            viewEventDetail(eventId);
        }
    });
    
    return card;
}

// ============================================
// FILTERING AND SORTING
// ============================================

function filterByPeriod(periodId) {
    console.log('Filtering by period:', periodId);
    selectedPeriodId = periodId;

    if (periodId === 'all') {
        filteredEvents = [...allEvents];
    } else {
        filteredEvents = allEvents.filter(event => {
            const eventPeriodId = getObjectId(event.periodId);
            return eventPeriodId === periodId;
        });
    }

    console.log('Filtered to', filteredEvents.length, 'events');

    renderEvents();
    updateStats();
}

function sortEvents() {
    switch (currentSort) {
        case 'date-asc':
            filteredEvents.sort((a, b) => {
                const yearA = a.date?.year || 0;
                const yearB = b.date?.year || 0;
                return yearA - yearB;
            });
            break;
        case 'date-desc':
            filteredEvents.sort((a, b) => {
                const yearA = a.date?.year || 0;
                const yearB = b.date?.year || 0;
                return yearB - yearA;
            });
            break;
        case 'name-asc':
            filteredEvents.sort((a, b) => {
                const nameA = (a.title || '').toLowerCase();
                const nameB = (b.title || '').toLowerCase();
                return nameA.localeCompare(nameB);
            });
            break;
        case 'name-desc':
            filteredEvents.sort((a, b) => {
                const nameA = (a.title || '').toLowerCase();
                const nameB = (b.title || '').toLowerCase();
                return nameB.localeCompare(nameA);
            });
            break;
    }
}

// ============================================
// SEARCH FUNCTIONALITY
// ============================================

function setupEventListeners() {
    // Search functionality
    const searchInput = document.getElementById('searchInput');
    const searchResults = document.getElementById('searchResults');

    if (!searchInput || !searchResults) {
        console.error('Search elements not found!');
        return;
    }

    let searchTimeout;
    searchInput.addEventListener('input', (e) => {
        clearTimeout(searchTimeout);
        searchTimeout = setTimeout(() => {
            performSearch(e.target.value);
        }, 300);
    });

    // Close search results when clicking outside
    document.addEventListener('click', (e) => {
        if (!searchInput.contains(e.target) && !searchResults.contains(e.target)) {
            searchResults.classList.remove('active');
        }
    });

    // Sort functionality
    const sortSelect = document.getElementById('sortSelect');
    if (sortSelect) {
        sortSelect.addEventListener('change', (e) => {
            currentSort = e.target.value;
            renderEvents();
        });
    }

    console.log('Event listeners set up');
}

function performSearch(query) {
    const searchResults = document.getElementById('searchResults');
    
    if (!query || query.length < 2) {
        searchResults.classList.remove('active');
        return;
    }

    console.log('Searching for:', query);

    // Split query into words and match each word
    const queryWords = query.toLowerCase().trim().split(/\s+/);
    
    const results = allEvents.filter(event => {
        const title = (event.title || '').toLowerCase();
        const titleVi = (event.titleVietnamese || '').toLowerCase();
        const description = (event.description || '').toLowerCase();
        const searchText = title + ' ' + titleVi + ' ' + description;
        
        return queryWords.every(word => searchText.includes(word));
    }).slice(0, 10); // Limit to 10 results

    console.log('Search found', results.length, 'results');

    if (results.length === 0) {
        searchResults.innerHTML = '<div style="padding: 20px; text-align: center; color: #94a3b8;">No events found matching "' + query + '"</div>';
        searchResults.classList.add('active');
        return;
    }

    // Sort results by relevance (title matches first)
    results.sort((a, b) => {
        const aTitle = (a.title || '').toLowerCase();
        const bTitle = (b.title || '').toLowerCase();
        const lowerQuery = query.toLowerCase();
        
        const aInTitle = aTitle.includes(lowerQuery);
        const bInTitle = bTitle.includes(lowerQuery);
        
        if (aInTitle && !bInTitle) return -1;
        if (!aInTitle && bInTitle) return 1;
        return 0;
    });

    searchResults.innerHTML = results.map(event => {
        const periodId = getObjectId(event.periodId);
        const period = allPeriods.find(p => getObjectId(p._id) === periodId);
        const periodName = period ? period.name : 'Unknown Period';
        
        return `
            <div class="search-result-item" data-event-id="${getObjectId(event._id)}">
                <div class="search-result-title">${event.title || 'Untitled'}</div>
                <div class="search-result-info">${formatEventDate(event.date)} • ${periodName}</div>
            </div>
        `;
    }).join('');

    searchResults.classList.add('active');

    // Add click handlers to search results
    searchResults.querySelectorAll('.search-result-item').forEach(item => {
        item.addEventListener('click', () => {
            const eventId = item.dataset.eventId;
            viewEventDetail(eventId);
            searchResults.classList.remove('active');
            document.getElementById('searchInput').value = '';
        });
    });
}

// ============================================
// NAVIGATION
// ============================================

function viewEventDetail(eventId) {
    console.log('Navigating to event detail:', eventId);
    window.location.href = `events-detail.html?id=${eventId}`;
}

// Make function available globally
window.viewEventDetail = viewEventDetail;

// ============================================
// STATISTICS
// ============================================

function updateStats() {
    // Total events
    const totalEl = document.getElementById('totalEvents');
    if (totalEl) totalEl.textContent = allEvents.length;

    // Visible events
    const visibleEl = document.getElementById('visibleEvents');
    if (visibleEl) visibleEl.textContent = filteredEvents.length;

    // Periods count
    const periodsEl = document.getElementById('periodsCount');
    if (periodsEl) periodsEl.textContent = allPeriods.length;

    console.log('Stats updated:', {
        total: allEvents.length,
        visible: filteredEvents.length,
        periods: allPeriods.length
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

function showNoResults(show) {
    const noResults = document.getElementById('noResultsMessage');
    if (noResults) {
        noResults.style.display = show ? 'block' : 'none';
    }
}

function showError(message) {
    console.error('Error:', message);
    alert('Error: ' + message);
}

// Export for debugging
window.eventsDebug = {
    get allPeriods() { return allPeriods; },
    get allEvents() { return allEvents; },
    get filteredEvents() { return filteredEvents; },
    reloadData: loadAllData,
    // Test function to see image assignments
    testImageAssignment: (eventId) => {
        const event = allEvents.find(e => getObjectId(e._id) === eventId);
        if (event) {
            console.log('Event:', event.title);
            console.log('Image:', getEventImage(event));
            console.log('Gradient:', getFallbackGradient(event));
        }
    }
};

console.log('events.js loaded. Use eventsDebug in console for debugging.');