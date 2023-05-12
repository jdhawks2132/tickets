const router = require('express').Router();
const { User } = require('../../models');

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

router.post('/logout', (req, res) => {
	if (req.session.logged_in) {
		req.session.destroy(() => {
			res.status(204).end();
		});
	} else {
		res.status(404).end();
	}
});

module.exports = router;
