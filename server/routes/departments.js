const express = require('express');
const router = express.Router();
const { getConnection, sql } = require('../config/database');

// GET all departments
router.get('/', async (req, res) => {
  try {
    const pool = await getConnection();
    const result = await pool.request()
      .query(`
        SELECT 
          DepartmentId as id,
          DepartmentName as name,
          DepartmentCode as code,
          CreatedAt as createdAt,
          IsActive as isActive
        FROM Departments
        WHERE IsActive = 1
        ORDER BY DepartmentName
      `);
    
    res.json(result.recordset);
  } catch (err) {
    console.error('Error fetching departments:', err);
    res.status(500).json({ error: 'Failed to fetch departments', details: err.message });
  }
});

// POST create new department
router.post('/', async (req, res) => {
  try {
    const { name, code } = req.body;
    
    if (!name || !code) {
      return res.status(400).json({ error: 'Name and code are required' });
    }
    
    const pool = await getConnection();
    const result = await pool.request()
      .input('name', sql.NVarChar(100), name)
      .input('code', sql.NVarChar(20), code)
      .query(`
        INSERT INTO Departments (DepartmentName, DepartmentCode)
        OUTPUT INSERTED.DepartmentId as id,
               INSERTED.DepartmentName as name,
               INSERTED.DepartmentCode as code,
               INSERTED.CreatedAt as createdAt
        VALUES (@name, @code)
      `);
    
    res.status(201).json(result.recordset[0]);
  } catch (err) {
    console.error('Error creating department:', err);
    res.status(500).json({ error: 'Failed to create department', details: err.message });
  }
});

module.exports = router;

