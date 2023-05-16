console.log('adminUpdate.js');

/* <form>
	{{log user}}
	<label for='name'>
		Name:
	</label>
	<input type='text' id='name' name='name' value='{{user.name}}' />
	<label for='email'>
		Email:
	</label>
	<input type='text' id='email' name='email' value='{{user.email}}' />

	<label for='role'>
		Role:
	</label>
	<select id='role' name='role'>
		<option value='{{userRole.id}}' selected>
			{{userRole.role_name}}
		</option>
		{{#each roles as |role|}}
			{{#unless (eq role.id userRole.id)}}
				<option value='{{role.id}}'>
					{{role.role_name}}
				</option>
			{{/unless}}
		{{/each}}
	</select>
	<button type='submit'>
		Update User
	</button>
</form> */

const deleteUserBtn = document.querySelector('#delete-user-btn');

const updateUserHandler = async (event) => {
	event.preventDefault();

	const name = document.querySelector('#name').value.trim();
	const email = document.querySelector('#email').value.trim();
	const role = document.querySelector('#role').value.trim();
	const id = document.querySelector('#update-user').getAttribute('data-id');

	if (name && email && role) {
		try {
			const response = await fetch(`/api/users/${id}`, {
				method: 'PUT',
				body: JSON.stringify({ name, email, role_id: role }),
				headers: { 'Content-Type': 'application/json' },
			});
			if (response.ok) {
				const data = await response.json();
				console.log(data);
				document.location.replace('/admin');
			}
		} catch (err) {
			console.error(err);
		}
	}
};

const deleteUserHandler = async (event) => {
	event.preventDefault();
	const confirmDelete = confirm('Are you sure you want to delete this user?');
	const id = deleteUserBtn.getAttribute('data-id');

	if (!confirmDelete) {
		return;
	}
	try {
		const response = await fetch(`/api/users/${id}`, {
			method: 'DELETE',
		});
		if (response.ok) {
			document.location.replace('/admin');
		}
	} catch (err) {
		console.error(err);
	}
};

document.addEventListener('submit', updateUserHandler);
deleteUserBtn.addEventListener('click', deleteUserHandler);
