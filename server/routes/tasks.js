const express = require('express');
const router = express.Router();
const { getConnection, sql } = require('../config/database');

// GET all tasks
router.get('/', async (req, res) => {
  try {
    const pool = await getConnection();
    const result = await pool.request()
      .query(`
        SELECT 
          TaskGuid as id,
          Title as title,
          Description as description,
          Status as status,
          Priority as priority,
          Assignee as assignee,
          DueDate as dueDate,
          CreatedAt as createdAt,
          UpdatedAt as updatedAt
        FROM Tasks
        WHERE IsDeleted = 0
        ORDER BY CreatedAt DESC
      `);
    
    res.json(result.recordset);
  } catch (err) {
    console.error('Error fetching tasks:', err);
    res.status(500).json({ error: 'Failed to fetch tasks', details: err.message });
  }
});

// GET single task by ID
router.get('/:id', async (req, res) => {
  try {
    const pool = await getConnection();
    const result = await pool.request()
      .input('id', sql.UniqueIdentifier, req.params.id)
      .query(`
        SELECT 
          TaskGuid as id,
          Title as title,
          Description as description,
          Status as status,
          Priority as priority,
          Assignee as assignee,
          DueDate as dueDate,
          CreatedAt as createdAt,
          UpdatedAt as updatedAt
        FROM Tasks
        WHERE TaskGuid = @id AND IsDeleted = 0
      `);
    
    if (result.recordset.length === 0) {
      return res.status(404).json({ error: 'Task not found' });
    }
    
    res.json(result.recordset[0]);
  } catch (err) {
    console.error('Error fetching task:', err);
    res.status(500).json({ error: 'Failed to fetch task', details: err.message });
  }
});

// POST create new task
router.post('/', async (req, res) => {
  try {
    const { title, description, status, priority, assignee, dueDate } = req.body;
    
    // Validation
    if (!title || !status || !priority) {
      return res.status(400).json({ error: 'Title, status, and priority are required' });
    }
    
    const pool = await getConnection();
    const result = await pool.request()
      .input('title', sql.NVarChar(200), title)
      .input('description', sql.NVarChar(sql.MAX), description || '')
      .input('status', sql.NVarChar(20), status)
      .input('priority', sql.NVarChar(20), priority)
      .input('assignee', sql.NVarChar(200), assignee || '')
      .input('dueDate', sql.DateTime2, dueDate || null)
      .query(`
        INSERT INTO Tasks (Title, Description, Status, Priority, Assignee, DueDate)
        OUTPUT INSERTED.TaskGuid as id, 
               INSERTED.Title as title,
               INSERTED.Description as description,
               INSERTED.Status as status,
               INSERTED.Priority as priority,
               INSERTED.Assignee as assignee,
               INSERTED.DueDate as dueDate,
               INSERTED.CreatedAt as createdAt
        VALUES (@title, @description, @status, @priority, @assignee, @dueDate)
      `);
    
    res.status(201).json(result.recordset[0]);
  } catch (err) {
    console.error('Error creating task:', err);
    res.status(500).json({ error: 'Failed to create task', details: err.message });
  }
});

// PUT update task
router.put('/:id', async (req, res) => {
  try {
    const { title, description, status, priority, assignee, dueDate } = req.body;
    
    const pool = await getConnection();
    const result = await pool.request()
      .input('id', sql.UniqueIdentifier, req.params.id)
      .input('title', sql.NVarChar(200), title)
      .input('description', sql.NVarChar(sql.MAX), description)
      .input('status', sql.NVarChar(20), status)
      .input('priority', sql.NVarChar(20), priority)
      .input('assignee', sql.NVarChar(200), assignee)
      .input('dueDate', sql.DateTime2, dueDate || null)
      .query(`
        UPDATE Tasks
        SET Title = @title,
            Description = @description,
            Status = @status,
            Priority = @priority,
            Assignee = @assignee,
            DueDate = @dueDate,
            UpdatedAt = GETDATE()
        OUTPUT INSERTED.TaskGuid as id,
               INSERTED.Title as title,
               INSERTED.Description as description,
               INSERTED.Status as status,
               INSERTED.Priority as priority,
               INSERTED.Assignee as assignee,
               INSERTED.DueDate as dueDate,
               INSERTED.UpdatedAt as updatedAt
        WHERE TaskGuid = @id AND IsDeleted = 0
      `);
    
    if (result.recordset.length === 0) {
      return res.status(404).json({ error: 'Task not found' });
    }
    
    res.json(result.recordset[0]);
  } catch (err) {
    console.error('Error updating task:', err);
    res.status(500).json({ error: 'Failed to update task', details: err.message });
  }
});

// DELETE task (soft delete)
router.delete('/:id', async (req, res) => {
  try {
    const pool = await getConnection();
    const result = await pool.request()
      .input('id', sql.UniqueIdentifier, req.params.id)
      .query(`
        UPDATE Tasks
        SET IsDeleted = 1, UpdatedAt = GETDATE()
        WHERE TaskGuid = @id AND IsDeleted = 0
      `);
    
    if (result.rowsAffected[0] === 0) {
      return res.status(404).json({ error: 'Task not found' });
    }
    
    res.json({ message: 'Task deleted successfully' });
  } catch (err) {
    console.error('Error deleting task:', err);
    res.status(500).json({ error: 'Failed to delete task', details: err.message });
  }
});

// GET tasks statistics
router.get('/stats/summary', async (req, res) => {
  try {
    const pool = await getConnection();
    const result = await pool.request()
      .query(`
        SELECT 
          COUNT(*) as total,
          SUM(CASE WHEN Status = 'todo' THEN 1 ELSE 0 END) as todo,
          SUM(CASE WHEN Status = 'in-progress' THEN 1 ELSE 0 END) as inProgress,
          SUM(CASE WHEN Status = 'done' THEN 1 ELSE 0 END) as done,
          SUM(CASE WHEN Priority = 'high' THEN 1 ELSE 0 END) as highPriority,
          SUM(CASE WHEN DueDate < GETDATE() AND Status != 'done' THEN 1 ELSE 0 END) as overdue
        FROM Tasks
        WHERE IsDeleted = 0
      `);
    
    res.json(result.recordset[0]);
  } catch (err) {
    console.error('Error fetching task statistics:', err);
    res.status(500).json({ error: 'Failed to fetch statistics', details: err.message });
  }
});

module.exports = router;

