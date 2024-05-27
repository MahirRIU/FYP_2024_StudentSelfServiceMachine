const express = require('express');
const PORT = process.env.PORT || 8000;

const cors = require('cors');
const bodyParser = require('body-parser');

const dotenv = require('dotenv');
const app = express();

require('./db');
app.use(bodyParser.json());


const allowedOrigins = [process.env.FRONTEND_URL];
app.use(
    cors({
        origin: function (orgin, callback) {
            if (!origin || allowedOrigins.includes(origin)) {
                callback(null, true);
            } else {
                callback(new Error('Not allowed by CORS'));
            }
        },
        credentials: true,
    })    
)

app.listen(PORT, () => {
    console.log('Server running at ' + PORT);
});

