// Vietnamese History Timeline - Main JavaScript
// API Configuration
const API_BASE_URL = 'http://localhost:3000/api';

// Global State
let allPeriods = [];
let allSubPeriods = [];
let allEvents = [];
let filteredEvents = [];
let timeline = null;
let timelineItems = new vis.DataSet();
let selectedPeriodId = 'all';

// Period Colors
const PERIOD_COLORS = {
    'ancient': '#8B4513',
    'domination': '#8B0000',
    'monarchical': '#FFD700',
    'colonial': '#8B4513',
    'indochina': '#DC143C',
    'war': '#8B0000',
    'modern': '#FF6B35'
};

// Sub-Period Color Palettes (different shades for each sub-period)
const SUB_PERIOD_COLOR_PALETTES = {
    'ancient': ['#A0522D', '#8B4513', '#654321'],
    'domination': ['#8B0000', '#A52A2A', '#B22222'],
    'monarchical': ['#FFD700', '#FFA500', '#FF8C00'],
    'colonial': ['#D2691E', '#CD853F', '#8B4513'],
    'indochina': ['#DC143C', '#C71585', '#FF1493'],
    'war': ['#8B0000', '#B22222', '#CD5C5C'],
    'modern': ['#FF6B35', '#FF8C42', '#FFA94D']
};

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
    console.log('Timeline page loaded, initializing...');
    initializeTimeline();
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

        // Load periods, subperiods, and events in parallel
        const [periodsData, subPeriodsData, eventsData] = await Promise.all([
            fetchAPI('/periods'),
            fetchAPI('/subperiods'),
            fetchAPI('/events')
        ]);

        allPeriods = Array.isArray(periodsData) ? periodsData : [];
        allSubPeriods = Array.isArray(subPeriodsData) ? subPeriodsData : [];
        allEvents = Array.isArray(eventsData) ? eventsData : [];
        filteredEvents = [...allEvents];

        console.log('Data loaded successfully:', {
            periods: allPeriods.length,
            subPeriods: allSubPeriods.length,
            events: allEvents.length
        });

        console.log('Sample event:', allEvents[0]);
        console.log('Sample period:', allPeriods[0]);

        // Render UI components
        renderPeriodFilters();
        renderLegend();
        renderTimeline();
        updateStats();

        showLoading(false);
        
        if (allEvents.length === 0) {
            showError('No events found in database. Please check your MongoDB data.');
        }
    } catch (error) {
        console.error('Error loading data:', error);
        showError('Failed to load timeline data. Error: ' + error.message);
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
        showError(`Failed to fetch ${endpoint}: ${error.message}`);
        return [];
    }
}

// ============================================
// TIMELINE INITIALIZATION
// ============================================

function initializeTimeline() {
    const container = document.getElementById('timeline');
    
    if (!container) {
        console.error('Timeline container not found!');
        return;
    }

    const options = {
        width: '100%',
        height: '100%',
        margin: {
            item: 20,
            axis: 40
        },
        orientation: 'top',
        zoomMin: 1000 * 60 * 60 * 24 * 365 * 5,      // 5 years
        zoomMax: 1000 * 60 * 60 * 24 * 365 * 6000,    // 6000 years
        moveable: true,
        zoomable: true,
        selectable: true,
        stack: true,
        tooltip: {
            followMouse: true,
            overflowMethod: 'cap'
        },
        format: {
            minorLabels: {
                year: 'YYYY'
            },
            majorLabels: {
                year: 'YYYY'
            }
        }
    };

    timeline = new vis.Timeline(container, timelineItems, options);

    // Event click handler
    timeline.on('select', function(properties) {
        if (properties.items.length > 0) {
            const itemId = properties.items[0];
            console.log('Timeline item selected:', itemId);
            
            const event = allEvents.find(e => getObjectId(e._id) === itemId);
            if (event) {
                showEventModal(event);
            } else {
                console.warn('Event not found for ID:', itemId);
            }
        }
    });

    // Set initial view
    setTimelineView(-2879, 2025);
    console.log('Timeline initialized');
}

