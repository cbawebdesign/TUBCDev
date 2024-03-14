// pages/api/update-user/[userId].ts

import type { NextApiRequest, NextApiResponse } from 'next';
import { getUsersCollection } from 'src/lib/server/collections';

type CaseNote = {
  note: string;
  timestamp: Date;
};

type Premium = {
  amount: number;
  timestamp: Date;
};

type DateChange = {
  date: string;
  timestamp: Date;
};

type ActiveStatusChange = {
  status: boolean;
  timestamp: Date;
};
type UserData = {
  // other properties...
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
      CaseNotes: userData.CaseNotes || "",
      CaseNotesHistory: userData.CaseNotesHistory || [],
      CurrentTotalPremium: userData.CurrentTotalPremium || 0,
      CurrentTotalPremiumHistory: userData.CurrentTotalPremiumHistory || [],
      PolicyEffectiveDate: userData.PolicyEffectiveDate || "",
      PolicyEffectiveDateHistory: userData.PolicyEffectiveDateHistory || [],
      ChangeDate: userData.ChangeDate || "",
      ChangeDateHistory: userData.ChangeDateHistory || [],
      StartDate: userData.StartDate || "",
      StartDateHistory: userData.StartDateHistory || [],
      Active: userData.Active || false,
      ActiveHistory: userData.ActiveHistory || [],
    };

    // Append the new case note to the updateData.CaseNotes array if it's not undefined
    if (req.body.CaseNotes !== undefined && req.body.CaseNotes !== "" && req.body.CaseNotes !== updateData.CaseNotes) {
      updateData.CaseNotes = req.body.CaseNotes;
      updateData.CaseNotesHistory.push({
        note: req.body.CaseNotes,
        timestamp: new Date().toISOString().slice(0, 10) // Format the date as "YYYY-MM-DD"
      });
    }

    if (req.body.CurrentTotalPremium !== undefined && req.body.CurrentTotalPremium !== 0 && req.body.CurrentTotalPremium !== updateData.CurrentTotalPremium) {
      updateData.CurrentTotalPremium = req.body.CurrentTotalPremium;
      updateData.CurrentTotalPremiumHistory.push({
        amount: req.body.CurrentTotalPremium,
        timestamp: new Date().toISOString().slice(0, 10) // Format the date as "YYYY-MM-DD"
      });
    }

    if (req.body.PolicyEffectiveDate !== undefined && req.body.PolicyEffectiveDate !== "" && req.body.PolicyEffectiveDate !== updateData.PolicyEffectiveDate) {
      updateData.PolicyEffectiveDate = req.body.PolicyEffectiveDate;
      updateData.PolicyEffectiveDateHistory.push({
        date: req.body.PolicyEffectiveDate,
        timestamp: new Date().toISOString().slice(0, 10) // Format the date as "YYYY-MM-DD"
      });
    }

    if (req.body.ChangeDate !== undefined && req.body.ChangeDate !== "" && req.body.ChangeDate !== updateData.ChangeDate) {
      updateData.ChangeDate = req.body.ChangeDate;
      updateData.ChangeDateHistory.push({
        date: req.body.ChangeDate,
        timestamp: new Date().toISOString().slice(0, 10) // Format the date as "YYYY-MM-DD"
      });
    }

    if (req.body.StartDate !== undefined && req.body.StartDate !== "" && req.body.StartDate !== updateData.StartDate) {
      updateData.StartDate = req.body.StartDate;
      updateData.StartDateHistory.push({
        date: req.body.StartDate,
        timestamp: new Date().toISOString().slice(0, 10) // Format the date as "YYYY-MM-DD"
      });
    }
// Append the new active status to the updateData.ActiveHistory array if it's not undefined and different from the current active status
if (req.body.Active !== undefined && req.body.Active !== updateData.Active) {
  updateData.Active = req.body.Active;
  updateData.ActiveHistory.push({
    status: req.body.Active,
    timestamp: new Date().toISOString().slice(0, 10) // Format the date as "YYYY-MM-DD"
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