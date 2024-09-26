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

0339356     F459270003393560000002024-09-228271C2024-09-22605BM68412024-09-250000000000000

0538627     F459270005386270000002024-09-228271C2024-09-22605BM68419999-12-310000000009627

1044442     F459270010444420000002024-09-228271C2024-09-22605BM68419999-12-310000000006335

1333725     F459270013337250000002024-09-228271A2024-09-22605BM68419999-12-310000000002331

1393822     F459270013938220000002024-09-228271A2024-09-22605BM68419999-12-310000000001562

1406771     F459270014067710000002024-09-228271A2024-09-22605BM68419999-12-310000000002262

1603487     F459270016034870000002024-09-228271A2024-09-22605BM68419999-12-310000000001212

1607851     F459270016078510000002024-09-228271A2024-09-22605BM68419999-12-310000000000981

1699807     F459270016998070000002024-09-228271A2024-09-22605BM68419999-12-310000000002677

1707251     F459270017072510000002024-09-228271C2024-09-22605BM68419999-12-310000000007800

1838166     F459270018381660000002024-09-228271A2024-09-22605BM68419999-12-310000000000842

1840103     F459270018401030000002024-09-228271C2024-09-22605BM68419999-12-310000000002873

1854429     F459270018544290000002024-09-228271A2024-09-22605BM68419999-12-310000000002654

1976467     F459270019764670000002024-09-228271A2024-09-22605BM68419999-12-310000000001385

1976473     F459270019764730000002024-09-228271A2024-09-22605BM68419999-12-310000000000819

1976505     F459270019765050000002024-09-228271A2024-09-22605BM68419999-12-310000000001892

1976568     F459270019765680000002024-09-228271A2024-09-22605BM68419999-12-310000000001212

1976574     F459270019765740000002024-09-228271A2024-09-22605BM68419999-12-310000000001546

1976697     F459270019766970000002024-09-228271A2024-09-22605BM68419999-12-310000000000946

1976749     F459270019767490000002024-09-228271A2024-09-22605BM68419999-12-310000000000831

1976768     F459270019767680000002024-09-228271A2024-09-22605BM68419999-12-310000000001962

1976771     F459270019767710000002024-09-228271A2024-09-22605BM68419999-12-310000000003669

1976803     F459270019768030000002024-09-228271A2024-09-22605BM68419999-12-310000000002419

1976877     F459270019768770000002024-09-228271A2024-09-22605BM68419999-12-310000000000866

1976894     F459270019768940000002024-09-228271A2024-09-22605BM68419999-12-310000000001719

1976928     F459270019769280000002024-09-228271A2024-09-22605BM68419999-12-310000000001731

1977008     F459270019770080000002024-09-228271A2024-09-22605BM68419999-12-310000000002135

1977053     F459270019770530000002024-09-228271A2024-09-22605BM68419999-12-310000000000866

1977071     F459270019770710000002024-09-228271A2024-09-22605BM68419999-12-310000000000866

1977072     F459270019770720000002024-09-228271A2024-09-22605BM68419999-12-310000000004177

1977102     F459270019771020000002024-09-228271A2024-09-22605BM68419999-12-310000000000866

1977110     F459270019771100000002024-09-228271A2024-09-22605BM68419999-12-310000000000842

1977123     F459270019771230000002024-09-228271A2024-09-22605BM68419999-12-310000000001892
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