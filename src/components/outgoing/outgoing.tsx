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

0488751     F459270004887510000002025-08-078271C2025-08-07605BM68412025-08-060000000000000

0585341     F459270005853410000002025-08-078271C2025-08-07605BM68412025-08-060000000000000

0614190     F459270006141900000002025-08-070721C2025-08-07605BM70442025-08-061000000000000

0760236     F459270007602360000002025-08-078271C2025-08-07605BM68419999-12-310000000012804

1221794     F459270012217940000002025-08-078271A2025-08-07605BM68419999-12-310000000002204

1289203     F459270012892030000002025-08-078271C2025-08-07605BM68419999-12-310000000006693

1421974     F459270014219740000002025-08-070721C2025-08-07605BM70442025-08-061000000000000

1422022     F459270014220220000002025-08-078271C2025-08-07605BM68412025-08-060000000000000

1510002     F459270015100020000002025-08-078271A2025-08-07605BM68419999-12-310000000011862

1581846     F459270015818460000002025-08-078271A2025-08-07605BM68419999-12-310000000002031

1672338     F459270016723380000002025-08-078271A2025-08-07605BM68419999-12-310000000005678

1734808     F459270017348080000002025-08-078271A2025-08-07605BM68419999-12-310000000000652

1846826     F459270018468260000002025-08-078271C2025-08-07605BM68412025-08-060000000000000

1867173     F459270018671730000002025-08-078271C2025-08-07605BM68412025-08-060000000000000

1882814     F459270018828140000002025-08-078271A2025-08-07605BM68419999-12-310000000000981

1933660     F459270019336600000002025-08-078271A2025-08-07605BM68419999-12-310000000004766

1942485     F459270019424850000002025-08-078271A2025-08-07605BM68419999-12-310000000001962

2034274     F459270020342740000002025-08-078271A2025-08-07605BM68419999-12-310000000002204

2034289     F459270020342890000002025-08-078271A2025-08-07605BM68419999-12-310000000002936

2034334     F459270020343340000002025-08-078271A2025-08-07605BM68419999-12-310000000002862

2034376     F459270020343760000002025-08-078271A2025-08-07605BM68419999-12-310000000003323

2034416     F459270020344160000002025-08-078271A2025-08-07605BM68419999-12-310000000003081

2034456     F459270020344560000002025-08-078271A2025-08-07605BM68419999-12-310000000002544

2034472     F459270020344720000002025-08-078271A2025-08-07605BM68419999-12-310000000002564

2034481     F459270020344810000002025-08-078271A2025-08-07605BM68419999-12-310000000001800

2034510     F459270020345100000002025-08-078271A2025-08-07605BM68419999-12-310000000001500

2034577     F459270020345770000002025-08-078271A2025-08-07605BM68419999-12-310000000004996

2034608     F459270020346080000002025-08-078271A2025-08-07605BM68419999-12-310000000001373
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