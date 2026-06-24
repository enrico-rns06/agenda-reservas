const pool = require('../config/database');

async function list(req, res) {
    try {
        const result = await pool.query('SELECT * FROM services');
        res.json(result.rows);
    }catch (err) {
        res.status(500).json({ error: err.message});
    }
}

module.exports = { list };