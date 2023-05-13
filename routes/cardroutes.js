const express = require('express');
const router = express.Router();
const { protect } = require('../routes/auth');
const {
  createBusinessCard,
  updateBusinessCard,
  deleteBusinessCard,
  searchPublicBusinessCards,
  getBusinessCard,
} = require('../controllers/cardcontroller');

router.get('/search', searchPublicBusinessCards);
router.post('/', protect, createBusinessCard);
router.get('/:id', protect, getBusinessCard);
router.patch('/:id', protect, updateBusinessCard);
router.delete('/:id', protect, deleteBusinessCard);


module.exports = router;