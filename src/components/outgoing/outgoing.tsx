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
0222512     F459270002225120000002026-03-268271C2026-03-26605BM68412026-03-250000000000000

0584377     F459270005843770000002026-03-268271C2026-03-26605BM68412026-03-250000000000000

1001004     F459270010010040000002026-03-268271C2026-03-26605BM68412026-03-250000000000000

1003227     F459270010032270000002026-03-268271C2026-03-26605BM68412026-03-250000000000000

1003470     F459270010034700000002026-03-268271C2026-03-26605BM68412026-03-250000000000000

2060650     F459270020606500000002026-03-268271A2026-03-26605BM68419999-12-310000000002054

0222512     F459270002225120000002026-03-268271C2026-03-26605BM68412026-03-250000000000000

0316549     F459270003165490000002026-03-268271C2026-03-26605BM68412026-03-250000000000000

0324405     F459270003244050000002026-03-268271C2026-03-26605BM68412026-03-250000000000000

0581743     F459270005817430000002026-03-260721C2026-03-26605BM70442026-03-251000000000000

0584377     F459270005843770000002026-03-268271C2026-03-26605BM68412026-03-250000000000000

0982568     F459270009825680000002026-03-268271C2026-03-26605BM68412026-03-250000000000000

0997037     F459270009970370000002026-03-268271C2026-03-26605BM68412026-03-250000000000000

1001004     F459270010010040000002026-03-268271C2026-03-26605BM68412026-03-250000000000000

1003227     F459270010032270000002026-03-268271C2026-03-26605BM68412026-03-250000000000000

1003470     F459270010034700000002026-03-268271C2026-03-26605BM68412026-03-250000000000000

1003669     F459270010036690000002026-03-268271C2026-03-26605BM68412026-03-250000000000000

1211192     F459270012111920000002026-03-260721C2026-03-26605BM70442026-03-251000000000000

1423069     F459270014230690000002026-03-268271C2026-03-26605BM68419999-12-310000000016511

2060650     F459270020606500000002026-03-268271A2026-03-26605BM68419999-12-310000000002054
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