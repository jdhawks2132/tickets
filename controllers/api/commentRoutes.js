const router = require('express').Router();
const { Comment } = require('../../models');
const withAuth = require('../../utils/auth');

// create a new comment
router.post('/', withAuth, async (req, res) => {
	try {
		const newComment = await Comment.create({
			...req.body,
			user_id: req.session.user_id,
		});
		res.status(200).json(newComment);
	} catch (err) {
		console.error('Error:', err); // Log the error object
		res.status(500).json({ message: 'Something went wrong!' });
	}
});

// delete a comment
router.delete('/:id', withAuth, async (req, res) => {
	try {
		const commentData = await Comment.findOne({
			where: {
				id: req.params.id,
			},
		});

		if (!commentData) {
			res.status(404).json({ message: 'No comment found with this id!' });
			return;
		}

		if (commentData.user_id !== req.session.user_id) {
			res
				.status(403)
				.json({ message: 'You are not authorized to delete this comment!' });
			return;
		}

		// Now that we've checked for authorization, delete the comment
		await Comment.destroy({
			where: {
				id: req.params.id,
			},
		});

		res.status(200).json(commentData);
	} catch (err) {
		console.error('Error:', err); // Log the error object
		res.status(500).json({ message: 'Something went wrong!' });
	}
});
module.exports = router;
