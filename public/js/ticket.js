console.log('Hello from ticket.js!');

{
	/* <div class='ticket-detail'>
	{{log ticket}}
	<div class='ticket-detail-card' id='ticket-detail-{{ticket.id}} data-id='>
		<h2>
			{{ticket.title}}
		</h2>
		<p>
			{{ticket.description}}
		</p>
		<p>
			Created by: {{ticket.creator.name}}
		</p>
		<p>
			Status: {{ticket.status}}
		</p>
		<p>
			Priority: {{ticket.priority}}
		</p>
		<p>
			Assigned to: {{ticket.assignedUser.name}}
		</p>
		{{! each ticket.comments in a ul }}
		<ul>
			{{#each ticket.comments as |comment|}}
				<li data-id='{{comment.user_id}}'>
					{{comment.comment_text}} - {{comment.user.name}}
				</li>
			{{/each}}
		</ul>
	</div>
	<div class='comment-form'>
		<form data-id='{{currentUser.id}}'>
			<label for='comment'>
				Comment:
			</label>
			<textarea id='comment' name='comment-text'></textarea>
			<button type='submit'>
				Submit
			</button>
		</form>
	</div>
	<button id='delete-ticket-btn' data-id='{{ticket.id}}'>
		Delete Ticket
	</button>
</div> */
}

const deleteBtn = document.querySelector('#delete-ticket-btn');
//
const commentDeleteBtn = document.querySelectorAll('.delete-comment-btn');

const commentFormHandler = async (event) => {
	event.preventDefault();

	const comment_text = document.querySelector('#comment').value.trim();
	const user_id = document.querySelector('form').getAttribute('data-id');
	const ticket_id = document
		.querySelector('#ticket-detail-card')
		.getAttribute('data-id');

	console.log(comment_text, user_id, ticket_id);

	if (comment_text) {
		try {
			const response = await fetch('/api/comments', {
				method: 'POST',
				body: JSON.stringify({ comment_text, ticket_id }),
				headers: { 'Content-Type': 'application/json' },
			});
			if (response.ok) {
				const data = await response.json();
				console.log(data);
				document.location.reload();
			}
		} catch (err) {
			console.error(err);
		}
	}
};

const deleteTicketHandler = async (event) => {
	if (event.target.hasAttribute('data-id')) {
		try {
			const response = await fetch(
				`/api/tickets/${event.target.getAttribute('data-id')}`,
				{
					method: 'DELETE',
				}
			);
			if (response.ok) {
				document.location.replace('/dashboard');
			}
		} catch (err) {
			console.error(err);
		}
	}
};

const deleteCommentHandler = async (event) => {
	if (event.target.hasAttribute('data-id')) {
		try {
			const response = await fetch(
				`/api/comments/${event.target.getAttribute('data-id')}`,
				{
					method: 'DELETE',
				}
			);
			if (response.ok) {
				document.location.reload();
			}
		} catch (err) {
			console.error(err);
		}
	}
};

document.addEventListener('submit', commentFormHandler);
deleteBtn.addEventListener('click', deleteTicketHandler);
commentDeleteBtn.forEach((btn) => {
	btn.addEventListener('click', deleteCommentHandler);
});
