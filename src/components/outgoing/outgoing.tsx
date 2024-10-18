import { useState, useEffect } from 'react';
import { getStorage, ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";
import { initialize, document } from '@ironcorelabs/ironweb';
import iconv from 'iconv-lite';

export default function OutgoingPage() {
  interface Document {
    title: string;
    content: string;
    change: string[];
    id: string;
  }
  const [selectedLines, setSelectedLines] = useState<{ [key: string]: boolean }>({});

  const [documents, setDocuments] = useState<{ change: string[] }[]>([]);
  const [documentsTwo, setDocumentsTwo] = useState<Document[]>([]);
  const [scriptStatus, setScriptStatus] = useState<'idle' | 'running' | 'success' | 'error'>('idle');

  const toggleLineSelection = (documentId: string, lineIndex: number) => {
    setSelectedLines(prevState => ({
      ...prevState,
      [`${documentId}-${lineIndex}`]: !prevState[`${documentId}-${lineIndex}`]
    }));
  };
  
  const deleteSelectedLines = () => {
    Object.keys(selectedLines).forEach(key => {
      if (selectedLines[key]) {
        const [documentId, lineIndex] = key.split('-');
        deleteLine(documentId, parseInt(lineIndex));
      }
    });
  };

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

// ... other code ...

const deleteLine = (documentId: string, lineIndex: number) => {
  fetch(`/api/datatwo/datatwo`, {
    method: 'DELETE',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ documentId, lineIndex }),
  })
    .then(response => response.json())
    .then(updatedDocument => {
      setDocumentsTwo(prevDocuments => {
        return prevDocuments.map(document => {
          if (document.id === documentId) {
            return updatedDocument;
          } else {
            return document;
          }
        });
      });
    })
    .catch(error => console.error('Error deleting line:', error));
};
const triggerPythonScript = () => {
  setScriptStatus('running');
  fetch('/api/trigger/trigger', {
    method: 'POST',
  })
    .then(response => response.json())
    .then(data => {
      console.log('Python script executed:', data);
      setScriptStatus('success');
    })
    .catch(error => {
      console.error('Error running Python script:', error);
      setScriptStatus('error');
    });
};
return (
    <div>
       <button onClick={triggerPythonScript} style={{ backgroundColor: scriptStatus === 'running' ? 'gray' : '#4CAF50', color: 'white', border: 'none', borderRadius: '4px', padding: '10px 20px', fontSize: '16px', margin: '0 0 20px 0' }}  disabled={scriptStatus === 'running' || scriptStatus === 'success' || scriptStatus === 'error'}
 >Pull Latest Changes</button>
  {scriptStatus === 'running' && <p>Function is scheduled to run...</p>}
  {scriptStatus === 'success' && <p>Updates pulled successfully, please wait 1-2 minutes and refresh your page.</p>}
  {scriptStatus === 'error' && <p>Updates pulled successfully, please wait 1-2 minutes and refresh your page.</p>}
      <div style={{ marginBottom: '20px', border: '2px solid fuchsia', padding: '10px' }}>
        <h2 style={{ color: 'fuchsia ', textAlign: 'center' }}>Weekly Changes:</h2>
        {documents.map((document, documentIndex) => (
          <div key={documentIndex}>
            {document.change && <pre>
              {document.change.map((change, lineIndex) => (
                <div key={lineIndex}>
                  {change}
                </div>
              ))}
            </pre>}
          </div>
        ))}
      </div>
      <div style={{ marginTop: '20px', border: '2px solid fuchsia', padding: '10px' }}>
      <h2 style={{ color: 'fuschia', textAlign: 'center' }}>NY Output Files Que:</h2>
      {documentsTwo.map((document, documentIndex) => (
        <div key={documentIndex}>
          {document.change && document.change.map((line, lineIndex) => (
            <div key={lineIndex} style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-start' }}>
              {lineIndex !== 0 && (
                <input
                  type="checkbox"
                  checked={selectedLines[`${document.id}-${lineIndex}`] || false}
                  onChange={() => toggleLineSelection(document.id, lineIndex)}
                />
              )}
              <pre style={{ marginRight: '10px' }}>{line}</pre>
            </div>
          ))}
        </div>
      ))}
<button onClick={deleteSelectedLines} style={{ backgroundColor: '#f44336', color: 'white', border: 'none', borderRadius: '4px', padding: '10px 20px', fontSize: '16px', cursor: 'pointer' }}>Delete Selected</button>    
</div>
   

    <div style={{ marginTop: '20px', border: '2px solid fuchsia', padding: '10px' }}>
  <h2 style={{ color: 'fucshia', textAlign: 'center' }}>Sent NY Files:</h2>
  <pre>
  {`
0229738     F459270002297380000002024-10-178271C2024-10-17605BM68412024-10-160000000000000

0557491     F459270005574910000002024-10-178271C2024-10-17605BM68419999-12-310000000005066

0584529     F459270005845290000002024-10-178271C2024-10-17605BM68412024-10-160000000000000

1087015     F459270010870150000002024-10-178271C2024-10-17605BM68419999-12-310000000003692

1135570     F459270011355700000002024-10-178271C2024-10-17605BM68419999-12-310000000009532

1509973     F459270015099730000002024-10-178271A2024-10-17605BM68419999-12-310000000003060

1626569     F459270016265690000002024-10-178271C2024-10-17605BM68419999-12-310000000003280

1652415     F459270016524150000002024-10-178271C2024-10-17605BM68419999-12-310000000001732

1672043     F459270016720430000002024-10-178271C2024-10-17605BM68419999-12-310000000001686

1678147     F459270016781470000002024-10-178271C2024-10-17605BM68419999-12-310000000003462

1683488     F459270016834880000002024-10-178271C2024-10-17605BM68419999-12-310000000002008

1717214     F459270017172140000002024-10-178271C2024-10-17605BM68419999-12-310000000001640

1717377     F459270017173770000002024-10-178271C2024-10-17605BM68419999-12-310000000005332

1850524     F459270018505240000002024-10-178271C2024-10-17605BM68419999-12-310000000005308

1890419     F459270018904190000002024-10-178271C2024-10-17605BM68419999-12-310000000013128

1890424     F459270018904240000002024-10-178271C2024-10-17605BM68419999-12-310000000004984

1467910     F459270014679100000002024-10-178271C2024-10-17605BM68419999-12-310000000007962

1699807     F459270016998070000002024-10-178271C2024-10-17605BM68419999-12-310000000001385

1854629     F459270018546290000002024-10-178271A2024-10-17605BM68419999-12-310000000004010
`}
 </pre>
  <h2 style={{  textAlign: 'left' }}></h2>
  <pre>
    {`
`}
  </pre>
</div>

    </div>
    
  );
}