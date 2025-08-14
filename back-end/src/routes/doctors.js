const express = require('express');
const { v4: uuidv4 } = require('uuid');
const { getDatabase } = require('../database/init');

const router = express.Router();
const db = getDatabase();

// Get all doctors (REQUIRED: For appointment booking)
router.get('/', (req, res) => {
  const query = 'SELECT * FROM doctors ORDER BY name ASC';

  db.all(query, [], (err, rows) => {
    if (err) {
      console.error('Error fetching doctors:', err);
      return res.status(500).json({ error: 'Failed to fetch doctors' });
    }
    res.json(rows);
  });
});

// Get doctor by ID (REQUIRED: For appointment booking)
router.get('/:id', (req, res) => {
  const { id } = req.params;

  db.get('SELECT * FROM doctors WHERE id = ?', [id], (err, row) => {
    if (err) {
      console.error('Error fetching doctor:', err);
      return res.status(500).json({ error: 'Failed to fetch doctor' });
    }
    if (!row) {
      return res.status(404).json({ error: 'Doctor not found' });
    }
    res.json(row);
  });
});

// Get doctor's appointments (REQUIRED: For appointment management)
router.get('/:id/appointments', (req, res) => {
  const { id } = req.params;
  const { status, date } = req.query;

  let query = `
    SELECT 
      a.*,
      p.name as patientName,
      p.email as patientEmail,
      p.phone as patientPhone
    FROM appointments a
    LEFT JOIN patients p ON a.patientId = p.id
    WHERE a.doctorId = ?
  `;

  const params = [id];

  // Filter by status if provided
  if (status) {
    query += ' AND a.status = ?';
    params.push(status);
  }

  // Filter by date if provided
  if (date) {
    query += ' AND a.date = ?';
    params.push(date);
  }

  query += ' ORDER BY a.date DESC, a.time ASC';

  db.all(query, params, (err, rows) => {
    if (err) {
      console.error('Error fetching doctor appointments:', err);
      return res.status(500).json({ error: 'Failed to fetch doctor appointments' });
    }
    res.json(rows);
  });
});

// Get doctors by specialization (REQUIRED: For appointment booking)
router.get('/specialization/:specialization', (req, res) => {
  const { specialization } = req.params;

  const query = 'SELECT * FROM doctors WHERE specialization = ? ORDER BY name ASC';

  db.all(query, [specialization], (err, rows) => {
    if (err) {
      console.error('Error fetching doctors by specialization:', err);
      return res.status(500).json({ error: 'Failed to fetch doctors' });
    }
    res.json(rows);
  });
});

module.exports = router;
