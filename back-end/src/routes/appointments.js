const express = require('express');
const { v4: uuidv4 } = require('uuid');
const { getDatabase } = require('../database/init');

const router = express.Router();
const db = getDatabase();

// Get all appointments (for viewing appointments)
router.get('/', (req, res) => {
  const query = `
    SELECT 
      a.*,
      p.name as patientName,
      p.email as patientEmail,
      p.phone as patientPhone,
      d.name as doctorName,
      d.specialization as doctorSpecialization,
      d.email as doctorEmail,
      d.phone as doctorPhone
    FROM appointments a
    LEFT JOIN patients p ON a.patientId = p.id
    LEFT JOIN doctors d ON a.doctorId = d.id
    ORDER BY a.date DESC, a.time ASC
  `;

  db.all(query, [], (err, rows) => {
    if (err) {
      console.error('Error fetching appointments:', err);
      return res.status(500).json({ error: 'Failed to fetch appointments' });
    }
    res.json(rows);
  });
});

// Get appointment by ID (REQUIRED: For appointment management)
router.get('/:id', (req, res) => {
  const { id } = req.params;
  
  const query = `
    SELECT 
      a.*,
      p.name as patientName,
      p.email as patientEmail,
      p.phone as patientPhone,
      d.name as doctorName,
      d.specialization as doctorSpecialization,
      d.email as doctorEmail,
      d.phone as doctorPhone
    FROM appointments a
    LEFT JOIN patients p ON a.patientId = p.id
    LEFT JOIN doctors d ON a.doctorId = d.id
    WHERE a.id = ?
  `;

  db.get(query, [id], (err, row) => {
    if (err) {
      console.error('Error fetching appointment:', err);
      return res.status(500).json({ error: 'Failed to fetch appointment' });
    }
    if (!row) {
      return res.status(404).json({ error: 'Appointment not found' });
    }
    res.json(row);
  });
});

// Book an appointment (REQUIRED: Allow users to book appointments)
router.post('/', (req, res) => {
  const { patientId, doctorId, date, time, notes } = req.body;

  // Validate required fields
  if (!patientId || !doctorId || !date || !time) {
    return res.status(400).json({ 
      error: 'Missing required fields: patientId, doctorId, date, time' 
    });
  }

  // Validate date format and ensure it's not in the past
  const appointmentDate = new Date(date);
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  
  if (appointmentDate < today) {
    return res.status(400).json({ error: 'Cannot book appointments in the past' });
  }

  // Check if the slot is available
  db.get(
    'SELECT * FROM appointments WHERE doctorId = ? AND date = ? AND time = ? AND status = "available"',
    [doctorId, date, time],
    (err, slot) => {
      if (err) {
        console.error('Error checking slot availability:', err);
        return res.status(500).json({ error: 'Failed to check slot availability' });
      }

      if (!slot) {
        return res.status(400).json({ error: 'Selected time slot is not available' });
      }

      // Check if patient already has an appointment at this time
      db.get(
        'SELECT * FROM appointments WHERE patientId = ? AND date = ? AND time = ? AND status = "booked"',
        [patientId, date, time],
        (err, existingAppointment) => {
          if (err) {
            console.error('Error checking patient availability:', err);
            return res.status(500).json({ error: 'Failed to check patient availability' });
          }

          if (existingAppointment) {
            return res.status(400).json({ error: 'Patient already has an appointment at this time' });
          }

          // Book the appointment (REQUIRED: Update slot status to "booked")
          const now = new Date().toISOString();

          db.run(
            'UPDATE appointments SET patientId = ?, status = "booked", notes = ?, updatedAt = ? WHERE id = ?',
            [patientId, notes || null, now, slot.id],
            function(err) {
              if (err) {
                console.error('Error booking appointment:', err);
                return res.status(500).json({ error: 'Failed to book appointment' });
              }

              // Get the updated appointment with joined data
              const query = `
                SELECT 
                  a.*,
                  p.name as patientName,
                  p.email as patientEmail,
                  p.phone as patientPhone,
                  d.name as doctorName,
                  d.specialization as doctorSpecialization,
                  d.email as doctorEmail,
                  d.phone as doctorPhone
                FROM appointments a
                LEFT JOIN patients p ON a.patientId = p.id
                LEFT JOIN doctors d ON a.doctorId = d.id
                WHERE a.id = ?
              `;

              db.get(query, [slot.id], (err, appointment) => {
                if (err) {
                  console.error('Error fetching booked appointment:', err);
                  return res.status(500).json({ error: 'Appointment booked but failed to retrieve details' });
                }
                res.status(201).json({
                  message: 'Appointment booked successfully',
                  appointment
                });
              });
            }
          );
        }
      );
    }
  );
});

