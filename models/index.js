const User = require('./User');
const Ticket = require('./Ticket');
const Comment = require('./Comment');
const Role = require('./Role');

// User has many Tickets
User.hasMany(Ticket, {
	as: 'CreatedTickets',
	foreignKey: 'user_id',
	onDelete: 'CASCADE',
});

User.hasMany(Ticket, {
	as: 'AssignedTickets',
	foreignKey: 'assigned_user_id',
	onDelete: 'CASCADE',
});

// Ticket belongs to User
Ticket.belongsTo(User, {
	as: 'creator',
	foreignKey: 'user_id',
});

// User has many Comments
User.hasMany(Comment, {
	foreignKey: 'user_id',
	onDelete: 'CASCADE',
});

// Comment belongs to User
Comment.belongsTo(User, {
	foreignKey: 'user_id',
});

// Ticket has many Comments
Ticket.hasMany(Comment, {
	foreignKey: 'ticket_id',
	onDelete: 'CASCADE',
});

// Ticket has one assigned_user_id
Ticket.belongsTo(User, { as: 'assignedUser', foreignKey: 'assigned_user_id' });

// Comment belongs to Ticket
Comment.belongsTo(Ticket, {
	foreignKey: 'ticket_id',
});

// User has one Role
User.belongsTo(Role, {
	foreignKey: 'role_id',
});

// Role has many Users
Role.hasMany(User, {
	foreignKey: 'role_id',
	onDelete: 'CASCADE',
});

module.exports = { User, Ticket, Comment, Role };
