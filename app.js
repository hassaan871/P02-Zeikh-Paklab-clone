const routes = require('./src/routes/routes');
const path = require('path');
const cors = require("cors");
const express = require('express');
const app = express();

app.set('view engine', 'ejs');

app.use(express.static(path.join(__dirname,'views')));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());

app.use('/api',routes);

module.exports = app;