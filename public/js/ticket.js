console.log('Hello from ticket.js!');

// {{! ticket detail page }}
// <div class='ticket-detail'>
//   {{log ticket}}
//   {{ log enabled }}
//   <div id='ticket-detail-card' data-id='{{ticket.id}}'>
//     <h2>
//       {{#if enabled}}
//         <input type="text" value="{{ticket.title}}" />
//       {{else}}
//         {{ticket.title}}
//       {{/if}}
//     </h2>
//     <p>
//       {{#if enabled}}
//         <textarea>{{ticket.description}}</textarea>
//       {{else}}
//         {{ticket.description}}
//       {{/if}}
//     </p>
//     <p>
//       Created by: {{ticket.creator.name}}
//     </p>
//     <p>
//       {{#if enabled}}
//         <label for="status">Status:</label>
//         <select id="status" name="status">
//           <option value="Open" {{#if (eq ticket.status "Open")}}selected{{/if}}>Open</option>
//           <option value="In Progress" {{#if (eq ticket.status "In Progress")}}selected{{/if}}>In Progress</option>
//           <option value="Closed" {{#if (eq ticket.status "Closed")}}selected{{/if}}>Closed</option>
//         </select>
//       {{else}}
//         Status: {{ticket.status}}
//       {{/if}}
//     </p>
//     <p>
//       Priority: {{ticket.priority}}
//     </p>
//     <p>
//       Assigned to: {{ticket.assignedUser.name}}
//     </p>
//     {{! each ticket.comments in a ul }}
//     <ul>
//       {{#each ticket.comments as |comment|}}
//         <li data-id='{{comment.user_id}}'>
//           {{comment.comment_text}} - {{comment.user.name}}
//           {{#if (eq comment.user_id ../currentUser.id)}}
//             <button class='delete-comment-btn' data-id='{{comment.id}}'>
//               Delete
//             </button>
//           {{else}}
//             <button
//               class='delete-comment-btn'
//               data-id='{{comment.id}}'
//               disabled
//             >
//               Delete
//             </button>
//           {{/if}}
//         </li>
//       {{/each}}
//     </ul>
//   </div>
//   <div class='comment-form'>
//     <form data-id='{{currentUser.id}}'>
//       <label for='comment'>
//         Comment:
//       </label>
//       <textarea id='comment' name='comment-text'></textarea>
//       <button type='submit'>
//         Submit
//       </button>
//     </form>
//   </div>
//   <button id='delete-ticket-btn' data-id='{{ticket.id}}' {{#if enabled}}'' {{else}} disabled{{/if}}>
//     Delete Ticket
//   </button>
{
	/* <button id='update-ticket-btn' data-id='{{ticket.id}}'{{#if enabled}}'' {{else}} disabled{{/if}}>
Update Ticket
</button> */
}

// </div>

// <script src='/js/ticket.js'></script>

const deleteBtn = document.querySelector('#delete-ticket-btn');
//
const commentDeleteBtn = document.querySelectorAll('.delete-comment-btn');

const updateBtn = document.querySelector('#update-ticket-btn');

const updateTicketHandler = async (event) => {
	event.preventDefault();
	const ticket_id = document
		.querySelector('#update-ticket-btn')
		.getAttribute('data-id');
	const title = document.querySelector('#ticket-title').value.trim();
	const description = document
		.querySelector('#ticket-description')
		.value.trim();
	const status = document.querySelector('#ticket-status').value.trim();

	if (title && description && status) {
		try {
			const response = await fetch(`/api/tickets/${ticket_id}`, {
				method: 'PUT',
				body: JSON.stringify({ title, description, status }),
				headers: { 'Content-Type': 'application/json' },
			});
			if (response.ok) {
				document.location.replace('/dashboard');
			}
		} catch (err) {
			console.error(err);
		}
	}
};

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
updateBtn.addEventListener('click', updateTicketHandler);
