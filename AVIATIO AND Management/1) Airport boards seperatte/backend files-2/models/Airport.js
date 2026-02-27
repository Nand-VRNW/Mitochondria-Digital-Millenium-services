// ===== AIRPORT MODEL =====

const { DataTypes } = require('sequelize');
const { v4: uuidv4 } = require('uuid');

module.exports = (sequelize) => {
    const Airport = sequelize.define('Airport', {
        id: {
            type: DataTypes.STRING(36),
            primaryKey: true,
            defaultValue: () => uuidv4()
        },
        name: {
            type: DataTypes.STRING(255),
            allowNull: false,
            unique: true,
            validate: {
                len: [5, 255]
            }
        },
        code: {
            type: DataTypes.STRING(10),
            allowNull: false,
            unique: true,
            validate: {
                len: [3, 10],
                isUppercase: true
            }
        },
        city: {
            type: DataTypes.STRING(100),
            allowNull: false
        },
        country: {
            type: DataTypes.STRING(100),
            allowNull: false
        },
        latitude: {
            type: DataTypes.DECIMAL(10, 8)
        },
        longitude: {
            type: DataTypes.DECIMAL(11, 8)
        },
        status: {
            type: DataTypes.ENUM('operational', 'maintenance', 'closed'),
            defaultValue: 'operational'
        },
        totalTerminals: {
            type: DataTypes.INTEGER,
            defaultValue: 1
        },
        totalGates: {
            type: DataTypes.INTEGER,
            defaultValue: 50
        },
        operatingHours: {
            type: DataTypes.STRING(100)
        },
        emergencyContact: {
            type: DataTypes.STRING(20)
        },
        mainPhone: {
            type: DataTypes.STRING(20)
        },
        description: {
            type: DataTypes.TEXT
        }
    }, {
        tableName: 'airports',
        timestamps: true,
        indexes: [
            { fields: ['code'] },
            { fields: ['country'] },
            { fields: ['status'] }
        ]
    });

    return Airport;
};