// Reschedule appointment (REQUIRED: Provide ability to reschedule)
router.put('/:id', (req, res) => {
  const { id } = req.params;
  const { doctorId, date, time, notes } = req.body;

  // Get the current appointment
  db.get('SELECT * FROM appointments WHERE id = ?', [id], (err, appointment) => {
    if (err) {
      console.error('Error fetching appointment:', err);
      return res.status(500).json({ error: 'Failed to fetch appointment' });
    }

    if (!appointment) {
      return res.status(404).json({ error: 'Appointment not found' });
    }

    if (appointment.status !== 'booked') {
      return res.status(400).json({ error: 'Only booked appointments can be rescheduled' });
    }

    // Validate date if provided
    if (date) {
      const appointmentDate = new Date(date);
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      
      if (appointmentDate < today) {
        return res.status(400).json({ error: 'Cannot reschedule appointments to the past' });
      }
    }

    // Check if new slot is available
    db.get(
      'SELECT * FROM appointments WHERE doctorId = ? AND date = ? AND time = ? AND status = "available"',
      [doctorId || appointment.doctorId, date || appointment.date, time || appointment.time],
      (err, newSlot) => {
        if (err) {
          console.error('Error checking new slot availability:', err);
          return res.status(500).json({ error: 'Failed to check slot availability' });
        }

        if (!newSlot) {
          return res.status(400).json({ error: 'New time slot is not available' });
        }

        // Check if patient already has an appointment at the new time
        db.get(
          'SELECT * FROM appointments WHERE patientId = ? AND date = ? AND time = ? AND status = "booked" AND id != ?',
          [appointment.patientId, date || appointment.date, time || appointment.time, id],
          (err, existingAppointment) => {
            if (err) {
              console.error('Error checking patient availability:', err);
              return res.status(500).json({ error: 'Failed to check patient availability' });
            }

            if (existingAppointment) {
              return res.status(400).json({ error: 'Patient already has an appointment at this time' });
            }

            // Free up the old slot
            db.run(
              'UPDATE appointments SET patientId = NULL, status = "available", notes = NULL, updatedAt = ? WHERE id = ?',
              [new Date().toISOString(), id],
              (err) => {
                if (err) {
                  console.error('Error freeing old slot:', err);
                  return res.status(500).json({ error: 'Failed to reschedule appointment' });
                }

                // Book the new slot
                db.run(
                  'UPDATE appointments SET patientId = ?, status = "booked", notes = ?, updatedAt = ? WHERE id = ?',
                  [appointment.patientId, notes || appointment.notes, new Date().toISOString(), newSlot.id],
                  function(err) {
                    if (err) {
                      console.error('Error booking new slot:', err);
                      return res.status(500).json({ error: 'Failed to reschedule appointment' });
                    }

                    res.json({
                      message: 'Appointment rescheduled successfully',
                      appointmentId: newSlot.id
                    });
                  }
                );
              }
            );
          }
        );
      }
    );
  });
});

// Cancel appointment (REQUIRED: Cancel appointments and make slots available again)
router.patch('/:id/cancel', (req, res) => {
  const { id } = req.params;

  db.get('SELECT * FROM appointments WHERE id = ?', [id], (err, appointment) => {
    if (err) {
      console.error('Error fetching appointment:', err);
      return res.status(500).json({ error: 'Failed to fetch appointment' });
    }

    if (!appointment) {
      return res.status(404).json({ error: 'Appointment not found' });
    }

    if (appointment.status !== 'booked') {
      return res.status(400).json({ error: 'Only booked appointments can be cancelled' });
    }

    // Check if appointment is in the past
    const appointmentDate = new Date(appointment.date);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    if (appointmentDate < today) {
      return res.status(400).json({ error: 'Cannot cancel past appointments' });
    }

    // Cancel appointment and make slot available again
    db.run(
      'UPDATE appointments SET status = "cancelled", updatedAt = ? WHERE id = ?',
      [new Date().toISOString(), id],
      function(err) {
        if (err) {
          console.error('Error cancelling appointment:', err);
          return res.status(500).json({ error: 'Failed to cancel appointment' });
        }

        res.json({ message: 'Appointment cancelled successfully' });
      }
    );
  });
});

