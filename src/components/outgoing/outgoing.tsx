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

0357501     F459270003575010000002024-11-288271C2024-11-28605BM68412024-11-270000000000000

0455340     F459270004553400000002024-11-288271C2024-11-28605BM68412024-11-270000000000000

0516214     F459270005162140000002024-11-280721C2024-11-28605BM70442024-11-271000000000000

0569571     F459270005695710000002024-11-288271C2024-11-28605BM68419999-12-310000000000900

0583562     F459270005835620000002024-11-288271C2024-11-28605BM68412024-11-270000000000000

0584320     F459270005843200000002024-11-288271C2024-11-28605BM68412024-11-270000000000000

0584483     F459270005844830000002024-11-288271C2024-11-28605BM68412024-11-270000000000000

0586188     F459270005861880000002024-11-288271C2024-11-28605BM68412024-11-270000000000000

0586294     F459270005862940000002024-11-288271C2024-11-28605BM68412024-11-270000000000000

0593918     F459270005939180000002024-11-288271C2024-11-28605BM68412024-11-270000000000000

0594106     F459270005941060000002024-11-288271C2024-11-28605BM68412024-11-270000000000000

0705193     F459270007051930000002024-11-280721C2024-11-28605BM70449999-12-311000000012879

0765104     F459270007651040000002024-11-288271C2024-11-28605BM68419999-12-310000000002089

0955308     F459270009553080000002024-11-288271C2024-11-28605BM68419999-12-310000000002665

1001009     F459270010010090000002024-11-288271C2024-11-28605BM68412024-11-270000000000000

1060391     F459270010603910000002024-11-288271C2024-11-28605BM68419999-12-310000000019016

1126042     F459270011260420000002024-11-288271C2024-11-28605BM68419999-12-310000000001800

1423270     F459270014232700000002024-11-288271C2024-11-28605BM68419999-12-310000000001750

1501656     F459270015016560000002024-11-288271C2024-11-28605BM68419999-12-310000000001200

1522073     F459270015220730000002024-11-288271A2024-11-28605BM68419999-12-310000000001633

1560514     F459270015605140000002024-11-288271C2024-11-28605BM68412024-11-270000000000000

1601628     F459270016016280000002024-11-288271A2024-11-28605BM68419999-12-310000000001962

1631911     F459270016319110000002024-11-288271C2024-11-28605BM68419999-12-310000000002839

1678214     F459270016782140000002024-11-288271C2024-11-28605BM68419999-12-310000000000923

1707262     F459270017072620000002024-11-288271C2024-11-28605BM68412024-11-270000000000000

1730308     F459270017303080000002024-11-288271C2024-11-28605BM68419999-12-310000000005842

1752674     F459270017526740000002024-11-288271A2024-11-28605BM68419999-12-310000000001385

1842096     F459270018420960000002024-11-288271C2024-11-28605BM68419999-12-310000000001212

1842251     F459270018422510000002024-11-288271C2024-11-28605BM68419999-12-310000000002262

1843071     F459270018430710000002024-11-288271C2024-11-28605BM68419999-12-310000000002677

1845255     F459270018452550000002024-11-288271C2024-11-28605BM68419999-12-310000000001033

1847290     F459270018472900000002024-11-288271C2024-11-28605BM68419999-12-310000000001385

1850354     F459270018503540000002024-11-288271C2024-11-28605BM68419999-12-310000000001293

1854754     F459270018547540000002024-11-288271C2024-11-28605BM68412024-11-270000000000000

1860489     F459270018604890000002024-11-288271C2024-11-28605BM68419999-12-310000000001731

1866810     F459270018668100000002024-11-288271C2024-11-28605BM68419999-12-310000000002200

1894553     F459270018945530000002024-11-288271C2024-11-28605BM68419999-12-310000000001962

1898802     F459270018988020000002024-11-288271C2024-11-28605BM68412024-11-270000000000000

1899104     F459270018991040000002024-11-288271C2024-11-28605BM68419999-12-310000000003854

1903681     F459270019036810000002024-11-288271A2024-11-28605BM68419999-12-310000000000831

1933607     F459270019336070000002024-11-288271C2024-11-28605BM68412024-11-270000000000000

1933733     F459270019337330000002024-11-288271C2024-11-28605BM68412024-11-270000000000000

1942582     F459270019425820000002024-11-288271C2024-11-28605BM68412024-11-270000000000000

2000004     F459270020000040000002024-11-288271A2024-11-28605BM68419999-12-310000000001633

2000007     F459270020000070000002024-11-288271A2024-11-28605BM68419999-12-310000000001027

2000020     F459270020000200000002024-11-288271A2024-11-28605BM68419999-12-310000000003785

2000043     F459270020000430000002024-11-288271A2024-11-28605BM68419999-12-310000000000831

2000051     F459270020000510000002024-11-288271A2024-11-28605BM68419999-12-310000000001569

2000079     F459270020000790000002024-11-288271A2024-11-28605BM68419999-12-310000000003785

2000095     F459270020000950000002024-11-288271A2024-11-28605BM68419999-12-310000000001523

2000099     F459270020000990000002024-11-288271A2024-11-28605BM68419999-12-310000000002054

2000114     F459270020001140000002024-11-288271A2024-11-28605BM68419999-12-310000000001892

2000145     F459270020001450000002024-11-288271A2024-11-28605BM68419999-12-310000000001027

2000165     F459270020001650000002024-11-288271A2024-11-28605BM68419999-12-310000000000819

2000175     F459270020001750000002024-11-288271A2024-11-28605BM68419999-12-310000000001466

2000195     F459270020001950000002024-11-288271A2024-11-28605BM68419999-12-310000000001484

2000216     F459270020002160000002024-11-288271A2024-11-28605BM68419999-12-310000000001639

2000239     F459270020002390000002024-11-288271A2024-11-28605BM68419999-12-310000000001217

2000295     F459270020002950000002024-11-288271A2024-11-28605BM68419999-12-310000000001252





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