import type { NextApiRequest, NextApiResponse } from 'next';
import { doc, updateDoc, arrayUnion } from "firebase/firestore"; 
import { getFirestore } from "firebase/firestore";
import { initializeFirebaseAdminApp } from 'src/core/firebase/admin/initialize-firebase-admin-app';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    await initializeFirebaseAdminApp();

    if (req.method === 'POST') {
      try {
        const { uid, avatarURL, fileName } = req.body;
        const db = getFirestore();
        const userRef = doc(db, 'users', uid);
  
        const fileData = {
          url: avatarURL,
          title: fileName,
          date: new Date().toISOString(),
        };
  
        await updateDoc(userRef, {
          Files: arrayUnion(fileData),
        });
  
        res.status(200).json({ message: 'User updated successfully' });
      } catch (error) {
        console.error('Error updating user:', (error as Error).message);
        res.status(500).json({ error: 'Internal Server Error', details: (error as Error).message });
      }
    } else {
      res.status(405).end('Method Not Allowed');
    }
}