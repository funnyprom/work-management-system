const express = require('express');
const router = express.Router();
const { getConnection, sql } = require('../config/database');

// GET all purchase requests
router.get('/', async (req, res) => {
  try {
    const pool = await getConnection();
    
    // Get PRs
    const prsResult = await pool.request()
      .query(`
        SELECT 
          PRGuid as id,
          RequestNumber as requestNumber,
          Requestor as requestor,
          Department as department,
          RequestDate as date,
          TotalAmount as totalAmount,
          Status as status,
          Notes as notes,
          CreatedAt as createdAt
        FROM PurchaseRequests
        WHERE IsDeleted = 0
        ORDER BY CreatedAt DESC
      `);
    
    // Get items for each PR
    const prs = prsResult.recordset;
    
    for (let pr of prs) {
      const itemsResult = await pool.request()
        .input('prGuid', sql.UniqueIdentifier, pr.id)
        .query(`
          SELECT 
            i.ItemGuid as id,
            i.ItemName as itemName,
            i.Description as description,
            i.Quantity as quantity,
            i.UnitPrice as unitPrice,
            i.TotalPrice as totalPrice
          FROM PurchaseRequestItems i
          INNER JOIN PurchaseRequests pr ON i.PRId = pr.PRId
          WHERE pr.PRGuid = @prGuid
        `);
      
      pr.items = itemsResult.recordset;
    }
    
    res.json(prs);
  } catch (err) {
    console.error('Error fetching purchase requests:', err);
    res.status(500).json({ error: 'Failed to fetch purchase requests', details: err.message });
  }
});

// GET single purchase request by ID
router.get('/:id', async (req, res) => {
  try {
    const pool = await getConnection();
    
    // Get PR
    const prResult = await pool.request()
      .input('id', sql.UniqueIdentifier, req.params.id)
      .query(`
        SELECT 
          PRGuid as id,
          RequestNumber as requestNumber,
          Requestor as requestor,
          Department as department,
          RequestDate as date,
          TotalAmount as totalAmount,
          Status as status,
          Notes as notes,
          CreatedAt as createdAt
        FROM PurchaseRequests
        WHERE PRGuid = @id AND IsDeleted = 0
      `);
    
    if (prResult.recordset.length === 0) {
      return res.status(404).json({ error: 'Purchase request not found' });
    }
    
    const pr = prResult.recordset[0];
    
    // Get items
    const itemsResult = await pool.request()
      .input('prGuid', sql.UniqueIdentifier, req.params.id)
      .query(`
        SELECT 
          i.ItemGuid as id,
          i.ItemName as itemName,
          i.Description as description,
          i.Quantity as quantity,
          i.UnitPrice as unitPrice,
          i.TotalPrice as totalPrice
        FROM PurchaseRequestItems i
        INNER JOIN PurchaseRequests pr ON i.PRId = pr.PRId
        WHERE pr.PRGuid = @prGuid
      `);
    
    pr.items = itemsResult.recordset;
    
    res.json(pr);
  } catch (err) {
    console.error('Error fetching purchase request:', err);
    res.status(500).json({ error: 'Failed to fetch purchase request', details: err.message });
  }
});

