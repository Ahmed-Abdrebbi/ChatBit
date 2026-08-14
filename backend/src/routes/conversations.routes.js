const express = require('express');
const authenticate = require('../middlewares/auth.middleware');
const requireRole = require('../middlewares/role.middleware');
const {
    create,
    list,
    getMessages,
    assign,
    close,
} = require('../controllers/conversations.controller');

const router = express.Router();

router.use(authenticate);

router.get('/', list);
router.post('/', requireRole('client'), create);
router.get('/:id/messages', getMessages);
router.patch('/:id/assign', requireRole('agent'), assign);
router.patch('/:id/close', requireRole('agent'), close);

module.exports = router;