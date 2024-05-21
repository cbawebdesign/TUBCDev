import React, { useState, useEffect, FormEvent } from 'react';

export default function AddUnionPage() {
  const [unionName, setUnionName] = useState('');
  const [unionCode, setUnionCode] = useState('');
  const [subCode, setSubCode] = useState('');
  const [unions, setUnions] = useState<{ id: string, deductionPlan:string, unionName: string, unionCode: string, subCode: string }[]>([]);
    const [successMessage, setSuccessMessage] = useState(''); // State for success message
    const [deductionPlan, setDeductionPlan] = useState(''); // New state variable

  useEffect(() => {
    fetchUnions();
  }, []);

  const fetchUnions = async () => {
    const response = await fetch('/api/createunion/createunion');
    const data = await response.json();
    setUnions(data);
  };

  const handleDelete = async (id: string) => {
    const response = await fetch('/api/createunion/createunion', {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ id }),
    });

    if (response.ok) {
      setSuccessMessage('Union deleted successfully!'); // Set success message
      fetchUnions(); // Refresh the list of unions
    } else {
      console.error('Error deleting union:', await response.text());
    }
  };

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
        deductionPlan
      }),
    });

    if (response.ok) {
      const data = await response.json();
      console.log('Union created successfully:', data);
      setSuccessMessage('Union created successfully!'); // Set success message
      fetchUnions(); // Refresh the list of unions
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
          Union Pay Roll Code:
          <input type="text" value={unionCode} onChange={(e) => setUnionCode(e.target.value)} required style={{ border: '1px solid #FF00FF', color: 'black' }} />
        </label>
        <label>
          Deduction Code:
          <input type="text" value={subCode} onChange={(e) => setSubCode(e.target.value)} required style={{ border: '1px solid #FF00FF', color: 'black' }} />
        </label>
        <label>
          Deduction Plan:
          <input type="text" value={deductionPlan} onChange={(e) => setDeductionPlan(e.target.value)} required style={{ border: '1px solid #FF00FF', color: 'black' }} />
        </label>
        <button type="submit" style={{ backgroundColor: '#FF00FF', color: 'white', padding: '10px', borderRadius: '5px', border: 'none', cursor: 'pointer', whiteSpace: 'nowrap' }}>Create Union</button>
      </form>
      {successMessage && <p style={{ color: 'green', marginTop: '20px', marginBottom: '20px' }}>{successMessage}</p>} {/* Display success message if it exists */}
      <h2 style={{ textAlign: 'center', marginBottom: '20px', fontSize: '1.5em', fontWeight: 'bold', textDecoration: 'underline' }}>Unions</h2>
      {unions.map(union => (
        <div key={union.id}>
          <h3>{union.unionName}</h3>
          <p>Union Pay Roll Code: {union.unionCode}</p>
          <p>Deduction Code: {union.subCode}</p>
          <p>Deduction Plan: {union.deductionPlan}</p> {/* Display deductionCode */}

          <button onClick={() => handleDelete(union.id)} style={{ backgroundColor: '#FF0000', color: 'white', padding: '10px', borderRadius: '5px', border: 'none', cursor: 'pointer', whiteSpace: 'nowrap' }}>Delete Union</button>
        </div>
      ))}
    </div>
  );
}