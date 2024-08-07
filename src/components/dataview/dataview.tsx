
import { useEffect, useState } from 'react';
import { initialize, document } from '@ironcorelabs/ironweb';
import { getAuth } from "firebase/auth";
import { getFirestore, doc, getDoc, updateDoc } from "firebase/firestore";

import Button from '~/core/ui/Button';
import { Timestamp } from "firebase/firestore";
import { FaCaretDown, FaCaretRight, FaCaretUp } from 'react-icons/fa';
export default function DownloadPage() {
  const [isSdkInitialized, setSdkInitialized] = useState<boolean>(false);
    const [selectedMonths, setSelectedMonths] = useState<number[]>([]);
  const [newData, setNewData] = useState<{ timestamp: Date, id: string, url: string, image: string, subCategory: string | null, category: string, union: string, isRead: boolean }[]>([]);   const [currentCategory, setCurrentCategory] = useState<string | null>(null); // <-- Add this line here
          const [selectedSubCategories, setSelectedSubCategories] = useState<string[]>([]);
          const [currentSubCategory, setCurrentSubCategory] = useState<string | null>(null);
                    const [isL831Visible, setL831Visible] = useState(true);
          const [isCOBAVisible, setCOBAVisible] = useState(true);
          const [isMISCVisible, setMISCVisible] = useState(true);
          const [selectedYears, setSelectedYears] = useState<number[]>([]);
          const [filterReadStatus, setFilterReadStatus] = useState<'all' | 'read' | 'unread'>('all');
          const [scriptStatus, setScriptStatus] = useState<'idle' | 'running' | 'success' | 'error'>('idle');

  useEffect(() => {
    initialize(
      () => fetch('https://us-central1-test7-8a527.cloudfunctions.net/generateJwt')
        .then(response => response.text()),
      () => Promise.resolve('testpassword'),
    )
    .then(() => setSdkInitialized(true))
    .catch((error: Error) => console.error('Error initializing IronWeb SDK:', error));
  }, []);

  useEffect(() => {
    const fetchAndDecryptData = async () => {
      if (!isSdkInitialized || !currentCategory) return;
  
      const auth = getAuth();
      const user = auth.currentUser;
      let userName = null;
  
      if (user) {
        const db = getFirestore();
        const userDoc = await getDoc(doc(db, "users", user.uid));
  
        if (userDoc.exists()) {
          const userData = userDoc.data() as { userName: string };
          userName = userData.userName;
        }
      }
  
      if (!userName) {
        console.error('No user is currently logged in or userName is not set');
        return;
      }
  
      const requestBody = {
        userName: userName,
        categories: currentSubCategory,
      };
      const response = await fetch(`/api/decrypt/decrypt`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestBody),
      });
      const groups = await response.json();
      const newDataArray = [...newData]; // Create a copy of the current state
      for (const group of groups) {
        let decryptedText: string | null = null;
        let decryptedImageText: string | null = null;
      
        if (group.url && group.image) {
          let encryptedDataBytes, encryptedImageBytes;
      
          if (group.isEncrypted === false) {
            // If isEncrypted is explicitly false, use the url and image as is
            decryptedText = group.url;
            decryptedImageText = group.image;
          } else {
            encryptedDataBytes = new Uint8Array(atob(group.url).split("").map((c) => c.charCodeAt(0)));
            encryptedImageBytes = new Uint8Array(atob(group.image).split("").map((c) => c.charCodeAt(0)));
      
            let documentId, imageId;
      
            try {
              documentId = await document.getDocumentIDFromBytes(encryptedDataBytes);
              imageId = await document.getDocumentIDFromBytes(encryptedImageBytes);
            } catch (error) {
              console.error(`Error getting document ID for group ${group.id}:`, error);
              continue;
            }
      
            if (documentId && imageId) {
              const decryptedData = await document.decrypt(documentId, encryptedDataBytes);
              const decryptedImage = await document.decrypt(imageId, encryptedImageBytes);
              decryptedText = new TextDecoder().decode(new Uint8Array(decryptedData.data));
              decryptedImageText = new TextDecoder().decode(new Uint8Array(decryptedImage.data));
            } else if (!documentId) {
              console.error(`Document ID is null for group ${group.id}`);
            } else {
              console.error(`URL or image is missing for group ${group.id}`);
            }
          }
      
          // Convert the Firestore timestamp to a JavaScript Date object
          const timestampObject = group.timestamp;
          const timestampMilliseconds = timestampObject.seconds * 1000 + timestampObject.nanoseconds / 1000000;
          const date = new Date(timestampMilliseconds);
          console.log(`Date for group ${group.id}:`, date);
      
          // Check if the document for the current subcategory is already in the newData state
          if (decryptedText && decryptedImageText && !newData.some(data => data.subCategory === currentSubCategory)) {
            setNewData(prevData => [...prevData, { 
              timestamp: date, 
              id: group.id, 
              url: decryptedText || '', // provide a default value
              image: decryptedImageText || '', // provide a default value
              category: currentCategory, 
              subCategory: currentSubCategory, 
              union: group.union, 
              isRead: group.isRead,
              delete: () => setNewData(prevData => prevData.filter(data => data.id !== group.id)) // Add delete function

            }]);
          }
        
        }
      }
      };
      
      fetchAndDecryptData();
      }, [isSdkInitialized, currentSubCategory]);

      const deletePost = async (id: string) => {
        try {
          const response = await fetch('/api/decrypt/decrypt', {
            method: 'DELETE',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({ id }),
          });
      
          if (!response.ok) {
            throw new Error('Response not OK');
          }
      
          setNewData(prevData => prevData.filter(data => data.id !== id));
        } catch (error) {
          console.error('Error deleting post:', error);
        }
      };
  const filterDataByMonthAndYear = (data: { union: string, id: string, url: string, image: string, subCategory: string | null, category: string, timestamp: Date, isRead: boolean }[]) => {
    if (selectedMonths.length === 0 && selectedYears.length === 0) return data;
    return data.filter(item => selectedMonths.includes(item.timestamp.getMonth()) && selectedYears.includes(item.timestamp.getFullYear()));
  };
