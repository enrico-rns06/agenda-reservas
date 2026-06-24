const express = require('express');
const cors  = require('cors');
require('dotenv').config();

const app = express();

app.use(cors());
app.use(express.json());

app.get('/health', (req, res) => {
    res.json({ status: 'ok', message: "API funcionando!"});
});

const pool = require('./config/database');

app.get('/db-test', async (req, res) => {
    try {
        const result = await pool.query('SELECT NOW()');
        res.json({ connected: true, time: result.rows[0].now });
    } catch (err) {
        res.status(500).json({ connected: false, error: err.message })
    }
});

const userRoutes = require('./routes/userRoutes');
app.use('/users', userRoutes);

const bookingRoutes = require('./routes/bookingRoutes');
app.use('/bookings', bookingRoutes);


module.exports = app;