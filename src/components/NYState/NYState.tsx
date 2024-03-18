import { useState, useEffect } from 'react';
import { getStorage, ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";
import { initialize, document } from '@ironcorelabs/ironweb';

export default function UploadPage() {
  const [files, setFiles] = useState<FileList | null>(null);
  const [isSdkInitialized, setSdkInitialized] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [uploadedFiles, setUploadedFiles] = useState<{ fileName: string, group: string }[]>([]);
  const [uploadSuccess, setUploadSuccess] = useState(false);
  const [selectedCategories, setSelectedCategories] = useState<string>('');
  const [uploadErrors, setUploadErrors] = useState<string[]>([]);
  const categories = ['MASTER_SHEET','PAYFILE_RAW', 'PAYFILE_EXTRACTED', 'MISMATCHED_PREMIUMS', 'USERS_NOT_IN_DATABASE', 'PREMIUM_HISTORY_ALL', 'PREMIUM_MISMATCHES_ALL', 'DEDUCTION_STATUS_CHANGES', 'MASTER_SHEET_CHANGES'];
  const [hasError, setHasError] = useState(false);
  const [union, setUnion] = useState<string>('');
  const unionOptions = ['COBA', 'L831', 'MISC','MASTER_SHEET'];

  useEffect(() => {
    initialize(
      () => fetch('https://us-central1-test7-8a527.cloudfunctions.net/generateJwt')
        .then(response => response.text()),
      () => Promise.resolve('testpassword'),
    )
    .then(() => setSdkInitialized(true))
    .catch((error: Error) => console.error('Error initializing IronWeb SDK:', error));
  }, []);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setFiles(event.target.files);
  };

  const handleUnionChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setUnion(event.target.value);
  };

  const handleUpload = async () => {
    if (!files || !isSdkInitialized) return;
    if (!selectedCategories) {
      alert('Please select a category before uploading.');
      return;
    }
    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      const storage = getStorage();
      const storageRef = ref(storage, 'groups/' + file.name);

      const uploadTask = uploadBytesResumable(storageRef, file);

      uploadTask.on('state_changed', 
        (snapshot) => {
          var progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
          setUploadProgress(progress);
          console.log('Upload is ' + progress + '% done');
        }, 
        (error) => {
          console.log(error);
        }, 
        async () => {
          const downloadURL = await getDownloadURL(uploadTask.snapshot.ref);
          console.log('File available at', downloadURL);

          const urlUint8Array = new TextEncoder().encode(downloadURL);
          const encryptedUrlResult = await document.encrypt(urlUint8Array);
          const encryptedUrl = btoa(String.fromCharCode(...new Uint8Array(encryptedUrlResult.document)));

          const fileNameUint8Array = new TextEncoder().encode(file.name);
          const encryptedFileNameResult = await document.encrypt(fileNameUint8Array);
          const encryptedFileName = btoa(String.fromCharCode(...new Uint8Array(encryptedFileNameResult.document)));

          const response = await fetch          ('/api/uploads/uploads', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              fileName: encryptedFileName,
              url: encryptedUrl,
              originalFileName: file.name,
              categories: selectedCategories,
              union: union,
            }),
          });

          if (!response.ok) {
            const errorData = await response.json();
            setUploadErrors(prevErrors => [...prevErrors, errorData.error]);
            setHasError(true);
          } else {
            const data = await response.json();
            console.log(data);
            setUploadedFiles(prevFiles => [...prevFiles, { fileName: file.name, group: data.group }]);
            setUploadSuccess(true);
          }
        }
      );
    }
  };

  const handleCategoryChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, checked } = event.target;
    if (checked) {
      setSelectedCategories(name);
    } else {
      setSelectedCategories('');
    }
  };
const buttonStyle = {
    backgroundColor: '#FF00FF', /* Dark Blue */
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
  const uploadedFileStyle = {
    marginTop: '20px', 
    marginBottom: '20px', 
    border: '1px solid #000080', 
    padding: '10px',
    borderRadius: '15px', // This will make the border rounded
    boxShadow: '5px 5px 15px rgba(0, 0, 0, 0.3)', // This will give it a 3D effect
  };
  const categoryStyle = {
    display: 'inline-block',
    margin: '10px',
    padding: '10px',
    borderRadius: '5px',
    backgroundColor: '#f2f2f2',
  };
  const checkboxStyle = {
    backgroundColor: '#ffffff',
  };  return (
    <div style={{ marginTop: '50px' }}>
      <input 
        type="file" 
        multiple 
        onChange={handleFileChange} 
        id="fileInput" 
        style={{ display: 'none' }}
      />
      <label htmlFor="fileInput" style={buttonStyle}>Choose Files</label>
      <button style={buttonStyle} onClick={handleUpload}>Upload</button>
  
      <div>
        {categories.map((category, index) => (
          <div key={index} style={categoryStyle}>
            <input 
              type="checkbox" 
              id={`category-${index}`} 
              name={category} 
              onChange={handleCategoryChange}
              style={buttonStyle}
            />
            <label htmlFor={`category-${index}`} style={{ color: '#000000' }}>{category}</label>
          </div>
        ))}
      </div>

      <div>
        <h3>Union:</h3>
        {unionOptions.map((option, index) => (
          <div key={index}>
            <input 
              type="radio" 
              id={`union-${index}`} 
              name="union" 
              value={option} 
              onChange={handleUnionChange}
            />
            <label htmlFor={`union-${index}`}>{option}</label>
          </div>
        ))}
      </div>

      <div style={{ marginTop: '20px' }}>
        <progress value={uploadProgress} max="100" style={{ width: '50%', height: '20px', borderRadius: '10px', overflow: 'hidden' }} />
      </div>

      {uploadSuccess && <p style={{ color: 'green' }}>Upload successful!</p>}
      {hasError && uploadErrors.map((error, index) => (
        <p key={index} style={{ color: 'red' }}>{error}</p>
      ))}

      <div>
        <h2 style={{ marginTop: '20px' }}>Uploaded files:</h2>
        {uploadedFiles.map((file, index) => (
          <div key={index} style={uploadedFileStyle}>
            <h2 style={{     color: '#FF00FF' 
            }}>
              File: {file.fileName}
            </h2>
            <p>Group: {file.group}</p>
          </div>
        ))}
      </div>
    </div>
  );
}