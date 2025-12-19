const express = require('express');
const mysql = require('mysql2');
const cors = require('cors');

const app = express();
app.use(express.json());
app.use(cors());

const db = mysql.createPool({
    host: process.env.DB_HOST || 'db',
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || 'password',
    database: process.env.DB_NAME || 'myapp',
});

// Init DB Table
const connectWithRetry = () => {
    console.log('Attempting to connect to DB...');
    db.query(`
    CREATE TABLE IF NOT EXISTS messages (
      id INT AUTO_INCREMENT PRIMARY KEY,
      text VARCHAR(255) NOT NULL
    )
  `, (err, results) => {
        if (err) {
            console.error('Error connecting/creating table, retrying in 5s...', err.code);
            setTimeout(connectWithRetry, 5000);
        } else {
            console.log('Table initialized or already exists. DB Connection successful.');
        }
    });
};

connectWithRetry();

app.post('/api/save', (req, res) => {
    const { text } = req.body;
    if (!text) {
        return res.status(400).json({ error: 'Text is required' });
    }

    db.query('INSERT INTO messages (text) VALUES (?)', [text], (err, result) => {
        if (err) {
            console.error(err);
            return res.status(500).json({ error: 'Database error' });
        }
        res.json({ message: 'Text saved successfully', id: result.insertId });
    });
});

app.get('/api/messages', (req, res) => {
    db.query('SELECT * FROM messages ORDER BY id DESC', (err, results) => {
        if (err) {
            console.error(err);
            return res.status(500).json({ error: 'Database error' });
        }
        res.json(results);
    });
});

app.delete('/api/messages/:id', (req, res) => {
    const { id } = req.params;
    db.query('DELETE FROM messages WHERE id = ?', [id], (err, result) => {
        if (err) {
            console.error(err);
            return res.status(500).json({ error: 'Database error' });
        }
        res.json({ message: 'Message deleted successfully' });
    });
});

app.listen(5000, () => {
    console.log('Server running on port 5000');
});
