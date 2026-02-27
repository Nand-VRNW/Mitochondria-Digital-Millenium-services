-- ===== AVIATION MANAGEMENT SYSTEM DATABASE SCHEMA =====
-- Created for Mitochondria Digital Millennium Services

-- Create Database
CREATE DATABASE IF NOT EXISTS aviation_management;
USE aviation_management;

-- ===== USERS TABLE =====
CREATE TABLE IF NOT EXISTS users (
    id VARCHAR(36) PRIMARY KEY,
    email VARCHAR(255) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    firstName VARCHAR(100),
    lastName VARCHAR(100),
    phone VARCHAR(20),
    role ENUM('admin', 'user', 'medical_staff', 'airport_staff') DEFAULT 'user',
    status ENUM('active', 'inactive', 'suspended') DEFAULT 'active',
    createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_email (email),
    INDEX idx_role (role)
);

-- ===== AIRPORTS TABLE =====
CREATE TABLE IF NOT EXISTS airports (
    id VARCHAR(36) PRIMARY KEY,
    name VARCHAR(255) NOT NULL UNIQUE,
    code VARCHAR(10) UNIQUE NOT NULL,
    city VARCHAR(100) NOT NULL,
    country VARCHAR(100) NOT NULL,
    latitude DECIMAL(10, 8),
    longitude DECIMAL(11, 8),
    status ENUM('operational', 'maintenance', 'closed') DEFAULT 'operational',
    totalTerminals INT DEFAULT 1,
    totalGates INT DEFAULT 50,
    operatingHours VARCHAR(100),
    emergencyContact VARCHAR(20),
    mainPhone VARCHAR(20),
    description LONGTEXT,
    createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_code (code),
    INDEX idx_country (country)
);

-- ===== FLIGHTS TABLE =====
CREATE TABLE IF NOT EXISTS flights (
    id VARCHAR(36) PRIMARY KEY,
    flightNumber VARCHAR(10) UNIQUE NOT NULL,
    airline VARCHAR(100) NOT NULL,
    departureAirportId VARCHAR(36) NOT NULL,
    arrivalAirportId VARCHAR(36) NOT NULL,
    departureTime DATETIME NOT NULL,
    arrivalTime DATETIME NOT NULL,
    status ENUM('scheduled', 'boarding', 'departed', 'in_flight', 'landed', 'cancelled', 'delayed') DEFAULT 'scheduled',
    gate VARCHAR(10),
    runway VARCHAR(10),
    aircraftType VARCHAR(50),
    capacity INT DEFAULT 180,
    currentPassengers INT DEFAULT 0,
    delayMinutes INT DEFAULT 0,
    currentAltitude INT DEFAULT 0,
    currentSpeed INT DEFAULT 0,
    lastUpdate TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (departureAirportId) REFERENCES airports(id),
    FOREIGN KEY (arrivalAirportId) REFERENCES airports(id),
    INDEX idx_flightNumber (flightNumber),
    INDEX idx_status (status),
    INDEX idx_departureTime (departureTime)
);

-- ===== HEALTH SERVICES TABLE =====
CREATE TABLE IF NOT EXISTS health_services (
    id VARCHAR(36) PRIMARY KEY,
    airportId VARCHAR(36) NOT NULL,
    serviceName VARCHAR(100) NOT NULL,
    serviceType ENUM('emergency', 'clinic', 'oxygen', 'isolation', 'screening') NOT NULL,
    location VARCHAR(255),
    operatingHours VARCHAR(100),
    staffOnDuty INT DEFAULT 1,
    availability ENUM('available', 'busy', 'unavailable') DEFAULT 'available',
    equipment LONGTEXT,
    contactPerson VARCHAR(100),
    contactPhone VARCHAR(20),
    createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (airportId) REFERENCES airports(id),
    INDEX idx_airportId (airportId),
    INDEX idx_serviceType (serviceType)
);

-- ===== MEDICAL ALERTS TABLE =====
CREATE TABLE IF NOT EXISTS medical_alerts (
    id VARCHAR(36) PRIMARY KEY,
    airportId VARCHAR(36) NOT NULL,
    flightId VARCHAR(36),
    patientName VARCHAR(100),
    condition VARCHAR(255),
    severity ENUM('low', 'medium', 'high', 'critical') DEFAULT 'medium',
    status ENUM('new', 'assigned', 'in_progress', 'resolved') DEFAULT 'new',
    assignedTo VARCHAR(36),
    description LONGTEXT,
    responseTime INT,
    createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (airportId) REFERENCES airports(id),
    FOREIGN KEY (flightId) REFERENCES flights(id),
    FOREIGN KEY (assignedTo) REFERENCES users(id),
    INDEX idx_severity (severity),
    INDEX idx_status (status)
);

