// ===== DATABASE CONFIGURATION =====

const { Sequelize } = require('sequelize');
const logger = require('../utils/logger');

const sequelize = new Sequelize(
    process.env.DB_NAME || 'aviation_management',
    process.env.DB_USER || 'root',
    process.env.DB_PASSWORD || '',
    {
        host: process.env.DB_HOST || 'localhost',
        port: process.env.DB_PORT || 3306,
        dialect: 'mysql',
        logging: process.env.NODE_ENV === 'development' ? console.log : false,
        pool: {
            max: 5,
            min: 0,
            acquire: 30000,
            idle: 10000
        },
        define: {
            timestamps: true,
            underscored: true,
            charset: 'utf8mb4',
            collate: 'utf8mb4_unicode_ci'
        }
    }
);

// Test database connection
sequelize.authenticate()
    .then(() => logger.info('Database connection successful'))
    .catch(err => logger.error('Database connection failed:', err));

module.exports = sequelize;