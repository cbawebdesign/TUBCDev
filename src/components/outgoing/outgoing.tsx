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

0898089     F459270008980890000002024-10-318271A2024-10-31605BM68419999-12-310000000002533

1007623     F459270010076230000002024-10-318271A2024-10-31605BM68419999-12-310000000002354

1026580     F459270010265800000002024-10-318271A2024-10-31605BM68419999-12-310000000003381

1436456     F459270014364560000002024-10-318271A2024-10-31605BM68419999-12-310000000001965

1566656     F459270015666560000002024-10-318271A2024-10-31605BM68419999-12-310000000001639

1624289     F459270016242890000002024-10-318271A2024-10-31605BM68419999-12-310000000001466

1632133     F459270016321330000002024-10-318271C2024-10-31605BM68412024-10-300000000000000

1812678     F459270018126780000002024-10-318271A2024-10-31605BM68419999-12-310000000002146

1859464     F459270018594640000002024-10-318271A2024-10-31605BM68419999-12-310000000001119

1898121     F459270018981210000002024-10-318271A2024-10-31605BM68419999-12-310000000003185

1918959     F459270019189590000002024-10-318271A2024-10-31605BM68419999-12-310000000000831

1929379     F459270019293790000002024-10-318271C2024-10-31605BM68419999-12-310000000005816

1992038     F459270019920380000002024-10-318271A2024-10-31605BM68419999-12-310000000001800

1992040     F459270019920400000002024-10-318271A2024-10-31605BM68419999-12-310000000001212

1992166     F459270019921660000002024-10-318271A2024-10-31605BM68419999-12-310000000003508

1992352     F459270019923520000002024-10-318271A2024-10-31605BM68419999-12-310000000001869

1992432     F459270019924320000002024-10-318271A2024-10-31605BM68419999-12-310000000000946

1992438     F459270019924380000002024-10-318271A2024-10-31605BM68419999-12-310000000001569

1992452     F459270019924520000002024-10-318271A2024-10-31605BM68419999-12-310000000002152

1992460     F459270019924600000002024-10-318271A2024-10-31605BM68419999-12-310000000004212

1992532     F459270019925320000002024-10-318271A2024-10-31605BM68419999-12-310000000001719

1992686     F459270019926860000002024-10-318271A2024-10-31605BM68419999-12-310000000002054

1992710     F459270019927100000002024-10-318271A2024-10-31605BM68419999-12-310000000001800

1992774     F459270019927740000002024-10-318271A2024-10-31605BM68419999-12-310000000001466

1992790     F459270019927900000002024-10-318271A2024-10-31605BM68419999-12-310000000002412

1992800     F459270019928000000002024-10-318271A2024-10-31605BM68419999-12-310000000002146

1992840     F459270019928400000002024-10-318271A2024-10-31605BM68419999-12-310000000000866

1992866     F459270019928660000002024-10-318271A2024-10-31605BM68419999-12-310000000001892

1992914     F459270019929140000002024-10-318271A2024-10-31605BM68419999-12-310000000001639

1993005     F459270019930050000002024-10-318271A2024-10-31605BM68419999-12-310000000002677

1993009     F459270019930090000002024-10-318271A2024-10-31605BM68419999-12-310000000003173

1993028     F459270019930280000002024-10-318271A2024-10-31605BM68419999-12-310000000002054
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