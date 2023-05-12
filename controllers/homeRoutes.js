const router = require('express').Router();
const { User, Ticket, Comment, Role } = require('../models');
const withAuth = require('../utils/auth');

// GET route for homepage
router.get('/', async (req, res) => {
	if (req.session.logged_in) {
		res.redirect('/dashboard');
		return;
	}
	res.render('home', {
		loggedIn: req.session.logged_in,
	});
});

// GET all tickets for dashboard
router.get('/dashboard', withAuth, async (req, res) => {
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

		const userData = await User.findByPk(req.session.user_id, {
			attributes: { exclude: ['password'] },
		});

		const tickets = ticketData.map((ticket) => ticket.get({ plain: true }));
		const user = userData.get({ plain: true });

		res.render('dashboard', {
			tickets,
			loggedIn: req.session.logged_in,
			user,
		});
	} catch (err) {
		res.status(500).json(err);
	}
});

// GET route for admins (users with role_id = 1) to view/ update all users
router.get('/admin', withAuth, async (req, res) => {
	try {
		const userData = await User.findAll({
			attributes: { exclude: ['password'] },
		});

		const currentUserData = await User.findByPk(req.session.user_id, {
			attributes: { exclude: ['password'] },
		});

		const users = userData.map((user) => user.get({ plain: true }));
		const user = currentUserData.get({ plain: true });

		if (user.role_id !== 1) {
			res.redirect('/dashboard');
			return;
		}
		res.render('admin', {
			users,
			user,
			loggedIn: req.session.logged_in,
		});
	} catch (err) {
		res.status(500).json(err);
	}
});

// admin/update/:id route to update a user's role
router.get('/admin/update/:id', withAuth, async (req, res) => {
	try {
		const userData = await User.findByPk(req.params.id, {
			attributes: { exclude: ['password'] },
		});
		const user = userData.get({ plain: true });

		const currentUserData = await User.findByPk(req.session.user_id, {
			attributes: { exclude: ['password'] },
		});
		const currentUser = currentUserData.get({ plain: true });
		if (currentUser.role_id !== 1) {
			res.redirect('/dashboard');
			return;
		}
		res.render('update-user', {
			user,
			currentUser,
			loggedIn: req.session.logged_in,
		});
	} catch (err) {
		res.status(500).json(err);
	}
});

router.get('/login', (req, res) => {
	// If the user is already logged in, redirect the request to another route
	if (req.session.logged_in) {
		res.redirect('/dashboard');
		return;
	}

	res.render('login');
});

module.exports = router;
