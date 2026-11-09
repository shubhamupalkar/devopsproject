const express = require('express');
const cors = require('cors');
const { Pool } = require('pg');
require('dotenv').config();

const app = express();
const port = process.env.PORT || 5000;

// Enable CORS and JSON parsing
app.use(cors());
app.use(express.json());

// Request logger middleware
app.use((req, res, next) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.url}`);
  next();
});

// PostgreSQL connection pool configuration
const pool = new Pool({
  host: process.env.DB_HOST || 'localhost',
  port: parseInt(process.env.DB_PORT || '5432', 10),
  user: process.env.DB_USER || 'postgres',
  password: process.env.DB_PASSWORD || 'postgres',
  database: process.env.DB_NAME || 'devops_db',
  max: 10,
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 5000,
});

pool.on('error', (err) => {
  console.error('Unexpected error on idle PostgreSQL client:', err);
});

// 1. Healthcheck endpoint
app.get('/api/health', async (req, res) => {
  try {
    const startTime = Date.now();
    const dbRes = await pool.query('SELECT NOW() as db_time, version() as db_version');
    const latency = Date.now() - startTime;

    res.json({
      status: 'OK',
      service: 'Node.js Express Backend',
      uptime: `${Math.floor(process.uptime())}s`,
      database: {
        status: 'Connected',
        latency: `${latency}ms`,
        dbTime: dbRes.rows[0].db_time,
        version: dbRes.rows[0].db_version.split(',')[0],
      },
      environment: process.env.NODE_ENV || 'production',
    });
  } catch (error) {
    console.error('Healthcheck database query error:', error.message);
    res.status(503).json({
      status: 'Degraded',
      service: 'Node.js Express Backend',
      uptime: `${Math.floor(process.uptime())}s`,
      database: {
        status: 'Disconnected',
        error: error.message,
      },
    });
  }
});

// 2. Get all items
app.get('/api/items', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM items ORDER BY id DESC');
    res.json({ success: true, count: result.rows.length, data: result.rows });
  } catch (error) {
    console.error('Error fetching items:', error.message);
    res.status(500).json({ success: false, error: 'Failed to fetch items from database' });
  }
});

// 3. Create a new item
app.post('/api/items', async (req, res) => {
  const { title, description } = req.body;

  if (!title || title.trim() === '') {
    return res.status(400).json({ success: false, error: 'Title is required' });
  }

  try {
    const result = await pool.query(
      'INSERT INTO items (title, description) VALUES ($1, $2) RETURNING *',
      [title.trim(), (description || '').trim()]
    );
    res.status(201).json({ success: true, data: result.rows[0] });
  } catch (error) {
    console.error('Error creating item:', error.message);
    res.status(500).json({ success: false, error: 'Failed to insert item into database' });
  }
});

// 4. Delete an item by ID
app.delete('/api/items/:id', async (req, res) => {
  const { id } = req.params;

  try {
    const result = await pool.query('DELETE FROM items WHERE id = $1 RETURNING *', [id]);
    if (result.rowCount === 0) {
      return res.status(404).json({ success: false, error: 'Item not found' });
    }
    res.json({ success: true, message: `Item #${id} deleted successfully`, data: result.rows[0] });
  } catch (error) {
    console.error('Error deleting item:', error.message);
    res.status(500).json({ success: false, error: 'Failed to delete item from database' });
  }
});

// Graceful start
app.listen(port, '0.0.0.0', () => {
  console.log(`🚀 Node.js backend listening on http://0.0.0.0:${port}`);
});
