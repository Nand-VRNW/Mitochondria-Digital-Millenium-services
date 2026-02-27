// ===== REAL-TIME UPDATES WITH SOCKET.IO =====

// Connect to Socket.io namespaces
const airportSocket = io('/airports');
const flightSocket = io('/flights');
const healthSocket = io('/health');

// Subscribe to airport updates
function subscribeToAirportUpdates(airportCode) {
    airportSocket.emit('subscribe-airport', airportCode);

    airportSocket.on('airport-status-update', (data) => {
        console.log('Airport status updated:', data);
        updateAirportStatusUI(data);
    });
}

// Subscribe to flight updates
function subscribeToFlightUpdates(flightNumber) {
    flightSocket.emit('subscribe-flight', flightNumber);

    flightSocket.on('flight-status-update', (data) => {
        console.log('Flight status updated:', data);
        updateFlightStatusUI(data);
    });
}

// Subscribe to medical alerts
function subscribeToMedicalAlerts(airportCode) {
    healthSocket.emit('subscribe-medical-alert', airportCode);

    healthSocket.on('medical-alert', (data) => {
        console.log('Medical alert received:', data);
        showMedicalAlert(data);
    });
}

// Update airport status in UI
function updateAirportStatusUI(data) {
    const statusElement = document.querySelector(`[data-airport-code="${data.code}"]`);
    if (statusElement) {
        statusElement.innerHTML = `
            <h3>${data.code}</h3>
            <p><strong>Status:</strong> <span class="status-operational">${data.status}</span></p>
            <p><strong>Departure Delay:</strong> ${data.departureDelay} mins</p>
            <p><strong>Arrival Delay:</strong> ${data.arrivalDelay} mins</p>
            <p><small>Last updated: ${new Date(data.timestamp).toLocaleTimeString()}</small></p>
        `;
    }
}

// Update flight status in UI
function updateFlightStatusUI(data) {
    const flightElement = document.querySelector(`[data-flight-number="${data.flightNumber}"]`);
    if (flightElement) {
        flightElement.innerHTML = `
            <td>${data.flightNumber}</td>
            <td>${data.currentAltitude} ft</td>
            <td>${data.speed} km/h</td>
            <td>${new Date(data.eta).toLocaleTimeString()}</td>
            <td><span class="status-${data.status.toLowerCase()}">${data.status}</span></td>
        `;
    }
}

// Show medical alerts
function showMedicalAlert(data) {
    const alertDiv = document.createElement('div');
    alertDiv.className = 'alert alert-warning';
    alertDiv.innerHTML = `
        <h4>🚑 Medical Alert</h4>
        <p><strong>Airport:</strong> ${data.airportCode}</p>
        <p><strong>Condition:</strong> ${data.condition}</p>
        <p><strong>Severity:</strong> ${data.severity}</p>
        <p><small>Time: ${new Date().toLocaleTimeString()}</small></p>
    `;
    document.body.insertBefore(alertDiv, document.body.firstChild);
}

// Initialize real-time updates on page load
document.addEventListener('DOMContentLoaded', () => {
    subscribeToAirportUpdates('DEL');
    subscribeToFlightUpdates('AI-101');
    subscribeToMedicalAlerts('DEL');
});