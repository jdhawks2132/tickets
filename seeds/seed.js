const sequelize = require('../config/connection');
const { User, Role, Ticket, Comment } = require('../models');

const userData = require('./userData.json');
const roleData = require('./roleData.json');
const ticketData = require('./ticketData.json');
const commentData = require('./commentData.json');

const seedDatabase = async () => {
	await sequelize.sync({ force: true });

	await Role.bulkCreate(roleData, {
		individualHooks: true,
		returning: true,
	});

	await User.bulkCreate(userData, {
		individualHooks: true,
		returning: true,
	});

	await Ticket.bulkCreate(ticketData, {
		individualHooks: true,
		returning: true,
	});

	await Comment.bulkCreate(commentData, {
		individualHooks: true,
		returning: true,
	});

	process.exit(0);
};

seedDatabase();
