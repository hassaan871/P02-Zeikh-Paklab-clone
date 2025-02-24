const routes = require('./src/routes/routes');
const path = require('path');
const cors = require("cors");
const express = require('express');
const app = express();

app.set('view engine', 'ejs');

app.set('views', path.join(__dirname, 'src', 'views'));
app.use(express.static(path.join(__dirname, 'src','views')));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());

app.get('/', (req, res) => {
    res.render('index.ejs');
})

app.use('/api',routes);

module.exports = app;