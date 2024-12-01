const express = require('express');
const router = express.Router();
const pool = require('../config/db');
const auth = require('../middleware/auth');

// Get all playgrounds
router.get('/', async (req, res) => {
  try {
    const [playgrounds] = await pool.execute('SELECT * FROM playgrounds');
    res.json(playgrounds);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Add new playground (protected route)
router.post('/', auth, async (req, res) => {
  try {
    const { name, type, address, imageUrl } = req.body;
    const [result] = await pool.execute(
      'INSERT INTO playgrounds (name, type, address, imageUrl) VALUES (?, ?, ?, ?)',
      [name, type, address, imageUrl]
    );
    res.status(201).json({ id: result.insertId, name, type, address, imageUrl });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Update playground rating
router.patch('/:id/rating', auth, async (req, res) => {
  try {
    const { rating } = req.body;
    await pool.execute(
      'UPDATE playgrounds SET rating = ? WHERE id = ?',
      [rating, req.params.id]
    );
    res.json({ message: 'Rating updated successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;