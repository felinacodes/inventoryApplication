const express = require('express');
const { Pool } = require('pg');
require('dotenv').config();


const pool = new Pool({
    host: process.env.HOST,
    user: process.env.USER,
    database: process.env.DATABASE,
    password: process.env.PASSWORD,
    port: process.env.PORT,
    app_port: process.env.APP_PORT,
    ssl: {
        rejectUnauthorized: false
    },
});

module.exports = pool;

