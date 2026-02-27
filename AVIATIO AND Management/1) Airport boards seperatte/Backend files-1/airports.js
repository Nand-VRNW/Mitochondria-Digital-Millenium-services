// ===== AIRPORTS PAGE JAVASCRIPT =====

// Sample airport database
const airports = [
    {
        id: 1,
        name: 'Indira Gandhi International Airport',
        code: 'DEL',
        city: 'New Delhi',
        country: 'India',
        status: 'Operational',
        weather: 'Clear',
        departureDelay: '5 mins',
        arrivalDelay: '3 mins'
    },
    {
        id: 2,
        name: 'Dubai International Airport',
        code: 'DXB',
        city: 'Dubai',
        country: 'UAE',
        status: 'Operational',
        weather: 'Clear, Sunny',
        departureDelay: '2 mins',
        arrivalDelay: '1 mins'
    },
    {
        id: 3,
        name: 'John F. Kennedy International',
        code: 'JFK',
        city: 'New York',
        country: 'USA',
        status: 'Operational',
        weather: 'Partly Cloudy',
        departureDelay: '12 mins',
        arrivalDelay: '8 mins'
    },
    {
        id: 4,
        name: 'Heathrow Airport',
        code: 'LHR',
        city: 'London',
        country: 'UK',
        status: 'Operational',
        weather: 'Overcast',
        departureDelay: '8 mins',
        arrivalDelay: '6 mins'
    },
    {
        id: 5,
        name: 'Los Angeles International',
        code: 'LAX',
        city: 'Los Angeles',
        country: 'USA',
        status: 'Operational',
        weather: 'Sunny',
        departureDelay: '4 mins',
        arrivalDelay: '2 mins'
    }
];

// Search airport function
function searchAirport() {
    const searchInput = document.getElementById('airportSearch').value.toLowerCase();
    const countryFilter = document.getElementById('countryFilter').value.toLowerCase();
    const resultsContainer = document.getElementById('searchResults');
    
    // Filter airports based on search criteria
    const filteredAirports = airports.filter(airport => {
        const matchesSearch = 
            airport.name.toLowerCase().includes(searchInput) ||
            airport.code.toLowerCase().includes(searchInput) ||
            airport.city.toLowerCase().includes(searchInput);
        
        const matchesCountry = !countryFilter || airport.country.toLowerCase().includes(countryFilter);
        
        return matchesSearch && matchesCountry;
    });

    // Display results
    if (filteredAirports.length === 0) {
        resultsContainer.innerHTML = '<p class="no-results">No airports found. Please try a different search.</p>';
        return;
    }

    let resultsHTML = '<div class="search-results-grid">';
    filteredAirports.forEach(airport => {
        resultsHTML += `
            <div class="result-card">
                <h3>${airport.name}</h3>
                <p><strong>Code:</strong> ${airport.code}</p>
                <p><strong>Location:</strong> ${airport.city}, ${airport.country}</p>
                <p><strong>Status:</strong> <span class="status-badge">${airport.status}</span></p>
                <p><strong>Weather:</strong> ${airport.weather}</p>
                <button class="view-details-btn" onclick="viewAirportDetails('${airport.code}')">View Details</button>
            </div>
        `;
    });
    resultsHTML += '</div>';
    
    resultsContainer.innerHTML = resultsHTML;
}

// View airport details function
function viewAirportDetails(airportCode) {
    const airport = airports.find(a => a.code === airportCode);
    if (airport) {
        alert(`
        Airport Details for ${airport.name}
        
        Code: ${airport.code}
        Location: ${airport.city}, ${airport.country}
        Status: ${airport.status}
        Weather: ${airport.weather}
        
        For full details, scroll to the Live Airport Status section above.
        `);
    }
}

// Initialize Leaflet map for terminal layout
function initializeTerminalMap() {
    // Check if map element exists
    const mapElement = document.getElementById('map');
    if (!mapElement) return;

    // Create map centered on Delhi (example)
    const map = L.map('map').setView([28.5561, 77.1025], 13);

    // Add OpenStreetMap layer
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '© OpenStreetMap contributors',
        maxZoom: 19
    }).addTo(map);

    // Add sample markers for airport facilities
    const facilities = [
        { coords: [28.5561, 77.1025], title: 'Terminal 1', icon: '🛫' },
        { coords: [28.5575, 77.1030], title: 'Terminal 2', icon: '🛫' },
        { coords: [28.5585, 77.1020], title: 'Terminal 3', icon: '🛫' },
        { coords: [28.5555, 77.1010], title: 'Medical Center', icon: '🏥' },
        { coords: [28.5550, 77.1035], title: 'Customs', icon: '📋' }
    ];

    facilities.forEach(facility => {
        const marker = L.marker(facility.coords).addTo(map);
        marker.bindPopup(`<b>${facility.title}</b><br>${facility.icon}`);
    });
}

// Real-time clock for airport operations
function updateCurrentTime() {
    const timeElements = document.querySelectorAll('[data-airport-time]');
    timeElements.forEach(element => {
        const now = new Date();
        element.textContent = now.toLocaleTimeString();
    });
}

// Set up live updates
function setupLiveUpdates() {
    // Update time every second
    setInterval(updateCurrentTime, 1000);
    
    // Simulate flight status updates every 30