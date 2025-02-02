const express = require('express');
const { Pool } = require('pg');
const path = require("path");
require('dotenv').config();
// require('dotenv').config({
//     path: `.env.${process.env.NODE_ENV || 'development'}`
// });


const pool = new Pool({
    host: process.env.HOST,
    user: process.env.USER,
    database: process.env.DATABASE,
    password: process.env.PASSWORD,
    port: process.env.PORT || 5432,
    app_port: process.env.APP_PORT,
    ssl: {
        rejectUnauthorized: false
    },
});

module.exports = pool;

