/*
    In this file we will configure the database connection.
*/

require('dotenv').config();

const DB_USER = process.env.DB_USER;
const DB_PASSWORD = process.env.DB_PASSWORD;
const DB_HOST = process.env.DB_HOST;
const DB_NAME = process.env.DB_NAME;

const config = {
    host: DB_HOST,
    port: 3306,
    password: DB_PASSWORD,
    user: DB_USER,
    database: DB_NAME
};

module.exports = config;