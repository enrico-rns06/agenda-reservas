const pool = require('../config/database');
const { sendBookingConfirmation, sendBookingCancellation } = require('../services/emailService');

async function create(req, res) {
  const { client_id, professional_id, service_id, date, time } = req.body;

  try {
    const result = await pool.query(
      `INSERT INTO bookings (client_id, professional_id, service_id, date, time)
       VALUES ($1, $2, $3, $4, $5) RETURNING *`,
      [client_id, professional_id, service_id, date, time]
    );

    res.status(201).json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

async function list(req, res) {
  try {
    const result = await pool.query(`
      SELECT 
        b.id,
        b.date,
        b.time,
        b.status,
        c.name AS client_name,
        c.email AS client_email,
        p.name AS professional_name,
        s.name AS service_name,
        s.duration_minutes,
        s.price
      FROM bookings b
      JOIN users c ON b.client_id = c.id
      JOIN users p ON b.professional_id = p.id
      JOIN services s ON b.service_id = s.id
      ORDER BY b.date, b.time
    `);

    res.json(result.rows);
  } catch (err) {
    console.error('Erro updateStatus:', err);
    res.status(500).json({ error: err.message });
  }
}

async function updateStatus(req, res) {
  const { id } = req.params;
  const { status } = req.body;

  const validStatus = ['pending', 'confirmed', 'cancelled'];
  if (!validStatus.includes(status)) {
    return res.status(400).json({ error: 'Status inválido' });
  }

  try {
    const result = await pool.query(
      `UPDATE bookings SET status = $1 WHERE id = $2 RETURNING *`,
      [status, id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Agendamento não encontrado' });
    }

    const booking = result.rows[0];

    const details = await pool.query(`
      SELECT 
        c.name AS client_name,
        c.email AS client_email,
        p.name AS professional_name,
        s.name AS service_name,
        b.date,
        b.time
      FROM bookings b
      JOIN users c ON b.client_id = c.id
      JOIN users p ON b.professional_id = p.id
      JOIN services s ON b.service_id = s.id
      WHERE b.id = $1
    `, [id]);

    const info = details.rows[0];

    if (status === 'confirmed') {
      await sendBookingConfirmation(info);
    } else if (status === 'cancelled') {
      await sendBookingCancellation(info);
    }

    res.json(booking);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

module.exports = { create, list, updateStatus };