require('dotenv').config();
const pool = require('./database');

async function runMigrations() {
    await pool.query(`
    CREATE TABLE IF NOT EXISTS users (
      id SERIAL PRIMARY KEY,
      name VARCHAR(100) NOT NULL,
      email VARCHAR(100) UNIQUE NOT NULL,
      password VARCHAR(255) NOT NULL,
      role VARCHAR(20) NOT NULL DEFAULT 'client',
      created_at TIMESTAMP DEFAULT NOW()
    );

    CREATE TABLE IF NOT EXISTS services (
      id SERIAL PRIMARY KEY,
      name VARCHAR(100) NOT NULL,
      duration_minutes INTEGER NOT NULL,
      price NUMERIC(10,2),
      created_at TIMESTAMP DEFAULT NOW()
    );

    CREATE TABLE IF NOT EXISTS bookings (
      id SERIAL PRIMARY KEY,
      client_id INTEGER REFERENCES users(id),
      professional_id INTEGER REFERENCES users(id),
      service_id INTEGER REFERENCES services(id),
      date DATE NOT NULL,
      time TIME NOT NULL,
      status VARCHAR(20) DEFAULT 'pending',
      created_at TIMESTAMP DEFAULT NOW()
    );
  `);

  console.log('Migrations executadas com sucesso!');
  await pool.end();
}

runMigrations().catch(console.error);