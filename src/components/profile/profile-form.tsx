import { useState } from 'react';
import classes from './profile-form.module.css';

function ProfileForm() {
	const [formData, setFormData] = useState({ newPassword: '', oldPassword: '', oldPasswordConfirm: '' });
	const [validationMessage, setValidationMessage] = useState<string>('');

	function changeHandler(event: React.ChangeEvent<HTMLInputElement>) {
		setFormData({ ...formData, [event.target.name]: event.target.value });
	}

	async function submitHandler(event: React.FormEvent) {
		event.preventDefault();

		if (formData.oldPassword !== formData.oldPasswordConfirm) {
			setValidationMessage('Passwords do not match!');
			return;
		}

		setValidationMessage('Processing Request');

		const { newPassword, oldPassword, oldPasswordConfirm } = formData;

		const response = await fetch('/api/user/change-password', {
			method: 'PATCH',
			body: JSON.stringify({ newPassword: newPassword, oldPassword: oldPassword, oldPasswordConfirm: oldPasswordConfirm }),
			headers: { 'Content-Type': 'application/json' },
		});

		const result = await response.json();

		setValidationMessage(result.message);
	}
	return (
		<>
			<form className={classes.form} onSubmit={submitHandler}>
				<div className={classes.control}>
					<label htmlFor='new-password'>New Password</label>
					<input type='password' name='newPassword' id='new-password' onChange={changeHandler} required />
				</div>
				<div className={classes.control}>
					<label htmlFor='old-password'>Old Password</label>
					<input type='password' name='oldPassword' id='old-password' onChange={changeHandler} required />
				</div>
				<div className={classes.control}>
					<label htmlFor='old-password'>Confirm Old Password</label>
					<input type='password' name='oldPasswordConfirm' id='confirm-old-password' onChange={changeHandler} required />
				</div>
				<div className={classes.action}>
					<button>Change Password</button>
				</div>
			</form>
			{validationMessage && <p>{validationMessage}</p>}
		</>
	);
}

export default ProfileForm;
