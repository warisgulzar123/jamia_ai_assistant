const express = require('express');
const router = express.Router();
const {
  getAllKnowledge,
  addKnowledge,
  updateKnowledge,
  deleteKnowledge,
  seedData,
} = require('../controllers/adminController');

// CRUD endpoints for Admin Dashboard (/api/admin/data)
router.get('/data', getAllKnowledge);
router.post('/data', addKnowledge);
router.put('/data/:id', updateKnowledge);
router.delete('/data/:id', deleteKnowledge);

// Seed initial dataset (/api/admin/seed)
router.post('/seed', seedData);

module.exports = router;
