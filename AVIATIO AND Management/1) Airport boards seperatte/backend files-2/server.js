// ===== MAIN SERVER FILE =====
// Mitochondria Digital Millennium Services - Aviation Management Portal

require('dotenv').config();
const express = require('express');
const http = require('http');
const socketIO = require('socket.io');
const cors = require('cors');
const helmet = require('helmet');
const path = require('path');

// Import configurations
const { sequelize } = require('./models');
const logger = require('./utils/logger');
const errorHandler = require('./middleware/errorHandler');

// Import routes
const airportRoutes = require('./routes/airports');
const flightRoutes = require('./routes/flights');
const healthRoutes = require('./routes/health');
const userRoutes = require('./routes/users');

// Initialize Express app
const app = express();
const server = http.createServer(app);
const io = socketIO(server, {
    cors: {
        origin: process.env.FRONTEND_URL || 'http://localhost:3000',
        methods: ['GET', 'POST', 'PUT', 'DELETE'],
        credentials: true
    }
});

// ===== MIDDLEWARE =====

// Security middleware
app.use(helmet());
app.use(cors({
    origin: process.env.FRONTEND_URL || 'http://localhost:3000',
    credentials: true
}));

// Body parser middleware
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ limit: '10mb', extended: true }));

// Request logging middleware
app.use((req, res, next) => {
    logger.info(`${req.method} ${req.path}`);
    next();
});

// ===== STATIC FILES =====
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// ===== API ROUTES =====

// Health check endpoint
app.get('/api/health', (req, res) => {
    res.status(200).json({
        status: 'OK',
        message: 'Aviation Management System is running',
        timestamp: new Date(),
        environment: process.env.NODE_ENV || 'development'
    });
});

// API v1 routes
app.use('/api/v1/airports', airportRoutes);
app.use('/api/v1/flights', flightRoutes);
app.use('/api/v1/health', healthRoutes);
app.use('/api/v1/users', userRoutes);

// Root endpoint
app.get('/', (req, res) => {
    res.status(200).json({
        name: 'Aviation Management System API',
        version: '1.0.0',
        organization: 'Mitochondria Digital Millennium Services',
        endpoints: {
            airports: '/api/v1/airports',
            flights: '/api/v1/flights',
            health: '/api/v1/health',
            users: '/api/v1/users'
        },
        documentation: '/api/docs'
    });
});

// ===== WEBSOCKET (SOCKET.IO) SETUP =====

// Real-time connections namespace
const airportNamespace = io.of('/airports');
const flightNamespace = io.of('/flights');
const healthNamespace = io.of('/health');

// Airport real-time events
airportNamespace.on('connection', (socket) => {
    logger.info(`Client connected to airports namespace: ${socket.id}`);
    
    socket.on('subscribe-airport', (airportCode) => {
        socket.join(`airport-${airportCode}`);
        logger.info(`Client subscribed to airport: ${airportCode}`);
    });

    socket.on('disconnect', () => {
        logger.info(`Client disconnected from airports: ${socket.id}`);
    });
});

// Flight real-time events
flightNamespace.on('connection', (socket) => {
    logger.info(`Client connected to flights namespace: ${socket.id}`);
    
    socket.on('subscribe-flight', (flightNumber) => {
        socket.join(`flight-${flightNumber}`);
        logger.info(`Client subscribed to flight: ${flightNumber}`);
    });

    socket.on('disconnect', () => {
        logger.info(`Client disconnected from flights: ${socket.id}`);
    });
});

// Health services real-time events
healthNamespace.on('connection', (socket) => {
    logger.info(`Client connected to health namespace: ${socket.id}`);
    
    socket.on('subscribe-medical-alert', (airportCode) => {
        socket.join(`medical-${airportCode}`);
        logger.info(`Client subscribed to medical alerts: ${airportCode}`);
    });

    socket.on('disconnect', () => {
        logger.info(`Client disconnected from health: ${socket.id}`);
    });
});

// ===== REAL-TIME DATA UPDATES =====

// Emit airport status updates every 10 seconds
setInterval(async () => {
    try {
        const airports = await sequelize.models.Airport.findAll();
        airports.forEach(airport => {
            airportNamespace.to(`airport-${airport.code}`).emit('airport-status-update', {
                code: airport.code,
                name: airport.name,
                status: airport.status,
                departureDelay: Math.floor(Math.random() * 30),
                arrivalDelay: Math.floor(Math.random() * 20),
                timestamp: new Date()
            });
        });
    } catch (error) {
        logger.error('Error updating airport status:', error);
    }
}, 10000);

// Emit flight status updates every 15 seconds
setInterval(async () => {
    try {
        const flights = await sequelize.models.Flight.findAll();
        flights.forEach(flight => {
            flightNamespace.to(`flight-${flight.flightNumber}`).emit('flight-status-update', {
                flightNumber: flight.flightNumber,
                status: flight.status,
                currentAltitude: Math.floor(Math.random() * 43000),
                speed: Math.floor(Math.random() * 900),
                eta: new Date(Date.now() + Math.random() * 3600000),
                timestamp: new Date()
            });
        });
    } catch (error) {
        logger.error('Error updating flight status:', error);
    }
}, 15000);

// ===== ERROR HANDLING MIDDLEWARE =====
app.use(errorHandler);

// 404 handler
app.use((req, res) => {
    res.status(404).json({
        status: 'error',
        message: 'Route not found',
        path: req.path
    });
});

// ===== DATABASE & SERVER STARTUP =====

const PORT = process.env.PORT || 5000;
const NODE_ENV = process.env.NODE_ENV || 'development';

// Database connection and server startup
sequelize.authenticate()
    .then(() => {
        logger.info('✓ Database connection established');
        
        // Sync database models
        return sequelize.sync({ alter: NODE_ENV === 'development' });
    })
    .then(() => {
        logger.info('✓ Database models synchronized');
        
        // Start server
        server.listen(PORT, () => {
            logger.info(`
╔══════════════════════════════════════════════════╗
║  Aviation Management System - Backend Server      ║
║  Mitochondria Digital Millennium Services         ║
╚══════════════════════════════════════════════════╝

✓ Server running on: http://localhost:${PORT}
✓ Environment: ${NODE_ENV}
✓ WebSocket enabled: socket.io
✓ Database: Connected

API Endpoints:
  • GET  /api/health                - Health check
  • GET  /api/v1/airports           - List airports
  • GET  /api/v1/flights            - List flights
  • GET  /api/v1/health             - Health services
  • POST /api/v1/users/register     - User registration
  • POST /api/v1/users/login        - User login

WebSocket Namespaces:
  • /airports  - Real-time airport updates
  • /flights   - Real-time flight tracking
  • /health    - Medical alerts and services

            `);
        });
    })
    .catch(error => {
        logger.error('Failed to start server:', error);
        process.exit(1);
    });

// ===== GRACEFUL SHUTDOWN =====
process.on('SIGTERM', () => {
    logger.info('SIGTERM signal received: closing HTTP server');
    server.close(() => {
        logger.info('HTTP server closed');
        sequelize.close().then(() => {
            logger.info('Database connection closed');
            process.exit(0);
        });
    });
});

module.exports = { app, server, io };