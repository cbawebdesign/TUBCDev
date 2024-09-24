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
  premium_date?: PremiumDateEntry[];  // Add premium_date array here
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

    // Add a new entry to the premium_date array with today's date and the new premium value
    const newPremiumEntry = {
      date: currentDate,
      premium: parseFloat(req.body.CurrentNYDeduction),  // Convert deduction to number
    };

    // Append the new premium entry to the premium_date array
    userData.premium_date.push(newPremiumEntry);

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

    // Append the new case note to the updateData.CaseNotes array if necessary
    if (req.body.CaseNotes !== undefined && req.body.CaseNotes !== "" && req.body.CaseNotes !== updateData.CaseNotes) {
      updateData.CaseNotes = req.body.CaseNotes;
      updateData.CaseNotesHistory.push({
        note: req.body.CaseNotes,
        timestamp: new Date(),  // Use the current date and time
      });
    }

    if (req.body.CurrentTotalPremium !== undefined && req.body.CurrentTotalPremium !== 0 && req.body.CurrentTotalPremium !== updateData.CurrentTotalPremium) {
      updateData.CurrentTotalPremium = req.body.CurrentTotalPremium;
      updateData.CurrentTotalPremiumHistory.push({
        amount: req.body.CurrentTotalPremium,
        timestamp: new Date(),  // Use the current date and time
      });
    }

    if (req.body.PolicyEffectiveDate !== undefined && req.body.PolicyEffectiveDate !== "" && req.body.PolicyEffectiveDate !== updateData.PolicyEffectiveDate) {
      updateData.PolicyEffectiveDate = req.body.PolicyEffectiveDate;
      updateData.PolicyEffectiveDateHistory.push({
        date: req.body.PolicyEffectiveDate,
        timestamp: new Date(),  // Use the current date and time
      });
    }

    if (req.body.ChangeDate !== undefined && req.body.ChangeDate !== "" && req.body.ChangeDate !== updateData.ChangeDate) {
      updateData.ChangeDate = req.body.ChangeDate;
      updateData.ChangeDateHistory.push({
        date: req.body.ChangeDate,
        timestamp: new Date(),  // Use the current date and time
      });
    }

    if (req.body.StartDate !== undefined && req.body.StartDate !== "" && req.body.StartDate !== updateData.StartDate) {
      updateData.StartDate = req.body.StartDate;
      updateData.StartDateHistory.push({
        date: req.body.StartDate,
        timestamp: new Date
