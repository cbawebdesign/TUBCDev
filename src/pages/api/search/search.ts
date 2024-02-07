// pages/api/searchUsers.ts

import type { NextApiRequest, NextApiResponse } from 'next';
import { getUsersCollection } from 'src/lib/server/collections';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'POST') {
    const { query, union, active, limit = 20 } = req.body;
    
    let queryBuilder: any = getUsersCollection();

    // Only add 'where' clause if 'query' is not an empty string
    if (query !== '') {
      queryBuilder = queryBuilder.where('Name', '==', query);
    }

    // Only add 'where' clause if 'union' is not an empty string
    if (union !== '') {
      queryBuilder = queryBuilder.where('union', '==', union);
    }

    // Only add 'where' clause if 'active' is not an empty string
    if (active !== '') {
      // Convert the string 'true' or 'false' to boolean
      queryBuilder = queryBuilder.where('Active', '==', active === 'true');
    }

    // Always add 'limit' to the query
    queryBuilder = queryBuilder.limit(limit);

    try {
      const snapshot = await queryBuilder.get();
      const users = snapshot.docs.map((doc: { id: any; data: () => any; }) => ({ id: doc.id, ...doc.data() }));

      res.status(200).json(users);
    } catch (error) {
      console.error('Error fetching users:', error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  } else {
    res.status(405).end('Method Not Allowed');
  }
}