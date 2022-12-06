// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next';
import { z } from 'zod';
import { hashPassword } from '../../../libs/authenticationutils';
import { connectToClient } from '../../../libs/dbconnectionutils';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
	if (req.method !== 'POST') {
		return;
	}
	const data = req.body;

	const { email, password } = data;

	const SignUpData = z.object({
		email: z.string().email(),
		password: z.string().min(7),
	});

	const validation = SignUpData.safeParse({ email: email, password: password });

	if (!validation.success) {
		res.status(422).json({ message: 'error', data: validation.error.issues });
		return;
	}

	const client = await connectToClient();

	const db = client.db();

	const existingUser = await db.collection('users').findOne({ email: email });

	if (existingUser) {
		res.status(422).json({ message: 'error', data: 'user exists in database' });
		client.close;
		return;
	}

	const hashedPassword = hashPassword(password);

	db.collection('users').insertOne({ email: email, password: hashedPassword });

	res.status(200).json({ message: 'ok', data: { email: email, password: hashedPassword } });
	client.close;
}
