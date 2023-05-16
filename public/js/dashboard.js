{
	/* <div>
	<h2>
		New Ticket
	</h2>
	{{! new ticket form }}
	<form>
		<label for='title'>
			Title:
		</label>
		<input type='text' id='title' name='title' />
		<label for='description'>
			Description:
		</label>
		<textarea id='description' name='description'></textarea>
		<label for='status'>
			Status:
		</label>
		<select id='status' name='status'>
			<option value='Open'>
				Open
			</option>
			<option value='In Progress'>
				In Progress
			</option>
			<option value='Closed'>
				Closed
			</option>
		</select>
		<label for='priority'>
			Priority:
		</label>
		<select id='priority' name='priority'>
			<option value='1'>
				1
			</option>
			<option value='2'>
				2
			</option>
			<option value='3'>
				3
			</option>
		</select>
		<label for='assigned_user_id'>
			Assigned User:
		</label>
		<select id='assigned_user_id' name='assigned_user_id'>
			{{#each users as |user|}}
				<option value='{{user.id}}'>
					{{user.name}}
				</option>
			{{/each}}
		</select>
		<button type='submit'>
			Create Ticket
		</button>
	</form>
</div> */
}

console.log('hi from dashboard.js');

const newTicketFormHandler = async (event) => {
	event.preventDefault();

	const title = document.querySelector('#title').value.trim();
	const description = document.querySelector('#description').value.trim();
	const status = document.querySelector('#status').value.trim();
	const priority = document.querySelector('#priority').value.trim();
	const assigned_user_id = document
		.querySelector('#assigned_user_id')
		.value.trim();
	const user_id = document.querySelector('form').getAttribute('data-id');

	if (title && description && status && priority && assigned_user_id) {
		try {
			const response = await fetch('/api/tickets', {
				method: 'POST',
				body: JSON.stringify({
					title,
					description,
					status,
					priority,
					assigned_user_id,
					user_id,
				}),
				headers: { 'Content-Type': 'application/json' },
			});
			if (response.ok) {
				const data = await response.json();
				console.log(data);
				document.location.replace('/dashboard');
			}
		} catch (err) {
			console.error(err);
		}
	}
};

document.addEventListener('submit', newTicketFormHandler);
