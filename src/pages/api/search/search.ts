// pages/api/searchUsers.ts

import type { NextApiRequest, NextApiResponse } from 'next';
import { getUsersCollection } from 'src/lib/server/collections';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'POST') {
    const { query } = req.body;
    const usersCollection = getUsersCollection();
    const snapshot = await usersCollection.where('name', '==', query).get();
    const users = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));

    res.status(200).json(users);
  } else {
    res.status(405).end('Method Not Allowed');
  }
}
