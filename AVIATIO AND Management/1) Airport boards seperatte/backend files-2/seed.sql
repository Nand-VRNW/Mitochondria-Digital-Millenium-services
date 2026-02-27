-- ===== SAMPLE DATA FOR AVIATION MANAGEMENT SYSTEM =====

USE aviation_management;

-- ===== INSERT USERS =====
INSERT INTO users (id, email, password, firstName, lastName, role, status) VALUES
('user-001', 'admin@mitochondria.com', '$2a$10$...hashed_password...', 'Admin', 'User', 'admin', 'active'),
('user-002', 'medical1@airport.com', '$2a$10$...hashed_password...', 'Dr. Raj', 'Kumar', 'medical_staff', 'active'),
('user-003', 'staff@airport.com', '$2a$10$...hashed_password...', 'John', 'Doe', 'airport_staff', 'active');

-- ===== INSERT AIRPORTS =====
INSERT INTO airports (id, name, code, city, country, latitude, longitude, status, totalTerminals, totalGates, emergencyContact, mainPhone) VALUES
('airport-001', 'Indira Gandhi International Airport', 'DEL', 'New Delhi', 'India', 28.5561, 77.1025, 'operational', 4, 90, '+91-XXXXXXXXXX', '+91-XXXXXXXXXX'),
('airport-002', 'Dubai International Airport', 'DXB', 'Dubai', 'UAE', 25.2528, 55.3644, 'operational', 3, 110, '+971-XXXXXXXXX', '+971-XXXXXXXXX'),
('airport-003', 'John F. Kennedy International Airport', 'JFK', 'New York', 'USA', 40.6413, -73.7781, 'operational', 6, 120, '+1-XXXXXXXXXX', '+1-XXXXXXXXXX'),
('airport-004', 'London Heathrow Airport', 'LHR', 'London', 'UK', 51.4700, -0.4543, 'operational', 5, 100, '+44-XXXXXXXXX', '+44-XXXXXXXXX'),
('airport-005', 'Los Angeles International Airport', 'LAX', 'Los Angeles', 'USA', 33.9425, -118.4081, 'operational', 9, 150, '+1-XXXXXXXXXX', '+1-XXXXXXXXXX');

-- ===== INSERT FLIGHTS =====
INSERT INTO flights (id, flightNumber, airline, departureAirportId, arrivalAirportId, departureTime, arrivalTime, status, gate, aircraftType, capacity, delayMinutes) VALUES
('flight-001', 'AI-101', 'Air India', 'airport-001', 'airport-002', '2026-02-26 14:30:00', '2026-02-26 18:45:00', 'boarding', 'A7', 'Boeing 777', 350, 0),
('flight-002', 'AI-205', 'Air India', 'airport-001', 'airport-002', '2026-02-26 15:00:00', '2026-02-26 19:15:00', 'boarding', 'B12', 'Airbus A320', 180, 5),
('flight-003', '6E-330', 'IndiGo', 'airport-001', 'airport-002', '2026-02-26 15:45:00', '2026-02-26 20:00:00', 'delayed', 'C5', 'Airbus A320', 180, 15),
('flight-004', 'BA-117', 'British Airways', 'airport-004', 'airport-001', '2026-02-26 22:00:00', '2026-02-27 08:30:00', 'scheduled', NULL, 'Boeing 787', 250, 0),
('flight-005', 'EK-555', 'Emirates', 'airport-002', 'airport-001', '2026-02-26 12:00:00', '2026-02-26 16:15:00', 'landed', 'A2', 'Boeing 777', 350, 0);

-- ===== INSERT HEALTH SERVICES =====
INSERT INTO health_services (id, airportId, serviceName, serviceType, location, staffOnDuty, availability, contactPhone) VALUES
('health-001', 'airport-001', 'Medical Clinic', 'clinic', 'Terminal 2, Level 2', 4, 'available', '+91-XXXXXXXXXX'),
('health-002', 'airport-001', 'Emergency Response', 'emergency', 'Terminal 2, Level 1', 6, 'available', '+91-XXXXXXXXXX'),
('health-003', 'airport-002', 'Medical Clinic', 'clinic', 'Terminal 1, Level 3', 3, 'available', '+971-XXXXXXXXX'),
('health-004', 'airport-003', 'Emergency Response', 'emergency', 'Terminal 4, Level 1', 8, 'available', '+1-XXXXXXXXXX');

-- ===== INSERT FACILITIES =====
INSERT INTO facilities (id, airportId, facilityType, name, location, available, capacity, wheelchairAccessible) VALUES
('facility-001', 'airport-001', 'Prayer Room', 'Multi-faith Prayer Room', 'Terminal 2, Level 2', TRUE, 30, TRUE),
('facility-002', 'airport-001', 'Rest Area', 'Sleeping Pods', 'Terminal 2, Level 3', TRUE, 20, TRUE),
('facility-003', 'airport-002', 'Lounge', 'Sky Premium Lounge', 'Terminal 1, Level 3', TRUE, 150, TRUE),
('facility-004', 'airport-003', 'Restaurant', 'Main Food Court', 'Terminal 4, Level 2', TRUE, 500, TRUE);

-- ===== INSERT WEATHER DATA =====
INSERT INTO weather_data (id, airportId, temperature, windSpeed, visibility, condition, humidity, pressure, flightImpact) VALUES
('weather-001', 'airport-001', 28.5, 12, 5, 'Clear', 45, 1013, 'none'),
('weather-002', 'airport-002', 35, 8, 8, 'Clear, Sunny', 30, 1010, 'none'),
('weather-003', 'airport-003', 15, 25, 6, 'Partly Cloudy', 60, 1015, 'low'),
('weather-004', 'airport-004', 12, 18, 4, 'Overcast', 70, 1008, 'low');