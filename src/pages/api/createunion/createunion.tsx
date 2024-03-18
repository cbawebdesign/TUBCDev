import type { NextApiRequest, NextApiResponse } from 'next';
import firebaseAdmin from 'firebase-admin';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (!firebaseAdmin.apps.length) {
        firebaseAdmin.initializeApp({
            credential: firebaseAdmin.credential.applicationDefault(),
        });
    }

    if (req.method === 'POST') {
        try {
            const { unionName, unionCode, subCode } = req.body;

            const firestore = firebaseAdmin.firestore();

            const unionRecord = await firestore.collection('unions').add({
                unionName,
                unionCode,
                subCode,
                'creationDate': firebaseAdmin.firestore.FieldValue.serverTimestamp(), // creation date
            });

            res.status(200).json({ message: 'Union created successfully', id: unionRecord.id });
        } catch (error) {
            console.error('Error creating union:', (error as Error).message);
            res.status(500).json({ error: 'Internal Server Error', details: (error as Error).message });
        }
    } else {
        res.status(405).end('Method Not Allowed');
    }
}