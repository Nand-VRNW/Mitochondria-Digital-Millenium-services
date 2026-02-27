// ===== FLIGHT MODEL =====

const { DataTypes } = require('sequelize');
const { v4: uuidv4 } = require('uuid');

module.exports = (sequelize) => {
    const Flight = sequelize.define('Flight', {
        id: {
            type: DataTypes.STRING(36),
            primaryKey: true,
            defaultValue: () => uuidv4()
        },
        flightNumber: {
            type: DataTypes.STRING(10),
            allowNull: false,
            unique: true,
            validate: {
                len: [5, 10]
            }
        },
        airline: {
            type: DataTypes.STRING(100),
            allowNull: false
        },
        departureAirportId: {
            type: DataTypes.STRING(36),
            allowNull: false,
            references: {
                model: 'airports',
                key: 'id'
            }
        },
        arrivalAirportId: {
            type: DataTypes.STRING(36),
            allowNull: false,
            references: {
                model: 'airports',
                key: 'id'
            }
        },
        departureTime: {
            type: DataTypes.DATE,
            allowNull: false
        },
        arrivalTime: {
            type: DataTypes.DATE,
            allowNull: false
        },
        status: {
            type: DataTypes.ENUM('scheduled', 'boarding', 'departed', 'in_flight', 'landed', 'cancelled', 'delayed'),
            defaultValue: 'scheduled'
        },
        gate: {
            type: DataTypes.STRING(10)
        },
        runway: {
            type: DataTypes.STRING(10)
        },
        aircraftType: {
            type: DataTypes.STRING(50)
        },
        capacity: {
            type: DataTypes.INTEGER,
            defaultValue: 180
        },
        currentPassengers: {
            type: DataTypes.INTEGER,
            defaultValue: 0
        },
        delayMinutes: {
            type: DataTypes.INTEGER,
            defaultValue: 0
        },
        currentAltitude: {
            type: DataTypes.INTEGER,
            defaultValue: 0
        },
        currentSpeed: {
            type: DataTypes.INTEGER,
            defaultValue: 0
        },
        lastUpdate: {
            type: DataTypes.DATE,
            defaultValue: DataTypes.NOW
        }
    }, {
        tableName: 'flights',
        timestamps: true,
        indexes: [
            { fields: ['flightNumber'] },
            { fields: ['status'] },
            { fields: ['departureTime'] }
        ]
    });

    return Flight;
};