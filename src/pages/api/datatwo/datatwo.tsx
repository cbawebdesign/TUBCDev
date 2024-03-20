import type { NextApiRequest, NextApiResponse } from 'next';
import { getIncomingDocumentsCollection } from 'src/lib/server/collections';
import { initializeFirebaseAdminApp } from 'src/core/firebase/admin/initialize-firebase-admin-app';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  await initializeFirebaseAdminApp();

  if (req.method === 'GET') {
    try {
      const documentsSnapshot = await getIncomingDocumentsCollection().get();
      const documents = documentsSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));

      res.status(200).json(documents);
    } catch (error) {
      console.error('Error fetching documents:', error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  } else if (req.method === 'DELETE') {
    const { documentId, lineIndex } = req.body;
  
    try {
      const documentRef = getIncomingDocumentsCollection().doc(documentId);
      const documentSnapshot = await documentRef.get();
      const documentData = documentSnapshot.data();
  
      if (!documentData || !documentData.change) {
        res.status(404).json({ error: 'Document not found' });
        return;
      }
  
      if (lineIndex >= 0 && lineIndex < documentData.change.length) {
        documentData.change.splice(lineIndex, 1);
        await documentRef.update(documentData);
  
        // Return the updated document
        res.status(200).json({ id: documentId, ...documentData });
      } else {
        res.status(400).json({ error: 'Invalid line index' });
      }
    } catch (error) {
      console.error('Error deleting line:', error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  }
   else {
    res.status(405).end('Method Not Allowed');
  }
}