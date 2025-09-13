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

1037054     F459270010370540000002025-09-118271A2025-09-11605BM68419999-12-310000000003927

1122858     F459270011228580000002025-09-118271A2025-09-11605BM68419999-12-310000000013200

1194088     F459270011940880000002025-09-118271A2025-09-11605BM68419999-12-310000000005492

1221794     F459270012217940000002025-09-118271C2025-09-11605BM68419999-12-310000000002054

1294330     F459270012943300000002025-09-118271A2025-09-11605BM68419999-12-310000000005423

1425664     F459270014256640000002025-09-118271A2025-09-11605BM68419999-12-310000000007823

1509980     F459270015099800000002025-09-118271A2025-09-11605BM68419999-12-310000000003508

1510002     F459270015100020000002025-09-118271C2025-09-11605BM68419999-12-310000000011862

1521844     F459270015218440000002025-09-118271A2025-09-11605BM68419999-12-310000000009093

1581846     F459270015818460000002025-09-118271C2025-09-11605BM68419999-12-310000000002031

1626569     F459270016265690000002025-09-118271C2025-09-11605BM68419999-12-310000000001640

1672338     F459270016723380000002025-09-118271C2025-09-11605BM68419999-12-310000000005678

1707439     F459270017074390000002025-09-118271A2025-09-11605BM68419999-12-310000000001119

1734808     F459270017348080000002025-09-118271C2025-09-11605BM68419999-12-310000000000652

1814356     F459270018143560000002025-09-118271A2025-09-11605BM68419999-12-310000000001639

1840186     F459270018401860000002025-09-118271A2025-09-11605BM68419999-12-310000000004766

1845326     F459270018453260000002025-09-118271A2025-09-11605BM68419999-12-310000000005516

1882814     F459270018828140000002025-09-118271C2025-09-11605BM68419999-12-310000000000981

1911366     F459270019113660000002025-09-118271A2025-09-11605BM68419999-12-310000000002492

1933660     F459270019336600000002025-09-118271C2025-09-11605BM68419999-12-310000000004766

1942485     F459270019424850000002025-09-118271C2025-09-11605BM68419999-12-310000000001962

1971003     F459270019710030000002025-09-118271A2025-09-11605BM68419999-12-310000000002839

2034274     F459270020342740000002025-09-118271C2025-09-11605BM68419999-12-310000000002204

2034289     F459270020342890000002025-09-118271C2025-09-11605BM68419999-12-310000000002936

2034294     F459270020342940000002025-09-118271A2025-09-11605BM68419999-12-310000000002331

2034334     F459270020343340000002025-09-118271C2025-09-11605BM68419999-12-310000000002862

2034376     F459270020343760000002025-09-118271C2025-09-11605BM68419999-12-310000000003323

2034416     F459270020344160000002025-09-118271C2025-09-11605BM68419999-12-310000000003081

2034446     F459270020344460000002025-09-118271A2025-09-11605BM68419999-12-310000000002983

2034456     F459270020344560000002025-09-118271C2025-09-11605BM68419999-12-310000000002544

2034472     F459270020344720000002025-09-118271C2025-09-11605BM68419999-12-310000000002564

2034481     F459270020344810000002025-09-118271C2025-09-11605BM68419999-12-310000000001800

2034510     F459270020345100000002025-09-118271C2025-09-11605BM68419999-12-310000000001500

2034577     F459270020345770000002025-09-118271C2025-09-11605BM68419999-12-310000000004996

2034607     F459270020346070000002025-09-118271C2025-09-11605BM68419999-12-310000000001731

2034608     F459270020346080000002025-09-118271C2025-09-11605BM68419999-12-310000000001373

2039737     F459270020397370000002025-09-118271A2025-09-11605BM68419999-12-310000000002839

2039756     F459270020397560000002025-09-118271A2025-09-11605BM68419999-12-310000000003727

2039816     F459270020398160000002025-09-118271A2025-09-11605BM68419999-12-310000000001385

2039900     F459270020399000000002025-09-118271A2025-09-11605BM68419999-12-310000000002608

2039965     F459270020399650000002025-09-118271A2025-09-11605BM68419999-12-310000000001292

2040014     F459270020400140000002025-09-118271A2025-09-11605BM68419999-12-310000000000946

2040050     F459270020400500000002025-09-118271A2025-09-11605BM68419999-12-310000000001592

2040071     F459270020400710000002025-09-118271A2025-09-11605BM68419999-12-310000000000831
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