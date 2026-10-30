const express = require('express');
const router = express.Router();
const { searchJamiatAI } = require('../controllers/aiController');

// Search endpoint: Accepts both POST /api/ai and POST /api/ai/search
router.post('/search', searchJamiatAI);
router.post('/', searchJamiatAI);

module.exports = router;
