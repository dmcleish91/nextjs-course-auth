// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import { NextAuthOptions } from 'next-auth';
import NextAuth from 'next-auth/next';
import CredentialProvider from 'next-auth/providers/credentials';
import { verifyPassword } from '../../../libs/authenticationutils';
import { connectToClient, userExists } from '../../../libs/dbconnectionutils';

const authOptions: NextAuthOptions = {
	session: {
		strategy: 'jwt',
	},
	providers: [
		CredentialProvider({
			type: 'credentials',
			credentials: {},
			authorize: async (credentials) => {
				const { email, password } = credentials as { email: string; password: string };
				console.log('credentials =', credentials);

				const client = await connectToClient();
				const db = client.db();
				const user = await userExists(db, 'users', { email: email });

				if (!user) {
					client.close();
					throw new Error('No user found!');
				}

				console.log('user = ', user);

				const isValid = verifyPassword(password, user.password);

				if (!isValid) {
					client.close();
					throw new Error('invalid password! Try again!');
				}

				client.close();
				return { id: user._id.toString(), email: email };
			},
		}),
	],
};

export default NextAuth(authOptions);
