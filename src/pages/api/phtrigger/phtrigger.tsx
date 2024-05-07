import type { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method === 'POST') {
        try {
            // Use the URL of your Google Cloud Function
            const cloudFunctionUrl = 'https://us-central1-amidnight1a.cloudfunctions.net/premium_history ';

            const response = await fetch(cloudFunctionUrl, { method: 'POST' });
            const data = await response.json(); // Use json() instead of text()

            // Check if the Cloud Function is still processing
            if (data.status === 'Processing') {
                // Return a 202 status to indicate that the request has been accepted but is not yet complete
                res.status(202).json({ message: 'Processing', data });
            } else {
                // Return the response from the Cloud Function
                res.status(200).json({ message: 'Python script executed', data });
            }
        } catch (error) {
            console.error('Error running Python script:', (error as Error).message);
            res.status(500).json({ error: 'Internal Server Error', details: (error as Error).message });
        }
    } else {
        res.status(405).end('Method Not Allowed');
    }
}