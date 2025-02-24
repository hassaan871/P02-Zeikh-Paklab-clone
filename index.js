const dotenv = require('dotenv');
dotenv.config();

const http = require('http');
const dbconnect = require('./src/db/dbconnect');
const app = require('./app');
const setupSocket = require('./src/sockets/socket');
const PORT = process.env.PORT || 8000;

const server = http.createServer(app);
setupSocket(server);

dbconnect()
    .then(() => {
        server.listen(PORT, () => { console.log(`server running on Port ${PORT}`) });
    })
    .catch((error) => {
        console.log(`Mongodb connection failed: ${error}`);
    });