-- ===== FACILITIES TABLE =====
CREATE TABLE IF NOT EXISTS facilities (
    id VARCHAR(36) PRIMARY KEY,
    airportId VARCHAR(36) NOT NULL,
    facilityType VARCHAR(100) NOT NULL,
    name VARCHAR(255),
    location VARCHAR(255),
    available BOOLEAN DEFAULT TRUE,
    capacity INT,
    wheelchairAccessible BOOLEAN DEFAULT FALSE,
    operatingHours VARCHAR(100),
    createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (airportId) REFERENCES airports(id),
    INDEX idx_airportId (airportId)
);

-- ===== WEATHER DATA TABLE =====
CREATE TABLE IF NOT EXISTS weather_data (
    id VARCHAR(36) PRIMARY KEY,
    airportId VARCHAR(36) NOT NULL,
    temperature DECIMAL(5, 2),
    windSpeed DECIMAL(5, 2),
    visibility DECIMAL(5, 2),
    condition VARCHAR(100),
    humidity INT,
    pressure INT,
    flightImpact ENUM('none', 'low', 'medium', 'high') DEFAULT 'none',
    updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (airportId) REFERENCES airports(id),
    INDEX idx_airportId (airportId)
);

-- ===== PASSENGER SERVICES TABLE =====
CREATE TABLE IF NOT EXISTS passenger_services (
    id VARCHAR(36) PRIMARY KEY,
    flightId VARCHAR(36) NOT NULL,
    specialMeal VARCHAR(100),
    wheelchairRequired BOOLEAN DEFAULT FALSE,
    oxygenRequired BOOLEAN DEFAULT FALSE,
    medicalNeeds LONGTEXT,
    mealPreference VARCHAR(100),
    seatPreference VARCHAR(50),
    createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (flightId) REFERENCES flights(id),
    INDEX idx_flightId (flightId)
);

-- ===== AUDIT LOG TABLE =====
CREATE TABLE IF NOT EXISTS audit_logs (
    id VARCHAR(36) PRIMARY KEY,
    userId VARCHAR(36),
    action VARCHAR(255) NOT NULL,
    tableName VARCHAR(100),
    recordId VARCHAR(36),
    changes LONGTEXT,
    ipAddress VARCHAR(45),
    createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (userId) REFERENCES users(id),
    INDEX idx_userId (userId),
    INDEX idx_createdAt (createdAt)
);

-- ===== SYSTEM NOTIFICATIONS TABLE =====
CREATE TABLE IF NOT EXISTS system_notifications (
    id VARCHAR(36) PRIMARY KEY,
    userId VARCHAR(36),
    title VARCHAR(255) NOT NULL,
    message LONGTEXT NOT NULL,
    type ENUM('alert', 'info', 'warning', 'error') DEFAULT 'info',
    isRead BOOLEAN DEFAULT FALSE,
    createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (userId) REFERENCES users(id),
    INDEX idx_userId (userId),
    INDEX idx_isRead (isRead)
);

-- ===== CREATE INDEXES FOR PERFORMANCE =====
CREATE INDEX idx_airports_status ON airports(status);
CREATE INDEX idx_flights_departureTime ON flights(departureTime);
CREATE INDEX idx_flights_status ON flights(status);
CREATE INDEX idx_medical_alerts_severity ON medical_alerts(severity);
CREATE INDEX idx_medical_alerts_status ON medical_alerts(status);

-- ===== VIEW: AIRPORT OPERATIONAL STATUS =====
CREATE VIEW v_airport_status AS
SELECT 
    a.id,
    a.code,
    a.name,
    a.city,
    a.country,
    a.status,
    COUNT(DISTINCT f.id) as totalFlights,
    SUM(CASE WHEN f.status = 'departed' THEN 1 ELSE 0 END) as departedFlights,
    SUM(CASE WHEN f.status = 'landed' THEN 1 ELSE 0 END) as landedFlights,
    SUM(CASE WHEN f.status = 'delayed' THEN 1 ELSE 0 END) as delayedFlights,
    AVG(f.delayMinutes) as avgDelay,
    w.temperature,
    w.windSpeed,
    w.condition
FROM airports a
LEFT JOIN flights f ON (a.id = f.departureAirportId OR a.id = f.arrivalAirportId)
LEFT JOIN weather_data w ON a.id = w.airportId
GROUP BY a.id, a.code, a.name;

-- ===== VIEW: ACTIVE FLIGHTS =====
CREATE VIEW v_active_flights AS
SELECT 
    f.id,
    f.flightNumber,
    f.airline,
    a1.code as departureCode,
    a2.code as arrivalCode,
    f.status,
    f.gate,
    f.currentAltitude,
    f.currentSpeed,
    f.delayMinutes
FROM flights f
JOIN airports a1 ON f.departureAirportId = a1.id
JOIN airports a2 ON f.arrivalAirportId = a2.id
WHERE f.status IN ('boarding', 'departed', 'in_flight');