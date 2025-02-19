const dotenv = require('dotenv');
dotenv.config();

const dbconnect = require('./src/db/dbconnect');
const app = require('./app');
const PORT = process.env.PORT || 8000;

dbconnect()
    .then(() => {
        app.listen(PORT, () => { console.log(`server running on Port ${PORT}`) });
    })
    .catch((error) => {
        console.log(`Mongodb connection failed: ${error}`);
    });