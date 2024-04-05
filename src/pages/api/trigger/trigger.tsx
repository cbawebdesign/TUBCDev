import type { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method === 'POST') {
        try {
            // Use the URL of your Google Cloud Function
            const cloudFunctionUrl = 'https://us-central1-amidnight1a.cloudfunctions.net/pull_latest_changes';

            const response = await fetch(cloudFunctionUrl, { method: 'POST' });
            const data = await response.text();

            // Return the response from the Cloud Function
            res.status(200).json({ message: 'Python script executed', data });
        } catch (error) {
            console.error('Error running Python script:', (error as Error).message);
            res.status(500).json({ error: 'Internal Server Error', details: (error as Error).message });
        }
    } else {
        res.status(405).end('Method Not Allowed');
    }
}