// Get available slots (REQUIRED: Display available appointment slots)
router.get('/slots/available', (req, res) => {
  const { doctorId, date } = req.query;

  if (!doctorId || !date) {
    return res.status(400).json({ 
      error: 'Missing required query parameters: doctorId, date' 
    });
  }

  // Validate date is not in the past
  const appointmentDate = new Date(date);
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  
  if (appointmentDate < today) {
    return res.status(400).json({ error: 'Cannot view slots for past dates' });
  }

  const query = `
    SELECT id, doctorId, date, time, status
    FROM appointments 
    WHERE doctorId = ? AND date = ? AND status = "available"
    ORDER BY time ASC
  `;

  db.all(query, [doctorId, date], (err, rows) => {
    if (err) {
      console.error('Error fetching available slots:', err);
      return res.status(500).json({ error: 'Failed to fetch available slots' });
    }
    res.json(rows);
  });
});

// Get patient's appointments (REQUIRED: For appointment management)
router.get('/patient/:patientId', (req, res) => {
  const { patientId } = req.params;
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

  const params = [patientId];

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

// Get past appointments (REQUIRED: View past appointments)
router.get('/past/all', (req, res) => {
  const { patientId, doctorId, limit = 50 } = req.query;

  let query = `
    SELECT 
      a.*,
      p.name as patientName,
      p.email as patientEmail,
      p.phone as patientPhone,
      d.name as doctorName,
      d.specialization as doctorSpecialization,
      d.email as doctorEmail,
      d.phone as doctorPhone
    FROM appointments a
    LEFT JOIN patients p ON a.patientId = p.id
    LEFT JOIN doctors d ON a.doctorId = d.id
    WHERE a.date < ? AND a.status IN ('completed', 'cancelled')
  `;

  const params = [new Date().toISOString().split('T')[0]];

  if (patientId) {
    query += ' AND a.patientId = ?';
    params.push(patientId);
  }

  if (doctorId) {
    query += ' AND a.doctorId = ?';
    params.push(doctorId);
  }

  query += ' ORDER BY a.date DESC, a.time ASC LIMIT ?';
  params.push(parseInt(limit));

  db.all(query, params, (err, rows) => {
    if (err) {
      console.error('Error fetching past appointments:', err);
      return res.status(500).json({ error: 'Failed to fetch past appointments' });
    }
    res.json(rows);
  });
});

// Get upcoming appointments (REQUIRED: For appointment management)
router.get('/upcoming', (req, res) => {
  const { patientId, doctorId, limit = 10 } = req.query;

  const today = new Date();
  const nextWeek = new Date(today.getTime() + 7 * 24 * 60 * 60 * 1000);

  let query = `
    SELECT 
      a.*,
      p.name as patientName,
      p.email as patientEmail,
      p.phone as patientPhone,
      d.name as doctorName,
      d.specialization as doctorSpecialization,
      d.email as doctorEmail,
      d.phone as doctorPhone
    FROM appointments a
    LEFT JOIN patients p ON a.patientId = p.id
    LEFT JOIN doctors d ON a.doctorId = d.id
    WHERE a.date BETWEEN ? AND ? AND a.status = 'booked'
  `;

  const params = [today.toISOString().split('T')[0], nextWeek.toISOString().split('T')[0]];

  if (patientId) {
    query += ' AND a.patientId = ?';
    params.push(patientId);
  }

  if (doctorId) {
    query += ' AND a.doctorId = ?';
    params.push(doctorId);
  }

  query += ' ORDER BY a.date ASC, a.time ASC LIMIT ?';
  params.push(parseInt(limit));

  db.all(query, params, (err, rows) => {
    if (err) {
      console.error('Error fetching upcoming appointments:', err);
      return res.status(500).json({ error: 'Failed to fetch upcoming appointments' });
    }
    res.json(rows);
  });
});

module.exports = router;
