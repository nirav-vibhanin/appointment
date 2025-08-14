const sqlite3 = require('sqlite3').verbose();
const path = require('path');

// Database file path
const dbPath = path.join(__dirname, '../../database/appointments.db');

// Create database connection
const db = new sqlite3.Database(dbPath, (err) => {
  if (err) {
    console.error('Error opening database:', err.message);
  } else {
    console.log('✅ Connected to SQLite database');
  }
});

// Initialize database tables
const initializeDatabase = () => {
  return new Promise((resolve, reject) => {
    // Enable foreign keys
    db.run('PRAGMA foreign_keys = ON', (err) => {
      if (err) {
        console.error('Error enabling foreign keys:', err.message);
        reject(err);
        return;
      }
      
      // Create patients table
      db.run(`
        CREATE TABLE IF NOT EXISTS patients (
          id TEXT PRIMARY KEY,
          name TEXT NOT NULL,
          email TEXT UNIQUE NOT NULL,
          phone TEXT,
          dateOfBirth TEXT,
          address TEXT,
          createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
          updatedAt DATETIME DEFAULT CURRENT_TIMESTAMP
        )
      `, (err) => {
        if (err) {
          console.error('Error creating patients table:', err.message);
          reject(err);
          return;
        }
        console.log('✅ Patients table created/verified');
        
        // Create doctors table
        db.run(`
          CREATE TABLE IF NOT EXISTS doctors (
            id TEXT PRIMARY KEY,
            name TEXT NOT NULL,
            email TEXT UNIQUE NOT NULL,
            phone TEXT,
            specialization TEXT,
            experience INTEGER,
            availability TEXT,
            createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
            updatedAt DATETIME DEFAULT CURRENT_TIMESTAMP
          )
        `, (err) => {
          if (err) {
            console.error('Error creating doctors table:', err.message);
            reject(err);
            return;
          }
          console.log('✅ Doctors table created/verified');
          
          // Create appointments table with NULL patientId allowed
          db.run(`
            CREATE TABLE IF NOT EXISTS appointments (
              id TEXT PRIMARY KEY,
              patientId TEXT,
              doctorId TEXT NOT NULL,
              date TEXT NOT NULL,
              time TEXT NOT NULL,
              status TEXT DEFAULT 'available' CHECK (status IN ('available', 'booked', 'cancelled', 'completed')),
              notes TEXT,
              createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
              updatedAt DATETIME DEFAULT CURRENT_TIMESTAMP,
              FOREIGN KEY (patientId) REFERENCES patients (id) ON DELETE CASCADE,
              FOREIGN KEY (doctorId) REFERENCES doctors (id) ON DELETE CASCADE
            )
          `, (err) => {
            if (err) {
              console.error('Error creating appointments table:', err.message);
              reject(err);
              return;
            }
            console.log('✅ Appointments table created/verified');
            
            // Create indexes for better performance
            db.run('CREATE INDEX IF NOT EXISTS idx_appointments_doctor_date ON appointments(doctorId, date)', (err) => {
              if (err) console.error('Error creating index:', err.message);
            });
            db.run('CREATE INDEX IF NOT EXISTS idx_appointments_patient ON appointments(patientId)', (err) => {
              if (err) console.error('Error creating index:', err.message);
            });
            db.run('CREATE INDEX IF NOT EXISTS idx_appointments_status ON appointments(status)', (err) => {
              if (err) console.error('Error creating index:', err.message);
            });
            
            // Insert sample data if tables are empty
            insertSampleData()
              .then(() => {
                console.log('✅ Database initialization completed');
                resolve();
              })
              .catch(reject);
          });
        });
      });
    });
  });
};

// Insert sample data
const insertSampleData = () => {
  return new Promise((resolve, reject) => {
    // Check if doctors table is empty
    db.get('SELECT COUNT(*) as count FROM doctors', (err, row) => {
      if (err) {
        console.error('Error checking doctors table:', err.message);
        reject(err);
        return;
      }

      if (row.count === 0) {
        console.log('📝 Inserting sample data...');
        
        // Insert sample doctors
        const doctors = [
          {
            id: 'doc-001',
            name: 'Dr. Sarah Johnson',
            email: 'sarah.johnson@hospital.com',
            phone: '+1-555-0101',
            specialization: 'Cardiology',
            experience: 15
          },
          {
            id: 'doc-002',
            name: 'Dr. Michael Chen',
            email: 'michael.chen@hospital.com',
            phone: '+1-555-0102',
            specialization: 'Neurology',
            experience: 12
          },
          {
            id: 'doc-003',
            name: 'Dr. Emily Davis',
            email: 'emily.davis@hospital.com',
            phone: '+1-555-0103',
            specialization: 'Pediatrics',
            experience: 8
          }
        ];

        const doctorStmt = db.prepare(`
          INSERT INTO doctors (id, name, email, phone, specialization, experience)
          VALUES (?, ?, ?, ?, ?, ?)
        `);

        doctors.forEach(doctor => {
          doctorStmt.run([
            doctor.id,
            doctor.name,
            doctor.email,
            doctor.phone,
            doctor.specialization,
            doctor.experience
          ]);
        });

        doctorStmt.finalize();

        // Insert sample patients
        const patients = [
          {
            id: 'pat-001',
            name: 'John Smith',
            email: 'john.smith@email.com',
            phone: '+1-555-0201',
            dateOfBirth: '1985-03-15'
          },
          {
            id: 'pat-002',
            name: 'Maria Garcia',
            email: 'maria.garcia@email.com',
            phone: '+1-555-0202',
            dateOfBirth: '1990-07-22'
          }
        ];

        const patientStmt = db.prepare(`
          INSERT INTO patients (id, name, email, phone, dateOfBirth)
          VALUES (?, ?, ?, ?, ?)
        `);

        patients.forEach(patient => {
          patientStmt.run([
            patient.id,
            patient.name,
            patient.email,
            patient.phone,
            patient.dateOfBirth
          ]);
        });

        patientStmt.finalize();

        // Insert sample appointment slots
        const today = new Date();
        const tomorrow = new Date(today);
        tomorrow.setDate(tomorrow.getDate() + 1);
        
        const timeSlots = ['09:00', '10:00', '11:00', '14:00', '15:00', '16:00'];
        const appointmentStmt = db.prepare(`
          INSERT INTO appointments (id, patientId, doctorId, date, time, status)
          VALUES (?, ?, ?, ?, ?, ?)
        `);

        doctors.forEach((doctor, doctorIndex) => {
          timeSlots.forEach((time, timeIndex) => {
            const appointmentId = `apt-${doctorIndex + 1}-${timeIndex + 1}`;
            const status = Math.random() > 0.7 ? 'booked' : 'available';
            const patientId = status === 'booked' ? patients[Math.floor(Math.random() * patients.length)].id : null;
            
            appointmentStmt.run([
              appointmentId,
              patientId,
              doctor.id,
              tomorrow.toISOString().split('T')[0],
              time,
              status
            ]);
          });
        });

        appointmentStmt.finalize();
        console.log('✅ Sample data inserted successfully');
      }
      
      resolve();
    });
  });
};

// Get database instance
const getDatabase = () => {
  return db;
};

module.exports = {
  initializeDatabase,
  getDatabase
};
