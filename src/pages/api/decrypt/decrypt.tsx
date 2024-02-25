import { NextApiRequest, NextApiResponse } from 'next';
import { initializeApp } from 'firebase/app';
import { getFirestore, collection, query as firestoreQuery, where, getDocs } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
  measurementId: process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID
};

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const app = initializeApp(firebaseConfig);
  const db = getFirestore(app);

  if (req.method === 'POST') {
    try {
      const { userName, categories } = req.body as { userName: string, categories: string[] };
      const postsCollection = collection(db, 'posts');
      
      if (Array.isArray(categories)) {
        const q1 = firestoreQuery(postsCollection, where('users', 'array-contains', userName));
        const postDocsSnapshot1 = await getDocs(q1);
        const posts1 = postDocsSnapshot1.docs.map(doc => doc.data());

        const posts = posts1.filter(post => categories.some(category => post.categories && post.categories.includes(category))).map(post => ({
          fileName: post.filename,
          url: post.downloadURL,
          image: post.image,
          timestamp: post.timestamp,
        }));

        res.status(200).json(posts);
      } else {
        console.error('Invalid categories:', categories);
        res.status(400).json({ error: 'Bad Request', details: 'Invalid categories' });
      }
    } catch (error) {
      console.error('Error fetching posts:', (error as Error).message);
      res.status(500).json({ error: 'Internal Server Error', details: (error as Error).message });
    }
  } else {
    res.status(405).end('Method Not Allowed');
  }
}