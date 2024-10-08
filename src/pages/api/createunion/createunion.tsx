import type { NextApiRequest, NextApiResponse } from 'next';
import firebaseAdmin from 'firebase-admin';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (!firebaseAdmin.apps.length) {
    firebaseAdmin.initializeApp({
      credential: firebaseAdmin.credential.applicationDefault(),
    });
  }

  const firestore = firebaseAdmin.firestore();

  if (req.method === 'POST') {
    try {
      const { unionName, unionCode, union_value, deductionPlan } = req.body;

      const unionRecordRef = firestore.collection('unions').doc(unionName);
      await unionRecordRef.set({
        unionName,
        unionCode,
        union_value,
        deductionPlan, // New field
        'creationDate': firebaseAdmin.firestore.FieldValue.serverTimestamp(), // creation date
      });

      res.status(200).json({ message: 'Union created successfully', id: unionRecordRef.id });
    } catch (error) {
      console.error('Error creating union:', (error as Error).message);
      res.status(500).json({ error: 'Internal Server Error', details: (error as Error).message });
    }
  } else if (req.method === 'GET') {
    try {
      const snapshot = await firestore.collection('unions').get();
      const unions = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      res.status(200).json(unions);
    } catch (error) {
      console.error('Error getting unions:', (error as Error).message);
      res.status(500).json({ error: 'Internal Server Error', details: (error as Error).message });
    }
  } else if (req.method === 'DELETE') {
    try {
      const { id } = req.body;
      await firestore.collection('unions').doc(id).delete();
      res.status(200).json({ message: 'Union deleted successfully' });
    } catch (error) {
      console.error('Error deleting union:', (error as Error).message);
      res.status(500).json({ error: 'Internal Server Error', details: (error as Error).message });
    }
  } else {
    res.status(405).end('Method Not Allowed');
  }
}