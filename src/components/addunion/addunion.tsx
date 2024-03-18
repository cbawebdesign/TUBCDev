import React, { useState, FormEvent } from 'react';

export default function AddUnionPage() {
  const [unionName, setUnionName] = useState('');
  const [unionCode, setUnionCode] = useState('');
  const [subCode, setSubCode] = useState('');
  const [successMessage, setSuccessMessage] = useState(''); // State for success message

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();

    const response = await fetch('/api/createunion/createunion', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        unionName,
        unionCode,
        subCode,
      }),
    });

    if (response.ok) {
      const data = await response.json();
      console.log('Union created successfully:', data);
      setSuccessMessage('Union created successfully!'); // Set success message
    } else {
      console.error('Error creating union:', await response.text());
    }
  };

  return (
    <div style={{ margin: '0 auto', width: '50%', position: 'relative', top: '50px' }}>
      <h1 style={{ textAlign: 'center', marginBottom: '20px', fontSize: '1.5em', fontWeight: 'bold', textDecoration: 'underline' }}>Create New Union</h1>
      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'row', gap: '20px', justifyContent: 'center', alignItems: 'flex-end' }}>
        <label>
          Union Name:
          <input type="text" value={unionName} onChange={(e) => setUnionName(e.target.value)} required style={{ border: '1px solid #FF00FF', color: 'black' }} />
        </label>
        <label>
          Union Code:
          <input type="text" value={unionCode} onChange={(e) => setUnionCode(e.target.value)} required style={{ border: '1px solid #FF00FF', color: 'black' }} />
        </label>
        <label>
          Sub Code:
          <input type="text" value={subCode} onChange={(e) => setSubCode(e.target.value)} required style={{ border: '1px solid #FF00FF', color: 'black' }} />
        </label>
        <button type="submit" style={{ backgroundColor: '#FF00FF', color: 'white', padding: '10px', borderRadius: '5px', border: 'none', cursor: 'pointer', whiteSpace: 'nowrap' }}>Create Union</button>
      </form>
      {successMessage && <p style={{ color: 'green', marginTop: '20px', marginBottom: '20px' }}>{successMessage}</p>} {/* Display success message if it exists */}
    </div>
  );
}