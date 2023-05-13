const express = require('express');
const router = express.Router();
const { protect } = require('../routes/auth');
const { getUser, updateUser, deleteUser } = require('../controllers/userController');

router.get('/', protect, getUser);
router.put('/', protect, updateUser);
router.delete('/', protect, deleteUser);

module.exports = router;
