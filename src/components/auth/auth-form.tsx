import React, { useState } from 'react';
import classes from './auth-form.module.css';
import { signIn } from 'next-auth/react';
import { useRouter } from 'next/router';

async function createUser(email: string, password: string) {
	const response = await fetch('/api/auth/signup', {
		method: 'POST',
		body: JSON.stringify({ email, password }),
		headers: { 'Content-Type': 'application/json' },
	});

	const result = await response.json();

	if (!response.ok) {
		throw new Error(result.data || 'something went wrong!');
	}

	return result;
}

function AuthForm() {
	const router = useRouter();
	const [formData, setFormData] = useState({ email: '', password: '' });
	const [isLogin, setIsLogin] = useState(true);

	function switchAuthModeHandler() {
		setIsLogin((prevState) => !prevState);
	}

	function changeHandler(event: React.ChangeEvent<HTMLInputElement>) {
		setFormData({ ...formData, [event.target.name]: event.target.value });
	}

	async function submitHandler(event: React.FormEvent) {
		event.preventDefault();

		if (isLogin) {
			const result = await signIn('credentials', { redirect: false, email: formData.email, password: formData.password });
			if (!result?.error) {
				router.replace('/profile');
			}
		} else {
			try {
				const result = await createUser(formData.email, formData.password);
				console.log(result);
				if (result.message === 'ok') {
					const firstLogin = await signIn('credentials', { redirect: false, email: formData.email, password: formData.password });
					if (!firstLogin?.error) {
						router.replace('/profile');
					}
				}
				//setFormData({ email: '', password: '' });
			} catch (error) {
				console.log(error);
			}
		}
	}

	return (
		<section className={classes.auth}>
			<h1>{isLogin ? 'Login' : 'Sign Up'}</h1>
			<form onSubmit={submitHandler}>
				<div className={classes.control}>
					<label htmlFor='email'>Your Email</label>
					<input type='email' name='email' id='email' value={formData.email} onChange={changeHandler} required />
				</div>
				<div className={classes.control}>
					<label htmlFor='password'>Your Password</label>
					<input type='password' name='password' id='password' value={formData.password} onChange={changeHandler} required />
				</div>
				<div className={classes.actions}>
					<button>{isLogin ? 'Login' : 'Create Account'}</button>
					<button type='button' className={classes.toggle} onClick={switchAuthModeHandler}>
						{isLogin ? 'Create new account' : 'Login with existing account'}
					</button>
				</div>
			</form>
		</section>
	);
}

export default AuthForm;
