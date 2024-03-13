import React, { useState, FormEvent } from 'react';
import Link from 'next/link';

export default function AddUserPage() {
  const [uid, setUid] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [successMessage, setSuccessMessage] = useState(''); // State for success message

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();

    const response = await fetch('/api/createuser/createuser', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        uid,
        FirstName: firstName,
        LastName: lastName,
      }),
    });

    if (response.ok) {
      const data = await response.json();
      console.log('User created successfully:', data);
      setSuccessMessage('User created successfully!'); // Set success message
    } else {
      console.error('Error creating user:', await response.text());
    }
  };

  return (
    <div style={{ margin: '0 auto', width: '50%', position: 'relative', top: '50px' }}>
      <h1 style={{ textAlign: 'center', marginBottom: '20px', fontSize: '1.5em', fontWeight: 'bold', textDecoration: 'underline' }}>Create New User</h1>
      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'row', gap: '20px', justifyContent: 'center', alignItems: 'flex-end' }}>
        <label>
          UID:
          <input type="text" value={uid} onChange={(e) => setUid(e.target.value)} required style={{ border: '1px solid #FF00FF', color: 'black' }} />
        </label>
        <label>
          First Name:
          <input type="text" value={firstName} onChange={(e) => setFirstName(e.target.value)} required style={{ border: '1px solid #FF00FF', color: 'black' }} />
        </label>
        <label>
          Last Name:
          <input type="text" value={lastName} onChange={(e) => setLastName(e.target.value)} required style={{ border: '1px solid #FF00FF', color: 'black' }} />
        </label>
        <button type="submit" style={{ backgroundColor: '#FF00FF', color: 'white', padding: '10px', borderRadius: '5px', border: 'none', cursor: 'pointer', whiteSpace: 'nowrap' }}>Create User</button>
      </form>
      {successMessage && <p style={{ color: 'green', marginTop: '20px', marginBottom: '20px' }}>{successMessage}</p>} {/* Display success message if it exists */}
      {successMessage && uid && <Link href={`/admin/users/${uid}`}><a style={{ backgroundColor: '#FF00FF', color: 'white', padding: '10px', borderRadius: '5px', border: 'none', cursor: 'pointer', whiteSpace: 'nowrap', textDecoration: 'none' }}>Edit User</a></Link>} {/* Display "edit user" link if user is created successfully */}
    </div>
  );
}