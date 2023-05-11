const router = require('express').Router();
const { User, Ticket, Comment, Role } = require('../models');
const withAuth = require('../utils/auth');

// GET all tickets for dashboard
router.get('/', async (req, res) => {
	try {
		const ticketData = await Ticket.findAll({
			include: [
				// Include the user that created the ticket (user_id)
				{
					model: User,
					as: 'creator',
					attributes: ['name', 'email', 'id', 'role_id'],
				},
				// Include the assigned user
				{
					model: User,
					as: 'assignedUser',
					attributes: ['name', 'email', 'id', 'role_id'],
				},
			],
		});

		const tickets = ticketData.map((ticket) => ticket.get({ plain: true }));

		res.render('dashboard', {
			tickets,
			loggedIn: req.session.loggedIn,
		});
	} catch (err) {
		res.status(500).json(err);
	}
});

module.exports = router;
