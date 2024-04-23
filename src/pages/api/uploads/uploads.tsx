import { NextApiRequest, NextApiResponse } from 'next';
import * as admin from 'firebase-admin';

if (!admin.apps.length) {
  if (!process.env.GOOGLE_APPLICATION_CREDENTIALS) {
    throw new Error('The GOOGLE_APPLICATION_CREDENTIALS environment variable is not defined');
  }

  const serviceAccount = JSON.parse(Buffer.from(process.env.GOOGLE_APPLICATION_CREDENTIALS, 'base64').toString());

  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    databaseURL: process.env.NEXT_PUBLIC_FIREBASE_DATABASE_URL,
  });
}

const db = admin.firestore();

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'POST') {
    try {
      const encryptedFileName = req.body.fileName;
      const encryptedUrl = req.body.url;
      const categories = req.body.categories; // Get the categories from the request body
      const union = req.body.union; // Get the categories from the request body

      const docName = union;
      console.log('Document name:', docName);

      // Fetch the group document
      const groupDocRef = db.collection('groups').doc(docName);
      const groupDocSnap = await groupDocRef.get();

      if (groupDocSnap.exists) {
        const groupData = groupDocSnap.data();
        const members = groupData?.members || [];

        // Generate a random string for the post document name
        const postDocName = Math.random().toString(36).substring(2);

        // Create a new post document
        const postDocRef = db.collection('posts').doc(postDocName);
        await postDocRef.set({
          image: encryptedFileName,
          downloadURL: encryptedUrl,
          users: members,
          categories: categories,
          timestamp: admin.firestore.FieldValue.serverTimestamp(),
          union: union,
        });

        res.status(200).json({ message: 'Post created successfully' });
      } else {
        res.status(404).json({ error: 'Group not found' });
      }
    } catch (error) {
      console.error('Error creating post:', (error as Error).message);
      res.status(500).json({ error: 'Internal Server Error', details: (error as Error).message });
    }
  } else {
    res.status(405).end('Method Not Allowed');
  }
}