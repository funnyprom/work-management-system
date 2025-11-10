const express = require('express');
const router = express.Router();
const { getConnection, sql } = require('../config/database');

// GET all users
router.get('/', async (req, res) => {
  try {
    const pool = await getConnection();
    const result = await pool.request()
      .query(`
        SELECT 
          UserId as id,
          Username as username,
          FullName as fullName,
          Email as email,
          Department as department,
          CreatedAt as createdAt,
          IsActive as isActive
        FROM Users
        WHERE IsActive = 1
        ORDER BY FullName
      `);
    
    res.json(result.recordset);
  } catch (err) {
    console.error('Error fetching users:', err);
    res.status(500).json({ error: 'Failed to fetch users', details: err.message });
  }
});

// GET single user by ID
router.get('/:id', async (req, res) => {
  try {
    const pool = await getConnection();
    const result = await pool.request()
      .input('id', sql.Int, req.params.id)
      .query(`
        SELECT 
          UserId as id,
          Username as username,
          FullName as fullName,
          Email as email,
          Department as department,
          CreatedAt as createdAt,
          IsActive as isActive
        FROM Users
        WHERE UserId = @id AND IsActive = 1
      `);
    
    if (result.recordset.length === 0) {
      return res.status(404).json({ error: 'User not found' });
    }
    
    res.json(result.recordset[0]);
  } catch (err) {
    console.error('Error fetching user:', err);
    res.status(500).json({ error: 'Failed to fetch user', details: err.message });
  }
});

// POST create new user
router.post('/', async (req, res) => {
  try {
    const { username, fullName, email, department } = req.body;
    
    if (!username || !fullName || !email) {
      return res.status(400).json({ error: 'Username, full name, and email are required' });
    }
    
    const pool = await getConnection();
    const result = await pool.request()
      .input('username', sql.NVarChar(100), username)
      .input('fullName', sql.NVarChar(200), fullName)
      .input('email', sql.NVarChar(200), email)
      .input('department', sql.NVarChar(100), department || null)
      .query(`
        INSERT INTO Users (Username, FullName, Email, Department)
        OUTPUT INSERTED.UserId as id,
               INSERTED.Username as username,
               INSERTED.FullName as fullName,
               INSERTED.Email as email,
               INSERTED.Department as department,
               INSERTED.CreatedAt as createdAt
        VALUES (@username, @fullName, @email, @department)
      `);
    
    res.status(201).json(result.recordset[0]);
  } catch (err) {
    console.error('Error creating user:', err);
    res.status(500).json({ error: 'Failed to create user', details: err.message });
  }
});

module.exports = router;

