const express = require('express');
const { Pool } = require('pg');
const path = require("path");
require('dotenv').config();
// require('dotenv').config({
//     path: `.env.${process.env.NODE_ENV || 'development'}`
// });


const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false },
});


module.exports = pool;