function setTimelineView(startYear, endYear) {
    if (!timeline) return;
    
    const start = new Date(startYear, 0, 1);
    const end = new Date(endYear, 11, 31);
    timeline.setWindow(start, end);
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

    if (allPeriods.length === 0) {
        container.innerHTML = '<button class="filter-btn loading">No periods available</button>';
        return;
    }

    container.innerHTML = '';

    // Add "All Periods" button
    const allBtn = createFilterButton('All Periods', 'all', true);
    container.appendChild(allBtn);

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

function renderLegend() {
    const container = document.getElementById('legendItems');
    
    if (!container) {
        console.error('Legend container not found!');
        return;
    }

    container.innerHTML = '';

    let legendData = [];
    
    if (selectedPeriodId === 'all') {
        legendData = [...allPeriods].sort((a, b) => (a.order || 0) - (b.order || 0));
    } else {
        legendData = allSubPeriods.filter(sp => {
            const periodId = getObjectId(sp.periodId);
            return periodId === selectedPeriodId;
        }).sort((a, b) => (a.order || 0) - (b.order || 0));
    }

    if (legendData.length === 0) {
        container.innerHTML = '<p style="text-align: center; color: #64748b; grid-column: 1/-1;">No data to display</p>';
        return;
    }

    legendData.forEach(item => {
        const legendItem = document.createElement('div');
        legendItem.className = 'legend-item';
        
        const color = getItemColor(item);
        const yearRange = getYearRange(item);
        
        legendItem.innerHTML = `
            <div class="legend-color" style="background: ${color};"></div>
            <div class="legend-text">
                <div class="legend-name">${item.name || 'Unknown'}</div>
                <div class="legend-years">${yearRange}</div>
            </div>
        `;
        
        container.appendChild(legendItem);
    });

    console.log('Legend rendered with', legendData.length, 'items');
}

function renderTimeline() {
    console.log('Rendering timeline with', filteredEvents.length, 'events');
    timelineItems.clear();

    if (filteredEvents.length === 0) {
        console.warn('No events to display on timeline');
        return;
    }

    const items = [];
    
    filteredEvents.forEach(event => {
        try {
            const startDate = parseEventDate(event.date);
            const endDate = event.endDate ? parseEventDate(event.endDate) : null;
            
            if (!startDate || isNaN(startDate.getTime())) {
                console.warn('Invalid date for event:', event.title, event.date);
                return;
            }
            
            const color = getEventColor(event);
            const id = getObjectId(event._id);
            
            const item = {
                id: id,
                content: event.title || 'Untitled Event',
                start: startDate,
                end: endDate || startDate,
                type: endDate ? 'range' : 'box',
                style: `background-color: ${color}; border-color: ${color}; color: white;`,
                title: `${event.title || 'Untitled'}\n${formatEventDate(event.date)}\n\nClick to view details`
            };
            
            items.push(item);
        } catch (error) {
            console.error('Error processing event:', event.title, error);
        }
    });

    console.log('Created', items.length, 'timeline items');

    if (items.length > 0) {
        timelineItems.add(items);

        // Adjust timeline view based on filtered events
        try {
            const dates = items.map(item => item.start.getTime());
            const minDate = new Date(Math.min(...dates));
            const maxDate = new Date(Math.max(...items.map(item => (item.end || item.start).getTime())));
            
            // Add padding (10% on each side)
            const range = maxDate - minDate;
            const padding = range * 0.1;
            
            timeline.setWindow(
                new Date(minDate.getTime() - padding),
                new Date(maxDate.getTime() + padding)
            );
            
            console.log('Timeline view adjusted:', minDate, 'to', maxDate);
        } catch (error) {
            console.error('Error adjusting timeline view:', error);
        }
    }
}

// ============================================
// FILTERING
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

    renderTimeline();
    renderLegend();
    updateStats();
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

    // Zoom controls
    const zoomInBtn = document.getElementById('zoomIn');
    const zoomOutBtn = document.getElementById('zoomOut');
    const resetBtn = document.getElementById('resetView');

    if (zoomInBtn) {
        zoomInBtn.addEventListener('click', () => {
            if (timeline) timeline.zoomIn(0.5);
        });
    }

    if (zoomOutBtn) {
        zoomOutBtn.addEventListener('click', () => {
            if (timeline) timeline.zoomOut(0.5);
        });
    }

    if (resetBtn) {
        resetBtn.addEventListener('click', () => {
            if (selectedPeriodId === 'all') {
                setTimelineView(-2879, 2025);
            } else {
                renderTimeline(); // This will auto-adjust to filtered events
            }
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

    // Improved search: Split query into words and match each word
    const queryWords = query.toLowerCase().trim().split(/\s+/);
    
    const results = allEvents.filter(event => {
        const title = (event.title || '').toLowerCase();
        const description = (event.description || '').toLowerCase();
        const searchText = title + ' ' + description;
        
        // All query words must be present in the event text
        return queryWords.every(word => searchText.includes(word));
    }).slice(0, 10); // Limit to 10 results

    console.log('Search found', results.length, 'results');

    if (results.length === 0) {
        searchResults.innerHTML = '<div class="no-results">No events found matching "' + query + '"</div>';
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
        // Get period name for context
        const periodId = getObjectId(event.periodId);
        const period = allPeriods.find(p => getObjectId(p._id) === periodId);
        const periodName = period ? period.name : 'Unknown Period';
        
        return `
            <div class="search-result-item" data-event-id="${getObjectId(event._id)}">
                <div class="search-result-title">${event.title || 'Untitled'}</div>
                <div class="search-result-date">${formatEventDate(event.date)} • ${periodName}</div>
            </div>
        `;
    }).join('');

    searchResults.classList.add('active');

    // Add click handlers to search results
    searchResults.querySelectorAll('.search-result-item').forEach(item => {
        item.addEventListener('click', () => {
            const eventId = item.dataset.eventId;
            const event = allEvents.find(e => getObjectId(e._id) === eventId);
            if (event) {
                showEventModal(event);
                searchResults.classList.remove('active');
                document.getElementById('searchInput').value = '';
            }
        });
    });
}

// ============================================
// MODAL
// ============================================

function showEventModal(event) {
    console.log('Showing modal for event:', event.title);
    
    const modal = document.getElementById('eventModal');
    if (!modal) {
        console.error('Modal not found!');
        return;
    }

    document.getElementById('modalTitle').textContent = event.title || 'Untitled Event';
    
    let dateText = formatEventDate(event.date);
    if (event.endDate) {
        dateText += ' - ' + formatEventDate(event.endDate);
    }
    document.getElementById('modalDate').textContent = dateText;
    
    document.getElementById('modalDescription').textContent = event.description || 'No description available.';
    
    // Find period name
    const periodId = getObjectId(event.periodId);
    const period = allPeriods.find(p => getObjectId(p._id) === periodId);
    document.getElementById('modalPeriod').textContent = period ? period.name : 'Unknown Period';
    
    // Show location if available
    const locationDiv = document.getElementById('modalLocation');
    if (event.location && event.location.name) {
        locationDiv.style.display = 'block';
        locationDiv.innerHTML = `<strong>📍 Location:</strong> ${event.location.name}`;
    } else {
        locationDiv.style.display = 'none';
    }

    // Setup view detail button - always visible
    const viewDetailBtn = document.getElementById('viewOnMap');
    viewDetailBtn.textContent = '📄 View Detail';
    viewDetailBtn.style.display = 'flex';
    viewDetailBtn.onclick = () => {
        const eventId = getObjectId(event._id);
        window.location.href = `events-detail.html?id=${eventId}`;
    };

    modal.classList.add('active');
}

function closeModal() {
    const modal = document.getElementById('eventModal');
    if (modal) {
        modal.classList.remove('active');
    }
}

// Make closeModal available globally
window.closeModal = closeModal;

// ============================================
// STATISTICS
// ============================================

function updateStats() {
    // Total events (all events in database)
    const totalEl = document.getElementById('totalEvents');
    if (totalEl) totalEl.textContent = allEvents.length;

    // Visible events (filtered)
    const visibleEl = document.getElementById('visibleEvents');
    if (visibleEl) visibleEl.textContent = filteredEvents.length;

    // Sub Periods count
    let periodsCount;
    if (selectedPeriodId === 'all') {
        periodsCount = allPeriods.length;
    } else {
        const subPeriods = allSubPeriods.filter(sp => {
            const periodId = getObjectId(sp.periodId);
            return periodId === selectedPeriodId;
        });
        periodsCount = subPeriods.length;
    }
    const periodsEl = document.getElementById('periodsCount');
    if (periodsEl) periodsEl.textContent = periodsCount;

    // Calculate years of history
    const yearsOfHistory = calculateYearsOfHistory();
    const yearsEl = document.getElementById('yearsOfHistory');
    if (yearsEl) yearsEl.textContent = yearsOfHistory.toLocaleString();

    console.log('Stats updated:', {
        total: allEvents.length,
        visible: filteredEvents.length,
        periods: periodsCount,
        years: yearsOfHistory
    });
}

function calculateYearsOfHistory() {
    if (filteredEvents.length === 0) {
        return 4904; // Default: 2879 BC to 2025 AD
    }

    let minYear = Infinity;
    let maxYear = -Infinity;

    filteredEvents.forEach(event => {
        if (event.date && typeof event.date.year === 'number') {
            const year = event.date.year;
            minYear = Math.min(minYear, year);
            maxYear = Math.max(maxYear, year);
            
            if (event.endDate && typeof event.endDate.year === 'number') {
                maxYear = Math.max(maxYear, event.endDate.year);
            }
        }
    });

    // Calculate total years (accounting for BC/AD)
    if (minYear < 0 && maxYear >= 0) {
        return Math.abs(minYear) + maxYear;
    } else if (minYear < 0 && maxYear < 0) {
        return Math.abs(minYear) - Math.abs(maxYear);
    } else {
        return maxYear - minYear;
    }
}

// ============================================
// HELPER FUNCTIONS
// ============================================

function parseEventDate(dateObj) {
    if (!dateObj) {
        return new Date(0, 0, 1);
    }

    // Handle different date formats
    if (typeof dateObj === 'string') {
        return new Date(dateObj);
    }

    if (typeof dateObj.year !== 'number') {
        console.warn('Invalid date object:', dateObj);
        return new Date(0, 0, 1);
    }

    const year = dateObj.year;
    const month = (typeof dateObj.month === 'number') ? dateObj.month : 0;
    const day = (typeof dateObj.day === 'number') ? dateObj.day : 1;

    return new Date(year, month, day);
}

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

function getEventColor(event) {
    const periodId = getObjectId(event.periodId);
    const period = allPeriods.find(p => getObjectId(p._id) === periodId);
    
    // If a specific period is selected and event has subPeriodId, use sub-period color
    if (selectedPeriodId !== 'all' && event.subPeriodId) {
        const subPeriodId = getObjectId(event.subPeriodId);
        
        // Find which sub-period this event belongs to
        const subPeriod = allSubPeriods.find(sp => getObjectId(sp._id) === subPeriodId);
        
        if (subPeriod && period && period.slug) {
            // Get the color palette for this period
            const colorPalette = SUB_PERIOD_COLOR_PALETTES[period.slug];
            
            if (colorPalette) {
                // Get all sub-periods for this period, sorted by order
                const periodSubPeriods = allSubPeriods
                    .filter(sp => getObjectId(sp.periodId) === periodId)
                    .sort((a, b) => (a.order || 0) - (b.order || 0));
                
                // Find the index of current sub-period
                const subPeriodIndex = periodSubPeriods.findIndex(sp => getObjectId(sp._id) === subPeriodId);
                
                // Use index to pick color from palette (cycle if more sub-periods than colors)
                if (subPeriodIndex >= 0) {
                    const colorIndex = subPeriodIndex % colorPalette.length;
                    return colorPalette[colorIndex];
                }
            }
        }
    }
    
    // Default: use main period color
    if (period && period.slug) {
        return PERIOD_COLORS[period.slug] || '#3b82f6';
    }
    
    return '#3b82f6';
}

function getItemColor(item) {
    if (item.color) {
        return item.color;
    }
    
    // For periods (when "All Periods" is selected)
    if (item.slug && PERIOD_COLORS[item.slug]) {
        return PERIOD_COLORS[item.slug];
    }
    
    // For sub-periods, use sub-period color palette
    if (item.periodId && selectedPeriodId !== 'all') {
        const periodId = getObjectId(item.periodId);
        const period = allPeriods.find(p => getObjectId(p._id) === periodId);
        
        if (period && period.slug) {
            const colorPalette = SUB_PERIOD_COLOR_PALETTES[period.slug];
            
            if (colorPalette) {
                // Get all sub-periods for this period
                const periodSubPeriods = allSubPeriods
                    .filter(sp => getObjectId(sp.periodId) === periodId)
                    .sort((a, b) => (a.order || 0) - (b.order || 0));
                
                // Find the index of current sub-period
                const itemId = getObjectId(item._id);
                const subPeriodIndex = periodSubPeriods.findIndex(sp => getObjectId(sp._id) === itemId);
                
                if (subPeriodIndex >= 0) {
                    const colorIndex = subPeriodIndex % colorPalette.length;
                    return colorPalette[colorIndex];
                }
            }
            
            // Fallback to main period color
            return PERIOD_COLORS[period.slug] || '#3b82f6';
        }
    }
    
    return '#3b82f6';
}

function getYearRange(item) {
    if (typeof item.startYear === 'number' && typeof item.endYear === 'number') {
        return formatYear(item.startYear) + ' - ' + formatYear(item.endYear);
    }
    return 'Various dates';
}

function formatYear(year) {
    if (typeof year !== 'number') return 'Unknown';
    
    if (year < 0) {
        return Math.abs(year) + ' BC';
    } else if (year === 0) {
        return '1 BC';
    } else {
        return year + ' AD';
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
    alert('Error: ' + message);
}

// Export for debugging
window.timelineDebug = {
    get allPeriods() { return allPeriods; },
    get allSubPeriods() { return allSubPeriods; },
    get allEvents() { return allEvents; },
    get filteredEvents() { return filteredEvents; },
    get timeline() { return timeline; },
    reloadData: loadAllData,
    testAPI: async () => {
        console.log('Testing API connection...');
        try {
            const response = await fetch(`${API_BASE_URL}/health`);
            const data = await response.json();
            console.log('API Health:', data);
        } catch (error) {
            console.error('API Error:', error);
        }
    }
};

console.log('Timeline.js loaded. Use timelineDebug in console for debugging.');