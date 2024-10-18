
import type { NextApiRequest, NextApiResponse } from 'next';
import { getUsersCollection } from 'src/lib/server/collections';

type CaseNote = {
  note: string;
  timestamp: string; // Using string to store date as "YYYY-MM-DD"
};

type Premium = {
  amount: number;
  timestamp: string; // Using string to store date as "YYYY-MM-DD"
};

type DateChange = {
  date: string;
  timestamp: string; // Using string to store date as "YYYY-MM-DD"
};

type ActiveStatusChange = {
  status: boolean;
  timestamp: string; // Using string to store date as "YYYY-MM-DD"
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

    // Update the last entry in the premium_date array
    if (userData.premium_date && userData.premium_date.length > 0) {
      userData.premium_date[userData.premium_date.length - 1].premium = parseFloat(req.body.CurrentNYDeduction);
    }

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
      premium_date: userData.premium_date,
    };

    // Append the new case note with formatted date string
    if (req.body.CaseNotes !== undefined && req.body.CaseNotes !== "" && req.body.CaseNotes !== updateData.CaseNotes) {
      updateData.CaseNotes = req.body.CaseNotes;
      updateData.CaseNotesHistory.push({
        note: req.body.CaseNotes,
        timestamp: new Date().toISOString().slice(0, 10) // Store as "YYYY-MM-DD"
      });
    }

    if (req.body.CurrentTotalPremium !== undefined && req.body.CurrentTotalPremium !== 0 && req.body.CurrentTotalPremium !== updateData.CurrentTotalPremium) {
      updateData.CurrentTotalPremium = req.body.CurrentTotalPremium;
      updateData.CurrentTotalPremiumHistory.push({
        amount: req.body.CurrentTotalPremium,
        timestamp: new Date().toISOString().slice(0, 10) // Store as "YYYY-MM-DD"
      });
    }

    if (req.body.PolicyEffectiveDate !== undefined && req.body.PolicyEffectiveDate !== "" && req.body.PolicyEffectiveDate !== updateData.PolicyEffectiveDate) {
      updateData.PolicyEffectiveDate = req.body.PolicyEffectiveDate;
      updateData.PolicyEffectiveDateHistory.push({
        date: req.body.PolicyEffectiveDate,
        timestamp: new Date().toISOString().slice(0, 10) // Store as "YYYY-MM-DD"
      });
    }

    if (req.body.ChangeDate !== undefined && req.body.ChangeDate !== "" && req.body.ChangeDate !== updateData.ChangeDate) {
      updateData.ChangeDate = req.body.ChangeDate;
      updateData.ChangeDateHistory.push({
        date: req.body.ChangeDate,
        timestamp: new Date().toISOString().slice(0, 10) // Store as "YYYY-MM-DD"
      });
    }

    if (req.body.StartDate !== undefined && req.body.StartDate !== "" && req.body.StartDate !== updateData.StartDate) {
      updateData.StartDate = req.body.StartDate;
      updateData.StartDateHistory.push({
        date: req.body.StartDate,
        timestamp: new Date().toISOString().slice(0, 10) // Store as "YYYY-MM-DD"
      });
    }

    // Update active status
    if (req.body.Active !== undefined && req.body.Active !== updateData.Active) {
      updateData.Active = req.body.Active;
      updateData.ActiveHistory.push({
        status: req.body.Active,
        timestamp: new Date().toISOString().slice(0, 10) // Store as "YYYY-MM-DD"
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