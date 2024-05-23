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
  {scriptStatus === 'success' && <p>Updates pulled successfully, please refresh your page.</p>}
  {scriptStatus === 'error' && <p>Error running Python script, please try again.</p>}
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
  1311701     F459270013117010000002024-05-208271C2024-05-20605BM68412024-05-220000000000000
1419750     F459270014197500000002024-05-208271C2024-05-20605BM68412024-05-220000000000000
1461625     F459270014616250000002024-05-208271A2024-05-20605BM68419999-12-310000000001800
1474516     F459270014745160000002024-05-208271C2024-05-20605BM68419999-12-310000000002200
1478869     F459270014788690000002024-05-208271C2024-05-20605BM68419999-12-310000000002181
1501656     F459270015016560000002024-05-208271C2024-05-20605BM68419999-12-310000000001200
1683739     F459270016837390000002024-05-208271C2024-05-20605BM68419999-12-310000000001889
1702160     F459270017021600000002024-05-208271C2024-05-20605BM68419999-12-310000000002792
1839715     F459270018397150000002024-05-208271C2024-05-20605BM68419999-12-310000000005331
1850145     F459270018501450000002024-05-208271C2024-05-20605BM68419999-12-310000000002331
1850149     F459270018501490000002024-05-208271C2024-05-20605BM68419999-12-310000000002846
1925399     F459270019253990000002024-05-208271C2024-05-20605BM68419999-12-310000000003292
1938082     F459270019380820000002024-05-208271C2024-05-20605BM68419999-12-310000000001992
0511717     F459270005117170000002024-05-208271C2024-05-20605BM68419999-12-310000000000900
0555941     F459270005559410000002024-05-208271C2024-05-20605BM68419999-12-310000000000900
0584483     F459270005844830000002024-05-208271C2024-05-20605BM68419999-12-310000000001950
0598204     F459270005982040000002024-05-208271C2024-05-20605BM68419999-12-310000000001400
0765104     F459270007651040000002024-05-208271C2024-05-20605BM68419999-12-310000000002089
1003881     F459270010038810000002024-05-208271C2024-05-20605BM68419999-12-310000000001050
1031827     F459270010318270000002024-05-208271C2024-05-20605BM68419999-12-310000000001400
1156309     F459270011563090000002024-05-208271C2024-05-20605BM68419999-12-310000000004800
1478869     F459270014788690000002024-05-230721C2024-05-23605BM70442024-05-221000000000000
0362994     F459270003629940000002024-05-238271A2024-05-23605BM68419999-12-311000000001050
0509051     F459270005090510000002024-05-238271A2024-05-23605BM68419999-12-311000000002450
1084646     F459270010846460000002024-05-238271A2024-05-23605BM68419999-12-311000000001348
1084648     F459270010846480000002024-05-238271A2024-05-23605BM68419999-12-311000000000900
1461497     F459270014614970000002024-05-238271A2024-05-23605BM68419999-12-311000000001200
1461544     F459270014615440000002024-05-238271A2024-05-23605BM68419999-12-311000000001750
1474514     F459270014745140000002024-05-238271A2024-05-23605BM68419999-12-311000000001200
1557328     F459270015573280000002024-05-238271A2024-05-23605BM68419999-12-311000000001000
1707381     F459270017073810000002024-05-238271A2024-05-23605BM68419999-12-311000000001000
1717388     F459270017173880000002024-05-238271A2024-05-23605BM68419999-12-311000000000500
1854689     F459270018546890000002024-05-238271A2024-05-23605BM68419999-12-311000000003854
1859473     F459270018594730000002024-05-238271A2024-05-23605BM68419999-12-311000000004996
1925540     F459270019255400000002024-05-238271A2024-05-23605BM68419999-12-311000000001200

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