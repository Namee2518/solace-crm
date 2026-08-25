const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/authMiddleware');
const { getAgents, createAgent, updateAgent, deleteAgent } = require('../controllers/agentController');

router.use(authMiddleware);

router.get('/', getAgents);
router.post('/', createAgent);
router.put('/:id', updateAgent);
router.delete('/:id', deleteAgent);

module.exports = router;
