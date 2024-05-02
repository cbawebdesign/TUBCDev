import { NextApiRequest, NextApiResponse } from 'next';
import * as admin from 'firebase-admin';


if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.applicationDefault(),
  });
}

const db = admin.firestore();

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'POST') {
    try {
      const { userName, categories } = req.body as { userName: string, categories: string };
      const postsCollection = db.collection('posts');
      const q = postsCollection.where('users', 'array-contains', userName).where('categories', '==', categories);
      const postDocsSnapshot = await q.get();
      const posts = postDocsSnapshot.docs.map(doc => {
        const data = doc.data();
        return {
          fileName: data.filename,
          url: data.downloadURL,
          image: data.image,
          timestamp: data.timestamp instanceof admin.firestore.Timestamp ? data.timestamp.toDate() : null,
          union: data.union,
          id: doc.id,
          isRead: data.isRead,
        };
      });

      res.status(200).json(posts);
    } catch (error) {
      console.error('Error fetching posts:', (error as Error).message);
      res.status(500).json({ error: 'Internal Server Error', details: (error as Error).message });
    }
  } else {
    res.status(405).end('Method Not Allowed');
  }
}

const db = admin.firestore();

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'POST') {
    try {
      const { userName, categories } = req.body as { userName: string, categories: string };
      const postsCollection = db.collection('posts');
      const q = postsCollection.where('users', 'array-contains', userName).where('categories', '==', categories);
      const postDocsSnapshot = await q.get();
      const posts = postDocsSnapshot.docs.map(doc => {
        const data = doc.data();
        return {
          fileName: data.filename,
          url: data.downloadURL,
          image: data.image,
          timestamp: data.timestamp instanceof admin.firestore.Timestamp ? data.timestamp.toDate() : null,
          union: data.union,
          id: doc.id,
          isRead: data.isRead,
        };
      });

      res.status(200).json(posts);
    } catch (error) {
      console.error('Error fetching posts:', (error as Error).message);
      res.status(500).json({ error: 'Internal Server Error', details: (error as Error).message });
    }
  } else {
    res.status(405).end('Method Not Allowed');
  }
}