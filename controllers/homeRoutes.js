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

		const currentUserData = await User.findByPk(req.session.user_id, {
			attributes: { exclude: ['password'] },
		});

		const allUserData = await User.findAll({
			attributes: { exclude: ['password'] },
		});

		const tickets = ticketData.map((ticket) => ticket.get({ plain: true }));
		const currentUser = currentUserData.get({ plain: true });
		const adminUsers = allUserData.filter((user) => user.role_id === 1);
		const users = adminUsers.map((user) => user.get({ plain: true }));

		res.render('dashboard', {
			tickets,
			loggedIn: req.session.logged_in,
			currentUser,
			users,
		});
	} catch (err) {
		res.status(500).json(err);
	}
});

// get route for a single ticket by id
router.get('/ticket/:id', withAuth, async (req, res) => {
	try {
		const ticketData = await Ticket.findByPk(req.params.id, {
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
				// Include the comments
				{
					model: Comment,
					include: [
						{
							model: User,
							attributes: ['name', 'email', 'id', 'role_id'],
						},
					],
				},
			],
		});
		const currentUserData = await User.findByPk(req.session.user_id, {
			attributes: { exclude: ['password'] },
		});
		// serialize the ticket data make sure to serialize the comments.user data as well
		const ticket = ticketData.get({ plain: true });

		const currentUser = currentUserData.get({ plain: true });

		// if the ticket creator or assigned user is not the current user, pass in enabled = false to the template
		res.render('ticket', {
			ticket,
			loggedIn: req.session.logged_in,
			currentUser,
			enabled:
				ticket.creator.id === currentUser.id ||
				ticket.assignedUser.id === currentUser.id
					? true
					: false,
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
		const currentUser = currentUserData.get({ plain: true });

		if (currentUser.role_id !== 1) {
			res.redirect('/dashboard');
			return;
		}
		res.render('admin', {
			users,
			currentUser,
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

		const userRoleData = await Role.findByPk(user.role_id);
		const userRole = userRoleData.get({ plain: true });

		const roleData = await Role.findAll();
		// omit the role that the user already has
		const cleanRoles = roleData.filter((role) => role.id !== user.role_id);
		const roles = cleanRoles.map((role) => role.get({ plain: true }));

		const currentUser = currentUserData.get({ plain: true });
		if (currentUser.role_id !== 1) {
			res.redirect('/dashboard');
			return;
		}
		res.render('update-user', {
			user,
			currentUser,
			loggedIn: req.session.logged_in,
			userRole,
			roles,
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
