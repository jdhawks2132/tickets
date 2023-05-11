const router = require('express').Router();
const { Ticket } = require('../../models');
const withAuth = require('../../utils/auth');

// Get all tickets
router.get('/', async (req, res) => {
	try {
		const ticketData = await Ticket.findAll();
		res.status(200).json(ticketData);
	} catch (err) {
		res.status(500).json(err);
	}
});

// Get one ticket include associated comments
router.get('/:id', withAuth, async (req, res) => {
	try {
		const ticketData = await Ticket.findByPk(req.params.id, {
			include: [{ model: Comment }],
		});

		if (!ticketData) {
			res.status(404).json({ message: 'No ticket found with this id!' });
			return;
		}

		res.status(200).json(ticketData);
	} catch (err) {
		res.status(500).json(err);
	}
});

// Create ticket
router.post('/', withAuth, async (req, res) => {
	try {
		const ticketData = await Ticket.create(req.body);
		res.status(200).json(ticketData);
	} catch (err) {
		res.status(400).json(err);
	}
});

// Update ticket
router.put('/:id', withAuth, async (req, res) => {
	try {
		const ticketData = await Ticket.update(req.body, {
			where: {
				id: req.params.id,
			},
		});
		if (!ticketData[0]) {
			res.status(404).json({ message: 'No ticket found with this id!' });
			return;
		}
		res.status(200).json(ticketData);
	} catch (err) {
		res.status(500).json(err);
	}
});

// Delete ticket ONLY IF the user is the owner of the ticket or assigned_user of the ticket
router.delete('/:id', withAuth, async (req, res) => {
	try {
		const ticketData = await Ticket.destroy({
			where: {
				id: req.params.id,
			},
		});
		if (!ticketData) {
			res.status(404).json({ message: 'No ticket found with this id!' });
			return;
		}
		if (
			ticketData.user_id !== req.session.user_id ||
			ticketData.assigned_user_id !== req.session.user_id
		) {
			res
				.status(403)
				.json({ message: 'You are not authorized to delete this ticket!' });
			return;
		}
		res.status(200).json(ticketData);
	} catch (err) {
		res.status(500).json(err);
	}
});

// get all tickets for the user are assigned to the LOGGED IN USER (req.session.user_id)
router.get('/assigned/:id', withAuth, async (req, res) => {
	try {
		const ticketData = await Ticket.findAll({
			where: {
				assigned_user_id: req.session.user_id,
			},
		});
		res.status(200).json(ticketData);
	} catch (err) {
		res.status(500).json(err);
	}
});

// get all tickets for the user are created by the LOGGED IN USER (req.session.user_id)
router.get('/created/:id', withAuth, async (req, res) => {
	try {
		const ticketData = await Ticket.findAll({
			where: {
				user_id: req.session.user_id,
			},
		});
		res.status(200).json(ticketData);
	} catch (err) {
		res.status(500).json(err);
	}
});

module.exports = router;
