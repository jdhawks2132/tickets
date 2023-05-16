const router = require('express').Router();
const { User, Ticket } = require('../../models');
const withAuth = require('../../utils/auth');

// POST /api/users

router.post('/', async (req, res) => {
	try {
		// set up a regex to check for the domain 'admin.com'
		const emailDomainCheck = /admin.com/gi;
		const userData = await User.create({
			name: req.body.name,
			email: req.body.email,
			password: req.body.password,
			// check to see if the email includes the domain 'admin.com'
			role_id: emailDomainCheck.test(req.body.email) ? 1 : 2,
		});

		req.session.save(() => {
			req.session.user_id = userData.id;
			req.session.logged_in = true;

			res.status(200).json(userData);
		});
	} catch (err) {
		res.status(400).json(err);
	}
});

// POST /api/users/login

router.post('/login', async (req, res) => {
	try {
		const userData = await User.findOne({
			where: { email: req.body.email },
		});

		if (!userData) {
			res
				.status(400)
				.json({ message: 'Incorrect email or password, please try again' });
			return;
		}

		const validPassword = await userData.checkPassword(req.body.password);

		if (!validPassword) {
			res
				.status(400)
				.json({ message: 'Incorrect email or password, please try again' });
			return;
		}

		req.session.save(() => {
			req.session.user_id = userData.id;
			req.session.logged_in = true;

			res.json({ user: userData, message: 'You are now logged in!' });
		});
	} catch (err) {
		res.status(400).json(err);
	}
});

// POST /api/users/logout

router.post('/logout', withAuth, (req, res) => {
	if (req.session.logged_in) {
		req.session.destroy(() => {
			res.status(204).end();
		});
	} else {
		res.status(404).end();
	}
});

// put /api/users/:id

router.put('/:id', withAuth, async (req, res) => {
	try {
		const userData = await User.update(req.body, {
			where: { id: req.params.id },
		});
		if (!userData) {
			res.status(404).json({ message: 'No user found with this id!' });
			return;
		}
		res.status(200).json(userData);
	} catch (err) {
		res.status(500).json(err);
	}
});

// delete /api/users/:id

router.delete('/:id', withAuth, async (req, res) => {
	console.log('hi from delete');
	console.log(req.params.id);
	try {
		const userIdToDelete = req.params.id;
		const newAssignedUserId = 3;

		const updatedTickets = await Ticket.update(
			{ assigned_user_id: newAssignedUserId },
			{
				where: { assigned_user_id: userIdToDelete },
			}
		);

		console.log('Updated tickets:', updatedTickets);

		const userData = await User.destroy({
			where: { id: userIdToDelete },
		});

		if (!userData) {
			res.status(404).json({ message: 'No user found with this id!' });
			return;
		}
		res.status(200).json(userData);
	} catch (err) {
		console.error('Error:', err); // Log the error object
		res.status(500).json({ message: 'Something went wrong!' });
	}
});
module.exports = router;
