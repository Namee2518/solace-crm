const pool = require('../config/db');

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

// GET /api/agents
async function getAgents(req, res) {
  try {
    const [rows] = await pool.query('SELECT * FROM agents ORDER BY created_at DESC');
    return res.status(200).json(rows);
  } catch (err) {
    console.error('Get agents error:', err);
    return res.status(500).json({ message: 'Server error while fetching agents.' });
  }
}

// POST /api/agents
async function createAgent(req, res) {
  try {
    const { name, email, phone, status } = req.body;

    if (!name || !email || !phone) {
      return res.status(400).json({ message: 'Name, email and phone are required.' });
    }
    if (!EMAIL_REGEX.test(email)) {
      return res.status(400).json({ message: 'Please provide a valid email address.' });
    }

    const [result] = await pool.query(
      'INSERT INTO agents (name, email, phone, status, created_by) VALUES (?, ?, ?, ?, ?)',
      [name, email, phone, status || 'Active', req.user.id]
    );

    const [rows] = await pool.query('SELECT * FROM agents WHERE id = ?', [result.insertId]);
    return res.status(201).json(rows[0]);
  } catch (err) {
    console.error('Create agent error:', err);
    return res.status(500).json({ message: 'Server error while creating agent.' });
  }
}

// PUT /api/agents/:id
async function updateAgent(req, res) {
  try {
    const { id } = req.params;
    const { name, email, phone, status } = req.body;

    if (!name || !email || !phone) {
      return res.status(400).json({ message: 'Name, email and phone are required.' });
    }
    if (!EMAIL_REGEX.test(email)) {
      return res.status(400).json({ message: 'Please provide a valid email address.' });
    }

    const [existing] = await pool.query('SELECT id FROM agents WHERE id = ?', [id]);
    if (existing.length === 0) {
      return res.status(404).json({ message: 'Agent not found.' });
    }

    await pool.query(
      'UPDATE agents SET name = ?, email = ?, phone = ?, status = ? WHERE id = ?',
      [name, email, phone, status || 'Active', id]
    );

    const [rows] = await pool.query('SELECT * FROM agents WHERE id = ?', [id]);
    return res.status(200).json(rows[0]);
  } catch (err) {
    console.error('Update agent error:', err);
    return res.status(500).json({ message: 'Server error while updating agent.' });
  }
}

// DELETE /api/agents/:id
async function deleteAgent(req, res) {
  try {
    const { id } = req.params;

    const [existing] = await pool.query('SELECT id FROM agents WHERE id = ?', [id]);
    if (existing.length === 0) {
      return res.status(404).json({ message: 'Agent not found.' });
    }

    await pool.query('DELETE FROM agents WHERE id = ?', [id]);
    return res.status(200).json({ message: 'Agent deleted successfully.' });
  } catch (err) {
    console.error('Delete agent error:', err);
    return res.status(500).json({ message: 'Server error while deleting agent.' });
  }
}

module.exports = { getAgents, createAgent, updateAgent, deleteAgent };
