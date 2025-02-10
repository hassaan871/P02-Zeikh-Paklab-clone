const routes = require('./src/routes/routes');
const path = require('path');
const express = require('express');
const app = express();

app.use(express.json());

app.use('/api',routes);

module.exports = app;