// POST create new purchase request
router.post('/', async (req, res) => {
  try {
    const { requestNumber, requestor, department, date, items, totalAmount, status, notes } = req.body;
    
    // Validation
    if (!requestNumber || !requestor || !department || !items || items.length === 0) {
      return res.status(400).json({ 
        error: 'Request number, requestor, department, and items are required' 
      });
    }
    
    const pool = await getConnection();
    const transaction = pool.transaction();
    
    try {
      await transaction.begin();
      
      // Insert PR
      const prResult = await transaction.request()
        .input('requestNumber', sql.NVarChar(50), requestNumber)
        .input('requestor', sql.NVarChar(200), requestor)
        .input('department', sql.NVarChar(100), department)
        .input('requestDate', sql.DateTime2, date || new Date())
        .input('totalAmount', sql.Decimal(18, 2), totalAmount || 0)
        .input('status', sql.NVarChar(20), status || 'draft')
        .input('notes', sql.NVarChar(sql.MAX), notes || '')
        .query(`
          INSERT INTO PurchaseRequests 
          (RequestNumber, Requestor, Department, RequestDate, TotalAmount, Status, Notes)
          OUTPUT INSERTED.PRId, INSERTED.PRGuid
          VALUES (@requestNumber, @requestor, @department, @requestDate, @totalAmount, @status, @notes)
        `);
      
      const prId = prResult.recordset[0].PRId;
      const prGuid = prResult.recordset[0].PRGuid;
      
      // Insert items
      const insertedItems = [];
      for (let item of items) {
        const itemResult = await transaction.request()
          .input('prId', sql.Int, prId)
          .input('itemName', sql.NVarChar(200), item.itemName)
          .input('description', sql.NVarChar(sql.MAX), item.description || '')
          .input('quantity', sql.Int, item.quantity)
          .input('unitPrice', sql.Decimal(18, 2), item.unitPrice)
          .input('totalPrice', sql.Decimal(18, 2), item.totalPrice)
          .query(`
            INSERT INTO PurchaseRequestItems 
            (PRId, ItemName, Description, Quantity, UnitPrice, TotalPrice)
            OUTPUT INSERTED.ItemGuid as id,
                   INSERTED.ItemName as itemName,
                   INSERTED.Description as description,
                   INSERTED.Quantity as quantity,
                   INSERTED.UnitPrice as unitPrice,
                   INSERTED.TotalPrice as totalPrice
            VALUES (@prId, @itemName, @description, @quantity, @unitPrice, @totalPrice)
          `);
        
        insertedItems.push(itemResult.recordset[0]);
      }
      
      await transaction.commit();
      
      // Get the complete PR
      const finalPrResult = await pool.request()
        .input('prGuid', sql.UniqueIdentifier, prGuid)
        .query(`
          SELECT 
            PRGuid as id,
            RequestNumber as requestNumber,
            Requestor as requestor,
            Department as department,
            RequestDate as date,
            TotalAmount as totalAmount,
            Status as status,
            Notes as notes,
            CreatedAt as createdAt
          FROM PurchaseRequests
          WHERE PRGuid = @prGuid
        `);
      
      const result = finalPrResult.recordset[0];
      result.items = insertedItems;
      
      res.status(201).json(result);
      
    } catch (err) {
      await transaction.rollback();
      throw err;
    }
    
  } catch (err) {
    console.error('Error creating purchase request:', err);
    res.status(500).json({ error: 'Failed to create purchase request', details: err.message });
  }
});

