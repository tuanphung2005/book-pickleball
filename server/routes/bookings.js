const express = require('express');
const router = express.Router();
const pool = require('../config/db');
const auth = require('../middleware/auth');

// Get user's bookings
router.get('/', auth, async (req, res) => {
  try {
    const [bookings] = await pool.execute(
      `SELECT b.*, p.name as playgroundName 
       FROM bookings b 
       JOIN playgrounds p ON b.playgroundId = p.id 
       WHERE b.userId = ?
       ORDER BY b.date DESC`,
      [req.userId]
    );
    res.json(bookings);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Create new booking
router.post('/', auth, async (req, res) => {
  try {
    const { playgroundId, date, timeStart, timeEnd } = req.body;
    
    // Validate required fields
    if (!playgroundId || !date || !timeStart || !timeEnd) {
      return res.status(400).json({ 
        error: 'Missing required fields: playgroundId, date, timeStart, timeEnd' 
      });
    }

    // Check if timeslot is already booked - Fixed overlap logic
    const [existing] = await pool.execute(
      `SELECT * FROM bookings 
       WHERE playgroundId = ? 
       AND date = ? 
       AND status != 'cancelled'
       AND (
         (timeStart < ? AND timeEnd > ?) OR    /* New booking starts during existing */
         (timeStart < ? AND timeEnd > ?) OR    /* New booking ends during existing */
         (timeStart >= ? AND timeEnd <= ?)     /* Existing booking completely contains new */
       )`,
      [
        playgroundId, 
        date,
        timeEnd, timeStart,
        timeEnd, timeEnd,
        timeStart, timeEnd       
      ]
    );

    if (existing.length > 0) {
      return res.status(400).json({ error: 'Khung giờ này đã được đặt' });
    }

    const [result] = await pool.execute(
      'INSERT INTO bookings (playgroundId, userId, date, timeStart, timeEnd) VALUES (?, ?, ?, ?, ?)',
      [playgroundId, req.userId, date, timeStart, timeEnd]
    );

    res.status(201).json({ 
      id: result.insertId,
      playgroundId,
      userId: req.userId,
      date,
      timeStart,
      timeEnd,
      status: 'pending'
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;