// Add this function to generate a list of years
const generateYearList = (startYear: number, endYear: number) => {
  const years = [];
  for (let year = startYear; year <= endYear; year++) {
    years.push(year);
  }
  return years;
};

const triggerScript = () => {
  setScriptStatus('running');
  fetch('/api/phtrigger/phtrigger', {
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

const markDocumentAsRead = async (documentId: string) => {
  if (typeof documentId !== 'string') {
    console.error('documentId is not a string:', documentId);
    return;
  }

  try {
    const db = getFirestore();
    const documentRef = doc(db, 'posts', documentId);
    await updateDoc(documentRef, {
      isRead: true
    });
  } catch (error) {
    console.error('Error in markDocumentAsRead:', error);
  }
};

const toggleDocumentReadStatus = async (documentId: string): Promise<boolean> => {
  if (typeof documentId !== 'string') {
    console.error('documentId is not a string:', documentId);
    return false;
  }

  try {
    const db = getFirestore();
    const documentRef = doc(db, 'posts', documentId);
    const docSnap = await getDoc(documentRef);

    if (!docSnap.exists()) {
      console.error(`No document found with ID ${documentId}`);
      return false;
    }

    const isRead = docSnap.data().isRead;
    await updateDoc(documentRef, {
      isRead: !isRead
    });

    console.log(`Document ${documentId} read status toggled to ${!isRead}`);
    return true;
  } catch (error) {
    console.error('Error toggling document read status:', error);
    return false;
  }
};
const yearList = generateYearList(2024, 2035);

  const mainCategories = ['PAYFILE_RAW', 'PAYFILE_EXTRACTED', 'MISMATCHED_PREMIUMS', 'USERS_NOT_IN_DATABASE', 'ACTIVE_USERS_MISSING', 'DEDUCTION_STATUS_CHANGES', 'PREMIUM_MISMATCHES_ALL', 'MASTER_SHEET_CHANGES', 'PREMIUM_HISTORY_ALL','SENT_NY_FILES','ERROR_FILES','MSErrors','PAST_PAY_FILES'];
  const subCategories = {
    'PAYFILE_RAW': 'PAYFILE_RAW',
    'PAYFILE_EXTRACTED': 'PAYFILE_EXTRACTED',
    'MISMATCHED_PREMIUMS': 'MISMATCHED_PREMIUMS',
    'USERS_NOT_IN_DATABASE': 'USERS_NOT_IN_DATABASE',
    'ACTIVE_USERS_MISSING': 'ACTIVE_USERS_MISSING',
    'PREMIUM_MISMATCHES_ALL': 'PREMIUM_MISMATCHES_ALL',
    'PREMIUM_HISTORY_ALL': 'PREMIUM_HISTORY_ALL',
    'DEDUCTION_STATUS_CHANGES': 'DEDUCTION_STATUS_CHANGES',
    'MASTER_SHEET_CHANGES': 'MASTER_SHEET_CHANGES',
    'SENT_NY_FILES': 'SENT_NY_FILES',
    'ERROR_FILES': 'ERROR_FILES',
    'MSErrors': 'MSErrors',
    'PAST_PAY_FILES': 'PastPayFile',
  };
   const buttonStyle = {
    backgroundColor: '#FF00FF', /* Fuchsia */
    border: 'none',
    color: 'white',
    padding: '15px 32px',
    textAlign: 'center' as 'center',
    textDecoration: 'none',
    display: 'inline-block',
    fontSize: '16px',
    margin: '4px 2px',
    cursor: 'pointer',
    borderRadius: '12px', // This will make the edges rounded
    boxShadow: '0px 8px 15px rgba(0, 0, 0, 0.1)', // This will add a shadow
  };
  const boxStyle = {
    marginTop: '20px', 
    marginBottom: '20px', 
    border: '1px solid #FF00FF', 
    padding: '10px',
    borderRadius: '15px', // This will make the border rounded
    boxShadow: '5px 5px 15px rgba(0, 0, 0, 0.3)', // This will give it a 3D effect
  };
  const sectionStyle = {
    border: '1px solid #FF00FF',
    borderRadius: '10px',
    padding: '10px',
    margin: '20px 0',
    boxShadow: '5px 5px 15px rgba(0, 0, 0, 0.3)', // This will give it a 3D effect
  };
  return (
<div>
<h1 style={{ textAlign: 'center', marginTop: '20px', marginBottom: '20px', fontSize: '20px', fontWeight: 'bold', textDecoration: 'underline' }}>TUBC Document Hub</h1>
    <div style={{ display: 'flex', flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'center', marginBottom: '20px' }}>
      {mainCategories.map(category => (
        <button style={buttonStyle} onClick={() => {
          setCurrentCategory(category);
          const subCategory = subCategories[category as keyof typeof subCategories];
          setCurrentSubCategory(subCategory);
        }}>{category}</button>
      ))}
    </div>
<div style={{ display: 'flex', flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'center' }}>
  {yearList.map(year => (
    <label style={{ ...buttonStyle, fontSize: '1.1em', backgroundColor: '#008080', padding: '10px', borderRadius: '5px' }}>
      <input
        type="checkbox"
        checked={selectedYears.includes(year)}
        onChange={() => {
          if (selectedYears.includes(year)) {
            setSelectedYears(selectedYears.filter(y => y !== year));
          } else {
            setSelectedYears([...selectedYears, year]);
          }
        }}
      />
      {year}
    </label>
  ))}
</div>
    <div style={{ display: 'flex', flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'center' }}>
    {Array.from({ length: 12 }, (_, i) => i).map(month => (
      <label style={{ ...buttonStyle, fontSize: '1.1em', backgroundColor: '#008080', padding: '10px', borderRadius: '5px' }}>
        <input
          type="checkbox"
          checked={selectedMonths.includes(month)}
          onChange={() => {
            if (selectedMonths.includes(month)) {
              setSelectedMonths(selectedMonths.filter(m => m !== month));
            } else {
              setSelectedMonths([...selectedMonths, month]);
            }
          }}
        />
        {new Date(0, month).toLocaleString('default', { month: 'long' })}
      </label>
    ))}
    </div>

<button style={buttonStyle} onClick={() => setSelectedMonths([])}>
  Clear selected months
</button>
      {currentCategory && (
  <div style={{ display: 'flex', flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'center', marginTop: '20px' }}>
    <label style={buttonStyle}>
      <input
        type="checkbox"
        checked={selectedSubCategories.includes(subCategories[currentCategory as keyof typeof subCategories])}
        onChange={() => {
          const subCategory = subCategories[currentCategory as keyof typeof subCategories];
          console.log('Subcategory clicked:', subCategory);
          if (selectedSubCategories.includes(subCategory)) {
            setSelectedSubCategories(selectedSubCategories.filter(sc => sc !== subCategory));
          } else {
            setSelectedSubCategories([...selectedSubCategories, subCategory]);
          }
        }}
      />
      {subCategories[currentCategory as keyof typeof subCategories]}
    </label>
  </div>
)}
 {selectedSubCategories.length > 0 && (
  <div style={{ display: 'flex', flexDirection: 'row', flexWrap: 'wrap', alignItems: 'center', marginTop: '20px', padding: '10px' }}>
    <h2 style={{ marginRight: '10px' }}>Selected Subcategories:</h2>
    {selectedSubCategories.map(subCategory => (
      <label style={{ ...buttonStyle, textAlign: 'left' as 'left', display: 'flex', alignItems: 'center', marginBottom: '10px', marginRight: '10px' }}>
        <input
          type="checkbox"
          checked={selectedSubCategories.includes(subCategory)}
          onChange={() => {
            console.log('Subcategory clicked:', subCategory);
            if (selectedSubCategories.includes(subCategory)) {
              setSelectedSubCategories(selectedSubCategories.filter(sc => sc !== subCategory));
            } else {
              setSelectedSubCategories([...selectedSubCategories, subCategory]);
            }
          }}
        />
        {subCategory}
      </label>
    ))}
  </div>
)}
  <div>
  <div style={{ display: 'flex', justifyContent: 'center', margin: '10px' }}>
  <button style={buttonStyle} onClick={() => setFilterReadStatus('all')}>Show All</button>
  <button style={buttonStyle} onClick={() => setFilterReadStatus('read')}>Show Read</button>
  <button style={buttonStyle} onClick={() => setFilterReadStatus('unread')}>Show Unread</button>
</div>
<div>
 <button 
 onClick={triggerScript} 
 style={{ 
   backgroundColor: scriptStatus === 'running' ? 'gray' : '#4CAF50', 
   color: 'white', 
   border: 'none', 
   borderRadius: '4px', 
   padding: '10px 20px', 
   fontSize: '16px', 
   margin: '0 0 20px 0' 
 }} 
 disabled={scriptStatus === 'running' || scriptStatus === 'success' || scriptStatus === 'error'}
>
 Pull New Premium History + Mismatches
</button>
{scriptStatus === 'running' && <p>Function is scheduled to run...</p>}
{scriptStatus === 'success' && <p>Updates pulled successfully, please toggle on the Premium_History_All+ Premium_Mismatches_All categories.</p>}
{scriptStatus === 'error' && <p>Updates pulled successfully, please wait 1-2 minutes to toggle on the Premium_History_All+ Premium_Mismatches_All categories.</p>}
</div>



  <div style={{ display: 'inline-block', borderBottom: '2px solid black', paddingBottom: '5px' }}>
  <h2 style={{ marginTop: '20px', fontSize: '25px', fontWeight: 'bold' }}>Document Queue:</h2>
</div>    <div style={{...sectionStyle, border: '1px solid #FF00FF', padding: '10px', margin: '10px'}}>     

<h2 style={{ fontFamily: 'Arial, sans-serif' }}>
  L831 
  <button 
    onClick={() => setL831Visible(!isL831Visible)}
    style={{ margin: '10px', transition: 'background-color 0.3s ease', display: 'flex', alignItems: 'center' }}
  >
    Toggle {isL831Visible ? <FaCaretUp /> : <FaCaretRight />}
  </button>
</h2>
{isL831Visible && (
  <div>
    {selectedSubCategories.map(subCategory => {
      let filteredData = newData.filter(data => 
        data.subCategory === subCategory && 
        data.union.includes('L831') &&
        (filterReadStatus === 'all' || (filterReadStatus === 'read' && data.isRead) || (filterReadStatus === 'unread' && !data.isRead))
      );
      filteredData = filterDataByMonthAndYear(filteredData);
      filteredData.sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime());

      if (filteredData.length === 0) {
        return <p key={subCategory}>No data available for {subCategory}</p>
      }
      return filteredData.map((data, index) => {
        const date = data.timestamp.getDate();
        const month = data.timestamp.getMonth() + 1; // getMonth() returns a zero-based value (where zero indicates the first month)
        const year = data.timestamp.getFullYear();
        const hours = data.timestamp.getHours();
        const minutes = data.timestamp.getMinutes();
    
        return (
          <div key={index} style={{ ...boxStyle, backgroundColor: data.isRead ? 'teal' : 'grey' }}>
            <h2 style={{ color: '#FF00FF' }}>SubCategory: {data.subCategory}</h2>
            <p>Decrypted title: {data.image}</p>
            <p>Date & Time: {month}/{date}/{year} {hours}:{minutes < 10 ? `0${minutes}` : minutes}</p>

            <a href={data.url} download target="_blank">
              <button style={buttonStyle}>Download</button>
            </a>
            <button style={buttonStyle} onClick={async () => {
              const success = await toggleDocumentReadStatus(data.id);
              if (success) {
                // If the operation was successful, update the isRead status in the state
                setNewData(prevData => prevData.map(d => d.id === data.id ? { ...d, isRead: !d.isRead } : d));
              }
            }}>
              {data.isRead ? 'Mark as Unread' : 'Mark as Read'}
            </button>
            <button style={{...buttonStyle, backgroundColor: 'red'}} onClick={() => {
              if (window.confirm('Are you sure you want to delete this post?')) {
                deletePost(data.id);
              }
            }}>Delete</button>
          </div>
        );
      });
    })}
  </div>
)}
</div>

    <div style={{...sectionStyle, border: '1px solid #FF00FF', padding: '10px', margin: '10px'}}>
  <h2 style={{ fontFamily: 'Arial, sans-serif' }}>
    COBA 
    <button 
      onClick={() => setCOBAVisible(!isCOBAVisible)}
      style={{ margin: '10px', transition: 'background-color 0.3s ease', display: 'flex', alignItems: 'center' }}
    >
      Toggle {isCOBAVisible ? <FaCaretUp /> : <FaCaretRight />}
    </button>
  </h2>
  {isCOBAVisible && (
    <div>
      {selectedSubCategories.map(subCategory => {
        let filteredData = newData.filter(data => 
          data.subCategory === subCategory && 
          data.union.includes('COBA') &&
          (filterReadStatus === 'all' || (filterReadStatus === 'read' && data.isRead) || (filterReadStatus === 'unread' && !data.isRead))
        );
        filteredData = filterDataByMonthAndYear(filteredData);
        filteredData.sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime());


        if (filteredData.length === 0) {
          return <p key={subCategory}>No data available for {subCategory}</p>
        }
      return filteredData.map((data, index) => {
  const date = data.timestamp.getDate();
  const month = data.timestamp.getMonth() + 1; // getMonth() returns a zero-based value (where zero indicates the first month)
  const year = data.timestamp.getFullYear();
  const hours = data.timestamp.getHours();
  const minutes = data.timestamp.getMinutes();

  return (
    <div key={index} style={{ ...boxStyle, backgroundColor: data.isRead ? 'teal' : 'grey' }}>
      <h2 style={{ color: '#FF00FF' }}>SubCategory: {data.subCategory}</h2>
      <p>Decrypted title: {data.image}</p>
      <p>Date & Time: {month}/{date}/{year} {hours}:{minutes < 10 ? `0${minutes}` : minutes}</p>
      <a href={data.url} download target="_blank">
        <button style={buttonStyle}>Download</button>
      </a>
      <button style={buttonStyle} onClick={async () => {
        const success = await toggleDocumentReadStatus(data.id);
        if (success) {
          // If the operation was successful, update the isRead status in the state
          setNewData(prevData => prevData.map(d => d.id === data.id ? { ...d, isRead: !d.isRead } : d));
        }
      }}>
        {data.isRead ? 'Mark as Unread' : 'Mark as Read'}
      </button>
      <button style={{...buttonStyle, backgroundColor: 'red'}} onClick={() => {
        if (window.confirm('Are you sure you want to delete this post?')) {
          deletePost(data.id);
        }
      }}>Delete</button>
       </div>
        );
      });
    })}
  </div>
)}
</div>
<div style={{...sectionStyle, border: '1px solid #FF00FF', padding: '10px', margin: '10px'}}>
<h2 style={{ fontFamily: 'Arial, sans-serif' }}>
  MISC 
  <button 
    onClick={() => setMISCVisible(!isMISCVisible)}
    style={{ margin: '10px', transition: 'background-color 0.3s ease', display: 'flex', alignItems: 'center' }}
  >
    Toggle {isMISCVisible ? <FaCaretUp /> : <FaCaretRight />}
  </button>
</h2>
{isMISCVisible && (
  <div>
    {selectedSubCategories.map(subCategory => {
      let filteredData = newData.filter(data => 
        data.subCategory === subCategory && 
        data.union.includes('MISC') &&
        (filterReadStatus === 'all' || (filterReadStatus === 'read' && data.isRead) || (filterReadStatus === 'unread' && !data.isRead))
      );
      filteredData = filterDataByMonthAndYear(filteredData);
      filteredData.sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime());


      if (filteredData.length === 0) {
        return <p key={subCategory}>No data available for {subCategory}</p>
      }
      return filteredData.map((data, index) => {
        const date = data.timestamp.getDate();
        const month = data.timestamp.getMonth() + 1; // getMonth() returns a zero-based value (where zero indicates the first month)
        const year = data.timestamp.getFullYear();
        const hours = data.timestamp.getHours();
        const minutes = data.timestamp.getMinutes();
      
        return (
          <div key={index} style={{ ...boxStyle, backgroundColor: data.isRead ? 'teal' : 'grey' }}>
            <h2 style={{ color: '#FF00FF' }}>SubCategory: {data.subCategory}</h2>
            <p>Decrypted title: {data.image}</p>
            <p>Date & Time: {month}/{date}/{year} {hours}:{minutes < 10 ? `0${minutes}` : minutes}</p>
            <a href={data.url} download target="_blank">
              <button style={buttonStyle}>Download</button>
            </a>
            <button style={buttonStyle} onClick={async () => {
              const success = await toggleDocumentReadStatus(data.id);
              if (success) {
                // If the operation was successful, update the isRead status in the state
                setNewData(prevData => prevData.map(d => d.id === data.id ? { ...d, isRead: !d.isRead } : d));
              }
            }}>
              {data.isRead ? 'Mark as Unread' : 'Mark as Read'}
            </button>
            <button style={{...buttonStyle, backgroundColor: 'red'}} onClick={() => {
              if (window.confirm('Are you sure you want to delete this post?')) {
                deletePost(data.id);
              }
            }}>Delete</button>
            </div>
        );
      });
    })}
  </div>
)}
</div>
</div>
</div>
);
}