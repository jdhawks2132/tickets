const router = require('express').Router();
const userRoutes = require('./userRoutes');
const ticketRoutes = require('./ticketRoutes');
const commentRoutes = require('./commentRoutes');

router.use('/users', userRoutes);
router.use('/tickets', ticketRoutes);
router.use('/comments', commentRoutes);

module.exports = router;
