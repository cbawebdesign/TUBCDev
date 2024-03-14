import { useState, useEffect } from 'react';
import { getStorage, ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";
import { initialize, document } from '@ironcorelabs/ironweb';
import iconv from 'iconv-lite';
export default function OutgoingPage() {
  interface Document {
    title: string;
    content: string;
    change: string[];
  }

  const [documents, setDocuments] = useState<{ change: string[] }[]>([]);
    const [documentsTwo, setDocumentsTwo] = useState<{ change: string[] }[]>([]);
  
  useEffect(() => {
    fetch('/api/data/data')
      .then(response => response.json())
      .then(data => {
        setDocuments(data);
      })
      .catch(error => console.error('Error fetching documents:', error));
  }, []);

  useEffect(() => {
    fetch('/api/datatwo/datatwo')
      .then(response => response.json())
      .then(data => {
        setDocumentsTwo(data);
      })
      .catch(error => console.error('Error fetching documentsTwo:', error));
  }, []);

  return (
    <div>
      <div style={{ marginBottom: '20px', border: '2px solid fuchsia', padding: '10px' }}>
        <h2 style={{ color: 'fuchsia', textAlign: 'center' }}>Weekly Changes:</h2>
        {documents.map((document, index) => (
          <div key={index}>
            {document.change && <pre>
              {document.change.map((change, index) => (
                <div key={index}>{change}</div>
              ))}
            </pre>}
          </div>
        ))}
      </div>
  
      <div style={{ marginTop: '20px', border: '2px solid fuchsia', padding: '10px' }}>
        <h2 style={{ color: 'fuchsia', textAlign: 'center' }}>NY Output Files Que:</h2>
        {documentsTwo.map((document, index) => (
          <div key={index}>
            {document.change && <pre>
              {document.change.map((change, index) => (
                <div key={index}>{change}</div>
              ))}
            </pre>}
          </div>
        ))}
      </div>
    </div>
  );
}