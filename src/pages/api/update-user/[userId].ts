import type { NextApiRequest, NextApiResponse } from 'next';
import { getUsersCollection } from 'src/lib/server/collections';
import { firestore } from 'firebase-admin'; // Ensure firebase-admin is installed

type CaseNote = {
  note: string;
  timestamp: firestore.Timestamp; // Firestore Timestamp
};

type Premium = {
  amount: number;
  timestamp: firestore.Timestamp;
};

type DateChange = {
  date: string;
  timestamp: firestore.Timestamp;
};

type ActiveStatusChange = {
  status: boolean;
  timestamp: firestore.Timestamp;
};

type PremiumDateEntry = {
  date: string;
  premium: number;
};

type UserData = {
  Active?: boolean;
  ActiveHistory?: ActiveStatusChange[];
  CaseNotes?: string;
  CaseNotesHistory?: CaseNote[];
  CurrentTotalPremium?: number;
  CurrentTotalPremiumHistory?: Premium[];
  PolicyEffectiveDate?: string;
  PolicyEffectiveDateHistory?: DateChange[];
  ChangeDate?: string;
  ChangeDateHistory?: DateChange[];
  StartDate?: string;
  StartDateHistory?: DateChange[];
  premium_date?: PremiumDateEntry[];
};

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'POST') {
    const userId = req.query.userId as string;
    console.log('Updating user with ID:', userId);

    const userDoc = await getUsersCollection().doc(userId).get();
    const userData = userDoc.data() as UserData;

    if (!userData) {
      res.status(404).json({ error: 'User not found' });
      return;
    }

    userData.premium_date = userData.premium_date || [];

    const currentDate = new Date().toISOString().slice(0, 10);
    const currentPremium = parseFloat(req.body.CurrentNYDeduction || '0');

    const existingEntryIndex = userData.premium_date.findIndex(
      entry => entry.date === currentDate
    );

    if (existingEntryIndex !== -1) {
      userData.premium_date[existingEntryIndex].premium = currentPremium;
    } else {
      userData.premium_date.push({ date: currentDate, premium: currentPremium });
    }

    const updateData: UserData = {
      ...userData,
      CaseNotes: userData.CaseNotes || '',
      CaseNotesHistory: userData.CaseNotesHistory || [],
      CurrentTotalPremium: userData.CurrentTotalPremium || 0,
      CurrentTotalPremiumHistory: userData.CurrentTotalPremiumHistory || [],
      PolicyEffectiveDate: userData.PolicyEffectiveDate || '',
      PolicyEffectiveDateHistory: userData.PolicyEffectiveDateHistory || [],
      ChangeDate: userData.ChangeDate || '',
      ChangeDateHistory: userData.ChangeDateHistory || [],
      StartDate: userData.StartDate || '',
      StartDateHistory: userData.StartDateHistory || [],
      Active: userData.Active || false,
      ActiveHistory: userData.ActiveHistory || [],
      premium_date: [...userData.premium_date],
    };

    // Append a new case note if needed
    if (req.body.CaseNotes && req.body.CaseNotes !== updateData.CaseNotes) {
      updateData.CaseNotes = req.body.CaseNotes;

      const rawTimestamp = req.body.timestamp || firestore.Timestamp.now();
      const parsedTimestamp = parseFirestoreTimestamp(rawTimestamp);

      updateData.CaseNotesHistory!.push({
        note: req.body.CaseNotes,
        timestamp: parsedTimestamp,
      });
    }

    try {
      console.log('Saving updateData to Firestore:', updateData);
      await getUsersCollection().doc(userId).set(updateData, { merge: true });
      res.status(200).json({ message: 'User updated successfully' });
    } catch (error) {
      console.error('Error updating user:', error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  } else {
    res.status(405).end('Method Not Allowed');
  }
}

// Helper function to handle Firestore Timestamps correctly
function parseFirestoreTimestamp(
  timestamp: any
): firestore.Timestamp {
  if (timestamp instanceof firestore.Timestamp) {
    return timestamp;
  }

  if (typeof timestamp === 'string' || timestamp instanceof Date) {
    const date = new Date(timestamp);
    if (!isNaN(date.getTime())) {
      return firestore.Timestamp.fromDate(date);
    }
  }

  console.warn('Invalid timestamp, defaulting to now.');
  return firestore.Timestamp.now();
}
