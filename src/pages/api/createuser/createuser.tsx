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
            const { uid, FirstName, LastName } = req.body;
            const email = `${uid}@example.com`;
            const password = 'defaultPassword123';
            const displayName = FirstName;

            const auth = firebaseAdmin.auth();
            const firestore = firebaseAdmin.firestore();

            const userRecord = await auth.createUser({
                uid,
                email,
                password,
                displayName
            });

            await firestore.collection('users').doc(uid).set({
                id: uid,
                MM: 0, // default value
                'MM Term': '', // default value
                DeductionStatus: 'WE', // default value
                FirstName,
                LastName,
                'CaseNotes': "", // default value
                'Active': "", // default value
                'ChangeDate': "", // default value
                'CurrentTotalPremium': 0, // default value
                'Files': [], // default value
                'LM': "", // default value
                'Name': `${FirstName} ${LastName}`, // computed value
                'PolicyEffectiveDate': "", // default value
                'Reference #': uid, // same as uid
                'StartDate': "", // default value
                'Status': "", // default value
                'Voya': "", // default value
                'current_deduction': 0, // default value
                'premium_date': [], // default value
                'reference': uid, // same as uid
                'union': "", // default value
                email,
                'creationDate': firebaseAdmin.firestore.FieldValue.serverTimestamp(), // creation date

            });

            res.status(200).json({ message: 'User created successfully', uid: userRecord.uid });
        } catch (error) {
            console.error('Error creating user:', (error as Error).message);
            res.status(500).json({ error: 'Internal Server Error', details: (error as Error).message });
        }
    } else {
        res.status(405).end('Method Not Allowed');
    }
}