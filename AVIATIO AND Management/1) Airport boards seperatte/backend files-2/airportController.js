// ===== AIRPORT CONTROLLER =====

const { Airport, Flight, WeatherData } = require('../models');
const logger = require('../utils/logger');
const { v4: uuidv4 } = require('uuid');

// Get all airports
exports.getAllAirports = async (req, res, next) => {
    try {
        const { page = 1, limit = 10, country, status } = req.query;
        const offset = (page - 1) * limit;

        const where = {};
        if (country) where.country = country;
        if (status) where.status = status;

        const { count, rows } = await Airport.findAndCountAll({
            where,
            limit: parseInt(limit),
            offset: parseInt(offset),
            order: [['name', 'ASC']]
        });

        res.status(200).json({
            success: true,
            data: rows,
            pagination: {
                total: count,
                page: parseInt(page),
                limit: parseInt(limit),
                totalPages: Math.ceil(count / limit)
            }
        });
    } catch (error) {
        logger.error('Error fetching airports:', error);
        next(error);
    }
};

// Get single airport with details
exports.getAirportById = async (req, res, next) => {
    try {
        const { id } = req.params;

        const airport = await Airport.findByPk(id, {
            include: [
                {
                    association: 'flights',
                    separate: true
                },
                {
                    association: 'healthServices',
                    separate: true
                },
                {
                    association: 'facilities',
                    separate: true
                },
                {
                    association: 'weather',
                    separate: true
                }
            ]
        });

        if (!airport) {
            return res.status(404).json({
                success: false,
                message: 'Airport not found'
            });
        }

        res.status(200).json({
            success: true,
            data: airport
        });
    } catch (error) {
        logger.error('Error fetching airport:', error);
        next(error);
    }
};

// Get airport by code
exports.getAirportByCode = async (req, res, next) => {
    try {
        const { code } = req.params;

        const airport = await Airport.findOne({
            where: { code: code.toUpperCase() }
        });

        if (!airport) {
            return res.status(404).json({
                success: false,
                message: 'Airport not found'
            });
        }

        res.status(200).json({
            success: true,
            data: airport
        });
    } catch (error) {
        logger.error('Error fetching airport by code:', error);
        next(error);
    }
};

// Create new airport
exports.createAirport = async (req, res, next) => {
    try {
        const { name, code, city, country, latitude, longitude, totalTerminals, totalGates, emergencyContact, mainPhone } = req.body;

        // Validation
        if (!name || !code || !city || !country) {
            return res.status(400).json({
                success: false,
                message: 'Missing required fields'
            });
        }

        const airport = await Airport.create({
            id: uuidv4(),
            name,
            code: code.toUpperCase(),
            city,
            country,
            latitude,
            longitude,
            totalTerminals,
            totalGates,
            emergencyContact,
            mainPhone
        });

        logger.info(`New airport created: ${airport.code}`);

        res.status(201).json({
            success: true,
            message: 'Airport created successfully',
            data: airport
        });
    } catch (error) {
        logger.error('Error creating airport:', error);
        next(error);
    }
};

// Update airport
exports.updateAirport = async (req, res, next) => {
    try {
        const { id } = req.params;
        const updates = req.body;

        const airport = await Airport.findByPk(id);

        if (!airport) {
            return res.status(404).json({
                success: false,
                message: 'Airport not found'
            });
        }

        await airport.update(updates);

        logger.info(`Airport updated: ${airport.code}`);

        res.status(200).json({
            success: true,
            message: 'Airport updated successfully',
            data: airport
        });
    } catch (error) {
        logger.error('Error updating airport:', error);
        next(error);
    }
};

// Get airport status and operational metrics
exports.getAirportStatus = async (req, res, next) => {
    try {
        const { code } = req.params;

        const airport = await Airport.findOne({
            where: { code: code.toUpperCase() }
        });

        if (!airport) {
            return res.status(404).json({
                success: false,
                message: 'Airport not found'
            });
        }

        // Get flight statistics
        const flights = await Flight.findAll({
            where: {
                [require('sequelize').Op.or]: [
                    { departureAirportId: airport.id },
                    { arrivalAirportId: airport.id }
                ]
            }
        });

        const statusCount = {
            scheduled: flights.filter(f => f.status === 'scheduled').length,
            boarding: flights.filter(f => f.status === 'boarding').length,
            departed: flights.filter(f => f.status === 'departed').length,
            inFlight: flights.filter(f => f.status === 'in_flight').length,
            landed: flights.filter(f => f.status === 'landed').length,
            delayed: flights.filter(f => f.status === 'delayed').length,
            cancelled: flights.filter(f => f.status === 'cancelled').length
        };

        const avgDelay = flights.length > 0
            ? Math.round(flights.reduce((sum, f) => sum + f.delayMinutes, 0) / flights.length)
            : 0;

        res.status(200).json({
            success: true,
            data: {
                airport,
                flightStats: {
                    totalFlights: flights.length,
                    statusCount,
                    averageDelay: avgDelay
                }
            }
        });
    } catch (error) {
        logger.error('Error fetching airport status:', error);
        next(error);
    }
};