// PUT update purchase request
router.put('/:id', async (req, res) => {
  try {
    const { requestNumber, requestor, department, date, items, totalAmount, status, notes } = req.body;
    
    const pool = await getConnection();
    const transaction = pool.transaction();
    
    try {
      await transaction.begin();
      
      // Get PRId first
      const prIdResult = await transaction.request()
        .input('prGuid', sql.UniqueIdentifier, req.params.id)
        .query(`
          SELECT PRId FROM PurchaseRequests 
          WHERE PRGuid = @prGuid AND IsDeleted = 0
        `);
      
      if (prIdResult.recordset.length === 0) {
        await transaction.rollback();
        return res.status(404).json({ error: 'Purchase request not found' });
      }
      
      const prId = prIdResult.recordset[0].PRId;
      
      // Update PR
      await transaction.request()
        .input('prGuid', sql.UniqueIdentifier, req.params.id)
        .input('requestNumber', sql.NVarChar(50), requestNumber)
        .input('requestor', sql.NVarChar(200), requestor)
        .input('department', sql.NVarChar(100), department)
        .input('requestDate', sql.DateTime2, date)
        .input('totalAmount', sql.Decimal(18, 2), totalAmount)
        .input('status', sql.NVarChar(20), status)
        .input('notes', sql.NVarChar(sql.MAX), notes || '')
        .query(`
          UPDATE PurchaseRequests
          SET RequestNumber = @requestNumber,
              Requestor = @requestor,
              Department = @department,
              RequestDate = @requestDate,
              TotalAmount = @totalAmount,
              Status = @status,
              Notes = @notes,
              UpdatedAt = GETDATE()
          WHERE PRGuid = @prGuid
        `);
      
      // Delete existing items
      await transaction.request()
        .input('prId', sql.Int, prId)
        .query('DELETE FROM PurchaseRequestItems WHERE PRId = @prId');
      
      // Insert new items
      const insertedItems = [];
      for (let item of items) {
        const itemResult = await transaction.request()
          .input('prId', sql.Int, prId)
          .input('itemName', sql.NVarChar(200), item.itemName)
          .input('description', sql.NVarChar(sql.MAX), item.description || '')
          .input('quantity', sql.Int, item.quantity)
          .input('unitPrice', sql.Decimal(18, 2), item.unitPrice)
          .input('totalPrice', sql.Decimal(18, 2), item.totalPrice)
          .query(`
            INSERT INTO PurchaseRequestItems 
            (PRId, ItemName, Description, Quantity, UnitPrice, TotalPrice)
            OUTPUT INSERTED.ItemGuid as id,
                   INSERTED.ItemName as itemName,
                   INSERTED.Description as description,
                   INSERTED.Quantity as quantity,
                   INSERTED.UnitPrice as unitPrice,
                   INSERTED.TotalPrice as totalPrice
            VALUES (@prId, @itemName, @description, @quantity, @unitPrice, @totalPrice)
          `);
        
        insertedItems.push(itemResult.recordset[0]);
      }
      
      await transaction.commit();
      
      // Get updated PR
      const updatedPr = {
        id: req.params.id,
        requestNumber,
        requestor,
        department,
        date,
        totalAmount,
        status,
        notes,
        items: insertedItems
      };
      
      res.json(updatedPr);
      
    } catch (err) {
      await transaction.rollback();
      throw err;
    }
    
  } catch (err) {
    console.error('Error updating purchase request:', err);
    res.status(500).json({ error: 'Failed to update purchase request', details: err.message });
  }
});

// DELETE purchase request (soft delete)
router.delete('/:id', async (req, res) => {
  try {
    const pool = await getConnection();
    const result = await pool.request()
      .input('id', sql.UniqueIdentifier, req.params.id)
      .query(`
        UPDATE PurchaseRequests
        SET IsDeleted = 1, UpdatedAt = GETDATE()
        WHERE PRGuid = @id AND IsDeleted = 0
      `);
    
    if (result.rowsAffected[0] === 0) {
      return res.status(404).json({ error: 'Purchase request not found' });
    }
    
    res.json({ message: 'Purchase request deleted successfully' });
  } catch (err) {
    console.error('Error deleting purchase request:', err);
    res.status(500).json({ error: 'Failed to delete purchase request', details: err.message });
  }
});

// GET purchase request statistics
router.get('/stats/summary', async (req, res) => {
  try {
    const pool = await getConnection();
    const result = await pool.request()
      .query(`
        SELECT 
          COUNT(*) as total,
          SUM(CASE WHEN Status = 'draft' THEN 1 ELSE 0 END) as draft,
          SUM(CASE WHEN Status = 'pending' THEN 1 ELSE 0 END) as pending,
          SUM(CASE WHEN Status = 'approved' THEN 1 ELSE 0 END) as approved,
          SUM(CASE WHEN Status = 'rejected' THEN 1 ELSE 0 END) as rejected,
          SUM(TotalAmount) as totalAmount
        FROM PurchaseRequests
        WHERE IsDeleted = 0
      `);
    
    res.json(result.recordset[0]);
  } catch (err) {
    console.error('Error fetching PR statistics:', err);
    res.status(500).json({ error: 'Failed to fetch statistics', details: err.message });
  }
});

module.exports = router;

