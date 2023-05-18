const newTicketSpan = document.querySelector('#new-ticket-span');

const handleToggleNewTicketFormContainer = () => {
	const newTicketFormContainer = document.querySelector(
		'#new-ticket-form-container'
	);
	if (newTicketFormContainer.classList.contains('hide')) {
		newTicketFormContainer.classList.remove('hide');
		newTicketSpan.textContent = '-';
	} else {
		newTicketFormContainer.classList.add('hide');
		newTicketSpan.textContent = '+';
	}
};

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
newTicketSpan.addEventListener('click', handleToggleNewTicketFormContainer);
