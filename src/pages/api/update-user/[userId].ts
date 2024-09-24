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

    // Ensure premium_date is initialized as an array if it's missing
    if (!userData.premium_date) {
      userData.premium_date = [];
    }

    // Get the current date in "YYYY-MM-DD" format
    const currentDate = new Date().toISOString().slice(0, 10);

    // Add or update the entry for the premium_date array for the current date
    const currentPremium = parseFloat(req.body.CurrentNYDeduction);  // Convert deduction to number

    // Check if there's already an entry for today's date in premium_date
    const existingPremiumEntryIndex = userData.premium_date.findIndex(entry => entry.date === currentDate);

    if (existingPremiumEntryIndex !== -1) {
      // If an entry exists, update the premium for that date
      userData.premium_date[existingPremiumEntryIndex].premium = currentPremium;
    } else {
      // If no entry exists for today, add a new one
      userData.premium_date.push({
        date: currentDate,
        premium: currentPremium,
      });
    }

    // Construct the updateData by copying values from userData and req.body
    const updateData: UserData = {
      ...userData,
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
      premium_date: [...userData.premium_date],  // Ensure premium_date is updated with the new entry
    };

    // Ensure CaseNotesHistory is initialized
    if (!updateData.CaseNotesHistory) {
      updateData.CaseNotesHistory = [];
    }

    // Append the new case note to the updateData.CaseNotes array if necessary
    if (req.body.CaseNotes !== undefined && req.body.CaseNotes !== "" && req.body.CaseNotes !== updateData.CaseNotes) {
      updateData.CaseNotes = req.body.CaseNotes;
      updateData.CaseNotesHistory.push({
        note: req.body.CaseNotes,
        timestamp: new Date(),  // Use the current date and time
      });
    }

    // Ensure CurrentTotalPremiumHistory is initialized
    if (!updateData.CurrentTotalPremiumHistory) {
      updateData.CurrentTotalPremiumHistory = [];
    }

    if (req.body.CurrentTotalPremium !== undefined && req.body.CurrentTotalPremium !== 0 && req.body.CurrentTotalPremium !== updateData.CurrentTotalPremium) {
      updateData.CurrentTotalPremium = req.body.CurrentTotalPremium;
      updateData.CurrentTotalPremiumHistory.push({
        amount: req.body.CurrentTotalPremium,
        timestamp: new Date(),  // Use the current date and time
      });
    }

    // Ensure PolicyEffectiveDateHistory is initialized
    if (!updateData.PolicyEffectiveDateHistory) {
      updateData.PolicyEffectiveDateHistory = [];
    }

    if (req.body.PolicyEffectiveDate !== undefined && req.body.PolicyEffectiveDate !== "" && req.body.PolicyEffectiveDate !== updateData.PolicyEffectiveDate) {
      updateData.PolicyEffectiveDate = req.body.PolicyEffectiveDate;
      updateData.PolicyEffectiveDateHistory.push({
        date: req.body.PolicyEffectiveDate,
        timestamp: new Date(),  // Use the current date and time
      });
    }

    // Ensure ChangeDateHistory is initialized
    if (!updateData.ChangeDateHistory) {
      updateData.ChangeDateHistory = [];
    }

    if (req.body.ChangeDate !== undefined && req.body.ChangeDate !== "" && req.body.ChangeDate !== updateData.ChangeDate) {
      updateData.ChangeDate = req.body.ChangeDate;
      updateData.ChangeDateHistory.push({
        date: req.body.ChangeDate,
        timestamp: new Date(),  // Use the current date and time
      });
    }

    // Ensure StartDateHistory is initialized
    if (!updateData.StartDateHistory) {
      updateData.StartDateHistory = [];
    }

    if (req.body.StartDate !== undefined && req.body.StartDate !== "" && req.body.StartDate !== updateData.StartDate) {
      updateData.StartDate = req.body.StartDate;
      updateData.StartDateHistory.push({
        date: req.body.StartDate,
        timestamp: new Date(),  // Use the current date and time
      });
    }

    // Ensure ActiveHistory is initialized
    if (!updateData.ActiveHistory) {
      updateData.ActiveHistory = [];
    }

    // Append the new active status to the updateData.ActiveHistory array if necessary
    if (req.body.Active !== undefined && req.body.Active !== updateData.Active) {
      updateData.Active = req.body.Active;
      updateData.ActiveHistory.push({
        status: req.body.Active,
        timestamp: new Date(),  // Use the current date and time
      });
    }

    try {
      // Log the updateData to check the structure
      console.log('Saving updateData to Firestore:', updateData);

      // Save the update to Firestore
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
