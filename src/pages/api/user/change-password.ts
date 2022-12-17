// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next';
import { getSession } from 'next-auth/react';
import { z } from 'zod';
import { hashPassword, verifyPassword } from '../../../libs/authenticationutils';
import { connectToClient } from '../../../libs/dbconnectionutils';

// Informational responses (100–199) Hold On
// Successful responses (200–299)    Here you go
// Redirection messages (300–399)    Go away
// Client error responses (400–499)  You fucked up
// Server error responses (500–599)  I fucked up
export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'PATCH') return;

  // NOTE: checks the incoming request for a token and returns a null object if not available
  const session = await getSession({ req: req });

  if (!session) {
    res.status(401).json({ message: 'Not Authenticated' });
    return;
  }

  const userEmail = session.user?.email;
  const oldPassword = req.body.oldPassword;
  const newPassword = req.body.newPassword;

  const client = await connectToClient();

  const userCollection = client.db().collection('users');

  const user = await userCollection.findOne({ email: userEmail });

  if (!user) {
    res.status(404).json({ message: 'How do you not have a user?' });
    client.close;
    return;
  }

  const currentPassword = oldPassword;
  const isValid = verifyPassword(currentPassword, user.password);

  if (!isValid) {
    res.status(403).json({ message: 'Invalid Password!' });
    client.close;
    return;
  }

  const hashedPassword = hashPassword(newPassword);

  const result = await userCollection.updateOne({ email: userEmail }, { $set: { password: hashedPassword } });

  res.status(200).json({ message: 'Password updated!' });

  client.close;
}
