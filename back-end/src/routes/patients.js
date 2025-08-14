const express = require('express');
const { v4: uuidv4 } = require('uuid');
const { getDatabase } = require('../database/init');

const router = express.Router();
const db = getDatabase();

// Get all patients (REQUIRED: For appointment booking)
router.get('/', (req, res) => {
  const query = 'SELECT * FROM patients ORDER BY name ASC';

  db.all(query, [], (err, rows) => {
    if (err) {
      console.error('Error fetching patients:', err);
      return res.status(500).json({ error: 'Failed to fetch patients' });
    }
    res.json(rows);
  });
});

// Get patient by ID (REQUIRED: For appointment booking)
router.get('/:id', (req, res) => {
  const { id } = req.params;

  db.get('SELECT * FROM patients WHERE id = ?', [id], (err, row) => {
    if (err) {
      console.error('Error fetching patient:', err);
      return res.status(500).json({ error: 'Failed to fetch patient' });
    }
    if (!row) {
      return res.status(404).json({ error: 'Patient not found' });
    }
    res.json(row);
  });
});

// Create new patient (REQUIRED: For appointment booking)
router.post('/', (req, res) => {
  const { name, email, phone, dateOfBirth, address } = req.body;

  // Validate required fields
  if (!name || !email) {
    return res.status(400).json({ 
      error: 'Missing required fields: name, email' 
    });
  }

  // Check if email already exists
  db.get('SELECT id FROM patients WHERE email = ?', [email], (err, existingPatient) => {
    if (err) {
      console.error('Error checking email uniqueness:', err);
      return res.status(500).json({ error: 'Failed to create patient' });
    }

    if (existingPatient) {
      return res.status(400).json({ error: 'Email already exists' });
    }

    // Create new patient
    const patientId = uuidv4();
    const now = new Date().toISOString();

    db.run(
      'INSERT INTO patients (id, name, email, phone, dateOfBirth, address, createdAt, updatedAt) VALUES (?, ?, ?, ?, ?, ?, ?, ?)',
      [patientId, name, email, phone || null, dateOfBirth || null, address || null, now, now],
      function(err) {
        if (err) {
          console.error('Error creating patient:', err);
          return res.status(500).json({ error: 'Failed to create patient' });
        }

        // Get the created patient
        db.get('SELECT * FROM patients WHERE id = ?', [patientId], (err, patient) => {
          if (err) {
            console.error('Error fetching created patient:', err);
            return res.status(500).json({ error: 'Patient created but failed to retrieve details' });
          }
          res.status(201).json({
            message: 'Patient created successfully',
            patient
          });
        });
      }
    );
  });
});

// Get patient's appointments (REQUIRED: For appointment management)
router.get('/:id/appointments', (req, res) => {
  const { id } = req.params;
  const { status, past } = req.query;

  let query = `
    SELECT 
      a.*,
      d.name as doctorName,
      d.specialization as doctorSpecialization,
      d.email as doctorEmail,
      d.phone as doctorPhone
    FROM appointments a
    LEFT JOIN doctors d ON a.doctorId = d.id
    WHERE a.patientId = ?
  `;

  const params = [id];

  // Filter by status if provided
  if (status) {
    query += ' AND a.status = ?';
    params.push(status);
  }

  // Filter for past appointments if requested
  if (past === 'true') {
    query += ' AND a.date < ?';
    params.push(new Date().toISOString().split('T')[0]);
  } else if (past === 'false') {
    query += ' AND a.date >= ?';
    params.push(new Date().toISOString().split('T')[0]);
  }

  query += ' ORDER BY a.date DESC, a.time ASC';

  db.all(query, params, (err, rows) => {
    if (err) {
      console.error('Error fetching patient appointments:', err);
      return res.status(500).json({ error: 'Failed to fetch patient appointments' });
    }
    res.json(rows);
  });
});

// Search patients by name or email (REQUIRED: For appointment booking)
router.get('/search/:query', (req, res) => {
  const { query } = req.params;
  const searchTerm = `%${query}%`;

  const searchQuery = `
    SELECT * FROM patients 
    WHERE name LIKE ? OR email LIKE ?
    ORDER BY name ASC
  `;

  db.all(searchQuery, [searchTerm, searchTerm], (err, rows) => {
    if (err) {
      console.error('Error searching patients:', err);
      return res.status(500).json({ error: 'Failed to search patients' });
    }
    res.json(rows);
  });
});

module.exports = router;
