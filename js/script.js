// Vietnamese History Homepage - JavaScript
// API Configuration
const API_BASE_URL = 'http://localhost:3000/api';

// Global state
let allEvents = [];
let allPeriods = [];

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

// Shuffle array using Fisher-Yates algorithm
function shuffleArray(array) {
    const shuffled = [...array];
    for (let i = shuffled.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled;
}

// Format event date
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

// Available gradients for event cards
const GRADIENT_COLORS = [
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

// Wait for DOM to be fully loaded
document.addEventListener('DOMContentLoaded', function() {
    console.log('Homepage loaded, fetching random events...');
    loadRandomEvents();
    initializeInteractivity();
});

// Load random events from API
async function loadRandomEvents() {
    try {
        showLoading(true);

        // Fetch periods and events in parallel
        const [periodsData, eventsData] = await Promise.all([
            fetchAPI('/periods'),
            fetchAPI('/events')
        ]);

        allPeriods = Array.isArray(periodsData) ? periodsData : [];
        allEvents = Array.isArray(eventsData) ? eventsData : [];

        console.log('Data loaded:', {
            periods: allPeriods.length,
            events: allEvents.length
        });

        // Update stats
        updateStats();

        // Get 4 random events
        const randomEvents = getRandomEvents(allEvents, 4);
        console.log('Selected random events:', randomEvents.length);

        // Render the events
        renderEvents(randomEvents);

        showLoading(false);

    } catch (error) {
        console.error('Error loading events:', error);
        showError('Failed to load events. Please check if the backend server is running.');
        showLoading(false);
    }
}

// Fetch data from API
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

// Get random events from array
function getRandomEvents(events, count) {
    if (events.length <= count) {
        return events;
    }
    
    const shuffled = shuffleArray(events);
    return shuffled.slice(0, count);
}

// Render events to the grid
function renderEvents(events) {
    const grid = document.getElementById('eventsGrid');
    
    if (!grid) {
        console.error('Events grid not found!');
        return;
    }

    if (events.length === 0) {
        grid.innerHTML = '<p style="text-align: center; color: #64748b; grid-column: 1 / -1;">No events available.</p>';
        return;
    }

    grid.innerHTML = '';

    events.forEach((event, index) => {
        const eventCard = createEventCard(event, index);
        grid.appendChild(eventCard);
    });

    console.log('Rendered', events.length, 'events');
}

// Create event card element
function createEventCard(event, index) {
    const card = document.createElement('div');
    card.className = 'event-card';
    
    const eventId = getObjectId(event._id);
    const periodId = getObjectId(event.periodId);
    const period = allPeriods.find(p => getObjectId(p._id) === periodId);
    
    // Get display date
    const dateText = formatEventDate(event.date);
    
    // Get period name
    const periodName = period ? period.name : 'Unknown Period';
    
    // Get description
    const description = event.shortDescription || event.description || 'No description available';
    
    // Use a gradient based on index
    const gradient = GRADIENT_COLORS[index % GRADIENT_COLORS.length];
    
    card.innerHTML = `
        <div class="event-image" style="background: ${gradient};">
            ${event.featured ? '<div class="event-badge">Featured</div>' : ''}
        </div>
        <div class="event-content">
            <div class="event-period">${periodName}</div>
            <h3 class="event-title">${event.title || 'Untitled Event'}</h3>
            <p class="event-description">${description}</p>
            <div class="event-meta">
                <span class="event-date">📅 ${dateText}</span>
                <a href="events-detail.html?id=${eventId}" class="event-link">Read More →</a>
            </div>
        </div>
    `;
    
    // Add click handler to entire card
    card.addEventListener('click', (e) => {
        if (!e.target.classList.contains('event-link')) {
            window.location.href = `events-detail.html?id=${eventId}`;
        }
    });
    
    return card;
}

// Update statistics
function updateStats() {
    const totalEventsEl = document.getElementById('totalEvents');
    if (totalEventsEl && allEvents.length > 0) {
        totalEventsEl.textContent = allEvents.length;
    }
}

// Show/hide loading indicator
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

// Show error message
function showError(message) {
    const grid = document.getElementById('eventsGrid');
    if (grid) {
        grid.innerHTML = `
            <div style="text-align: center; padding: 2rem; grid-column: 1 / -1;">
                <p style="color: #ef4444; font-size: 1.1rem; margin-bottom: 0.5rem;">⚠️ ${message}</p>
                <p style="color: #64748b; font-size: 0.9rem;">Make sure your backend server is running on port 3000</p>
            </div>
        `;
    }
}

// Initialize interactive features
function initializeInteractivity() {
    // Smooth scroll for anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({ 
                    behavior: 'smooth', 
                    block: 'start' 
                });
            }
        });
    });

    // Add ripple effect to buttons
    const buttons = document.querySelectorAll('.btn');
    buttons.forEach(button => {
        button.addEventListener('click', function(e) {
            const ripple = document.createElement('span');
            const rect = this.getBoundingClientRect();
            const size = Math.max(rect.width, rect.height);
            const x = e.clientX - rect.left - size / 2;
            const y = e.clientY - rect.top - size / 2;
            
            ripple.style.width = ripple.style.height = size + 'px';
            ripple.style.left = x + 'px';
            ripple.style.top = y + 'px';
            ripple.classList.add('ripple');
            
            this.appendChild(ripple);
            
            setTimeout(() => {
                ripple.remove();
            }, 600);
        });
    });

    // Navbar scroll effect
    let lastScroll = 0;
    const header = document.querySelector('header');
    
    window.addEventListener('scroll', function() {
        const currentScroll = window.pageYOffset;
        
        if (currentScroll > 100) {
            header.style.boxShadow = '0 4px 20px rgba(218, 37, 29, 0.3)';
        } else {
            header.style.boxShadow = '0 2px 10px rgba(218, 37, 29, 0.2)';
        }
        
        lastScroll = currentScroll;
    });

    // Count up animation for stats
    const observerOptions = {
        threshold: 0.5,
        rootMargin: '0px'
    };

    const statNumbers = document.querySelectorAll('.stat-number');
    let hasAnimated = false;

    const statsObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting && !hasAnimated) {
                hasAnimated = true;
                statNumbers.forEach(stat => {
                    animateValue(stat);
                });
            }
        });
    }, observerOptions);

    const statsSection = document.querySelector('.stats-section');
    if (statsSection) {
        statsObserver.observe(statsSection);
    }

    // Console welcome message
    console.log('%c🇻🇳 Vietnamese History Project', 'color: #da251d; font-size: 20px; font-weight: bold;');
    console.log('%cExploring 4000+ years of Vietnamese history', 'color: #64748b; font-size: 14px;');
}

// Animate stat numbers
function animateValue(element) {
    const text = element.textContent;
    const hasPlus = text.includes('+');
    const number = parseInt(text.replace(/\D/g, ''));
    
    if (isNaN(number) || number === 0) return;
    
    const duration = 2000;
    const increment = number / (duration / 16);
    let current = 0;

    const timer = setInterval(() => {
        current += increment;
        if (current >= number) {
            element.textContent = number + (hasPlus ? '+' : '');
            clearInterval(timer);
        } else {
            element.textContent = Math.floor(current) + (hasPlus ? '+' : '');
        }
    }, 16);
}

// CSS for ripple effect
const style = document.createElement('style');
style.textContent = `
    .ripple {
        position: absolute;
        border-radius: 50%;
        background: rgba(255, 255, 255, 0.5);
        transform: scale(0);
        animation: ripple-animation 0.6s ease-out;
        pointer-events: none;
    }
    
    @keyframes ripple-animation {
        to {
            transform: scale(4);
            opacity: 0;
        }
    }
`;
document.head.appendChild(style);