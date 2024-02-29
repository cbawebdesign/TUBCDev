// pages/api/update-user/[userId].ts

import type { NextApiRequest, NextApiResponse } from 'next';
import { getUsersCollection } from 'src/lib/server/collections';
type CaseNote = {
  note: string;
  timestamp: Date;
};

type UserData = {
  // other properties...
  CaseNotes?: CaseNote[];
};

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'POST') {
    const userId = req.query.userId as string; // Get the user ID from the URL
    console.log('Updating user with ID:', userId); // Log the user ID

    // Fetch the user document from the database
    const userDoc = await getUsersCollection().doc(userId).get();

    // Get the current data
    const userData = userDoc.data() as UserData;

    // Check if userData is undefined
    if (!userData) {
      res.status(404).json({ error: 'User not found' });
      return;
    }

    // Copy all properties from req.body to updateData
    const updateData = {
      ...userData,
      ...req.body,
      CaseNotes: userData.CaseNotes || []
    };

   // Append the new case note to the updateData.CaseNotes array if it's not undefined
if (req.body.CaseNotes !== undefined) {
  updateData.CaseNotes.push({
    note: req.body.CaseNotes,
    timestamp: new Date()
  });
}
    try {
      // Update the user document in the database
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