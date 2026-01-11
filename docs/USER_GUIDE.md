# User Guide

Welcome to the Vietnamese History Interactive Platform! This guide will help you explore 4,000+ years of Vietnamese history through our interactive features.

## 🌐 Accessing the Platform

**Live Site**: https://vietnam-history-sage.vercel.app

The platform works best on:
- 💻 Desktop browsers (Chrome, Firefox, Safari, Edge)
- 📱 Mobile devices (iOS Safari, Android Chrome)
- 📟 Tablets

**Note**: No installation required! Just visit the website and start exploring.

## Table of Contents

1. [Getting Started](#getting-started)
2. [Homepage](#homepage)
3. [Interactive Map](#interactive-map)
4. [Timeline View](#timeline-view)
5. [Events Browser](#events-browser)
6. [Event Details](#event-details)
7. [Search Functionality](#search-functionality)
8. [Navigation Tips](#navigation-tips)
9. [Troubleshooting](#troubleshooting)

---

## Getting Started

### Accessing the Platform

Simply open your web browser and navigate to:
```
https://vietnam-history-sage.vercel.app
```

**First Time Loading**:
- The backend API may take 30-60 seconds to wake up on first visit
- Subsequent page loads will be fast
- You'll see a loading indicator while data loads

### Navigation Bar

The navigation bar is available on every page:

- **🇻🇳 Vietnamese History** - Logo (returns to homepage)
- **Home** - Homepage with featured events
- **Map** - Interactive geographical map
- **Timeline** - Visual timeline interface
- **Events** - Browse all events
- **About** - Project information

---

## Homepage

**URL**: https://vietnam-history-sage.vercel.app/index.html

### Overview

The homepage provides:
- Quick introduction to the platform
- Featured historical events (4 random events)
- Quick statistics about the database
- Call-to-action buttons

### Featured Events

Four randomly selected historical events are displayed each time you visit. Each card shows:
- Event title
- Historical period
- Brief description
- Date
- "Read More" link

**To view more details:** Click anywhere on the event card or the "Read More" link.

### Statistics Section

View quick facts:
- 4000+ Years of History
- Total number of events
- Number of historical periods
- Number of locations

**Note**: First visit may take 30-60 seconds to load as the backend API wakes up.

---

## Interactive Map

**URL**: https://vietnam-history-sage.vercel.app/map.html

### Opening the Map

Click **"Map"** in the navigation bar or **"Explore Interactive Map"** on the homepage.

### Understanding the Map Interface

#### Main Components:

1. **Map Area** - Interactive map of Vietnam
2. **Period Filters** - Two rows of filter buttons
3. **Map Controls** - Zoom and reset buttons
4. **Event Annotations** - List of visible events below the map

### Using Period Filters

#### Step 1: Select Main Period
Click any period button in the first row:
- Ancient Period
- Chinese Domination
- Monarchical Period
- French Colonial
- Indochina Wars
- Modern Vietnam

**Result**: The map updates to show only events from that period, and sub-period buttons appear.

#### Step 2: Select Sub-Period (Optional)
After selecting a main period, sub-period buttons appear in the second row. Click any sub-period to further filter events.

**Example:**
1. Click "Ancient Period"
2. Sub-periods appear: "Hồng Bàng Dynasty", "Thục Dynasty", etc.
3. Click "Hồng Bàng Dynasty"
4. Map shows only events from this dynasty

### Interacting with Markers

#### Viewing Event Details:
1. Click any marker on the map
2. A popup appears with:
   - Event title
   - Historical period (colored badge)
   - Date
   - Location
   - Brief description
   - "View Details" button

#### Marker Colors:
Each marker's color corresponds to its historical period for easy identification.

### Map Controls

- **🎯 Center Vietnam** - Resets map view to show all of Vietnam
- **↻ Reset Filters** - Clears all filters and shows initial state

### Event Annotations List

Below the map, you'll see a list of all visible events showing:
- Period color indicator
- Event name
- Date

**To focus on an event:** Click any item in the annotations list to:
- Center the map on that event
- Zoom in closer
- Open the event's popup

### Navigation Tips

- **Zoom:** Use mouse wheel or pinch gesture
- **Pan:** Click and drag the map
- **Mobile:** Use two-finger gestures to zoom and pan

---

## Timeline View

**URL**: https://vietnam-history-sage.vercel.app/timeline.html

### Opening the Timeline

Click **"Timeline"** in the navigation bar or **"View Timeline"** on the homepage.

### Understanding the Timeline Interface

#### Components:

1. **Period Filters** - Filter by historical period
2. **Statistics Cards** - Event counts and date ranges
3. **Timeline Canvas** - Visual timeline with events
4. **Zoom Controls** - Adjust time range
5. **Legend** - Color key for periods/sub-periods

### Using Period Filters

Click any period button to filter events:
- **All Periods** - Shows all events (default)
- Individual periods - Shows only events from selected period

**Note:** The timeline automatically adjusts to show the date range of filtered events.

### Navigating the Timeline

#### Zoom Controls:
- **➕ Zoom In** - View shorter time span in more detail
- **➖ Zoom Out** - View longer time span
- **🔄 Reset** - Return to optimal view for current filter

#### Mouse/Touch Navigation:
- **Scroll/Pinch:** Zoom in and out
- **Click and Drag:** Move along the timeline
- **Click Event:** View event details

### Event Items

Events appear as:
- **Boxes** - Point events (single date)
- **Bars** - Period events (date range)

Colors indicate historical periods (see legend below timeline).

### Viewing Event Details

**To view details:**
1. Click any event on the timeline
2. A modal dialog appears with:
   - Event title
   - Date (or date range)
   - Historical period
   - Full description
   - Location information
   - "View Detail" button

**To close the modal:** Click the X button or click outside the modal.

### Statistics Cards

View real-time statistics:
- **Historical Events** - Total events in database
- **Years of History** - Time span covered
- **Sub Periods** - Number of periods/sub-periods
- **Visible Events** - Currently filtered events

### Legend Section

Below the timeline, the legend shows:
- Color coding for each period/sub-period
- Period names
- Year ranges

---

## Events Browser

**URL**: https://vietnam-history-sage.vercel.app/events.html

### Opening Events Browser

Click **"Events"** in the navigation bar.

### Page Components

1. **Hero Section** - Page title and description
2. **Period Filters** - Filter by historical period
3. **Statistics** - Event counts
4. **Sort Controls** - Change display order
5. **Events Grid** - Card-based event display

### Filtering Events

Click any period button to show only events from that period:
- **All Periods** - Shows all events (default)
- Individual periods - Filter by specific period

**Visual Feedback:** Active filter button is highlighted in red.

### Sorting Events

Use the **"Sort by"** dropdown to change order:
- **Date (Oldest First)** - Chronological order
- **Date (Newest First)** - Reverse chronological
- **Name (A-Z)** - Alphabetical order
- **Name (Z-A)** - Reverse alphabetical

### Event Cards

Each event card displays:
- **Image** - Visual representation (consistent per event)
- **Period Badge** - Historical period tag
- **Title** - Event name (English)
- **Vietnamese Title** - Event name in Vietnamese (if available)
- **Description** - Brief summary
- **Tags** - Event categories (if available)
- **Date** - When the event occurred
- **Location** - Where the event took place
- **"View Details" Button** - Link to full information

### Viewing Event Details

**To view full details:**
1. Click anywhere on an event card, OR
2. Click the "View Details" button

You'll be taken to the Event Detail page.

---

## Event Details

**URL**: https://vietnam-history-sage.vercel.app/events-detail.html?id=...

### Accessing Event Details

From anywhere in the app, you can access event details by:
- Clicking an event card
- Clicking "View Details" in map popup
- Clicking "View Detail" in timeline modal
- Following a direct link

### Page Structure

#### Hero Section (Top)
- Large banner with gradient background
- Event title (English)
- Event title (Vietnamese, if available)
- Key information:
  - 📅 Date
  - 📍 Location
  - 👑 Historical Period

#### Main Content Area

**📖 Description Section:**
Full, detailed description of the event and what happened.

**⭐ Historical Significance Section:**
Why this event matters in Vietnamese history.

**👥 Key Figures Section (if available):**
Important people involved:
- Name
- Role
- Description of their involvement

**🔗 Related Events Section (if available):**
Other events from the same period that might interest you.

#### Sidebar

**ℹ️ Event Information:**
- Date
- Location
- Period
- Event type (if applicable)

**🎯 Quick Actions:**
- **📍 View on Map** - Opens map centered on this event
- **⏱️ View on Timeline** - Opens timeline focused on this event
- **📤 Share** - Copy link or share via supported apps

**🏷️ Tags (if available):**
Category tags for the event

### Quick Actions Explained

#### View on Map
Opens the interactive map page with:
- Map centered on event location
- Marker highlighted
- Popup automatically opened

**Note:** Only available if event has location coordinates.

#### View on Timeline
Opens the timeline page with:
- Timeline filtered to event's period
- View zoomed to event's date
- Event automatically selected

#### Share
Allows you to share the event:
- **Modern browsers:** Opens native share dialog
- **Other browsers:** Copies link to clipboard

---

## Search Functionality

### Accessing Search

The search bar is available on every page in the header.

### How to Search

1. Click the search input field
2. Type at least 2 characters
3. Results appear automatically as you type
4. Click any result to view that event

### Search Features

- **Real-time results** - Updates as you type
- **Multi-word search** - Searches for all words you enter
- **Comprehensive** - Searches event titles, Vietnamese titles, and descriptions
- **Ranked results** - Most relevant results appear first

### Search Results Display

Each result shows:
- Event title
- Date
- Historical period

**Result Ranking:**
1. Exact title matches (highest priority)
2. Title starts with search term
3. Title contains search term
4. Description contains search term

### Using Search Results

- **Click any result** - View that event's details
- **Click outside** - Close search results
- **Start new search** - Results update automatically

---

## Navigation Tips

### Best Practices

#### For Exploring by Geography:
1. Use the **Map** view
2. Filter by period to reduce clutter
3. Click markers for quick info
4. Use "View Details" for comprehensive information

#### For Exploring by Time:
1. Use the **Timeline** view
2. Filter by period for focused exploration
3. Zoom in/out to adjust detail level
4. Click events for full information

#### For Finding Specific Events:
1. Use the **Search** function
2. Type keywords related to the event
3. Or use **Events** browser with filters

#### For Learning About a Period:
1. Go to **Events** page
2. Filter by that specific period
3. Browse all events from that era
4. Sort by date to see chronological progression

### Mobile Usage

#### Map Page:
- Use two-finger pinch to zoom
- Swipe to pan
- Tap markers for details

#### Timeline Page:
- Pinch to zoom timeline
- Swipe to scroll through time
- Tap events for details

#### Events Page:
- Scroll to browse events
- Tap cards to view details
- Use dropdowns for filtering/sorting

---

## Troubleshooting

### Performance Issues

**Problem:** Slow initial loading (30-60 seconds)
- **Cause:** Backend API waking up (Render free tier)
- **Solution:** Wait for initial load, subsequent loads will be fast
- **Status:** Normal behavior for first visit

**Problem:** Page not loading
- **Solution:** 
  - Check internet connection
  - Refresh the page (F5 or Cmd+R)
  - Clear browser cache
  - Try different browser

### Map Issues

**Problem:** Map not loading
- **Solution:** 
  - Refresh the page
  - Check internet connection
  - Ensure JavaScript is enabled

**Problem:** Markers not appearing
- **Solution:** 
  - Select a period filter
  - Check that events exist for selected period

**Problem:** Map controls not responding
- **Solution:** 
  - Wait for map to fully load
  - Refresh the page

### Timeline Issues

**Problem:** Timeline is blank
- **Solution:** 
  - Ensure events exist in database
  - Try "Reset" button
  - Refresh the page

**Problem:** Can't zoom or pan
- **Solution:** 
  - Click directly on timeline area
  - Ensure page is fully loaded

**Problem:** Events not showing details
- **Solution:** 
  - Click directly on event item
  - Wait for page to fully load

### Search Issues

**Problem:** Search not working
- **Solution:** 
  - Type at least 2 characters
  - Check spelling
  - Try different keywords

**Problem:** No results found
- **Solution:** 
  - Try broader search terms
  - Check that database has events
  - Try searching in Vietnamese if applicable

### General Issues

**Problem:** Images not loading
- **Solution:** 
  - Check internet connection
  - Clear browser cache
  - Images will show gradient backgrounds as fallback

**Problem:** API errors (events not loading)
- **Cause:** Backend API might be starting up
- **Solution:** 
  - Wait 30-60 seconds
  - Refresh the page
  - Check https://vietnamese-history-api-dvwf.onrender.com/api/health

### Getting Help

If you continue to experience issues:

1. **Check Status**: Visit https://vietnamese-history-api-dvwf.onrender.com/api/health
2. **Check Console**: Press F12, look for errors in Console tab
3. **Try Different Device**: Test on another device/browser
4. **Report Issue**: Contact support or file GitHub issue

---

## Tips for Educators

### Using in Classroom

1. **Project on screen** - Show map/timeline to class
2. **Student exploration** - Have students find specific events
3. **Timeline activities** - Compare events across periods
4. **Geography lessons** - Connect history to locations
5. **Research projects** - Students can explore related events

### Lesson Ideas

- **Historical context:** Use map to show where events occurred
- **Chronology:** Use timeline to understand sequence of events
- **Comparison:** Compare events across different periods
- **Geography:** Understand how geography influenced history
- **Research skills:** Practice finding and analyzing information

---

## Performance Notes

### Expected Load Times

- **Homepage**: 1-3 seconds (after initial wake-up)
- **Map Page**: 2-4 seconds (including marker rendering)
- **Timeline Page**: 2-4 seconds (including event rendering)
- **Events Page**: 2-4 seconds (including image loading)
- **Event Details**: 1-2 seconds

### First Visit

The backend API (hosted on Render free tier) "sleeps" after 15 minutes of inactivity:
- **First visit**: 30-60 seconds initial load
- **Subsequent visits**: Fast (~1-3 seconds)
- **Solution**: Be patient on first load, then enjoy fast performance!

---

## Feedback

We welcome your feedback! If you have:
- Suggestions for improvement
- Bug reports
- Content corrections
- Feature requests

Please contact us:
- **GitHub Issues**: [Report an issue](https://github.com/yourusername/Vietnam_History/issues)
- **Email**: contact@vietnamesehistory.edu.vn

---

## Keyboard Shortcuts

While no specific keyboard shortcuts are implemented, standard browser shortcuts work:
- **Ctrl/Cmd + F** - Browser find (search current page)
- **Backspace/Alt + ←** - Browser back button
- **Alt + →** - Browser forward button
- **F5/Cmd + R** - Refresh page
- **Ctrl/Cmd + 0** - Reset zoom level

---

**Happy exploring! 🇻🇳**

*Discover 4,000 years of Vietnamese history through interactive visualization*

**Live at**: https://vietnam-history-sage.vercel.app