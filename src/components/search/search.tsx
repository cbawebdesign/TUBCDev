import React, { useState, useEffect } from 'react';
import Link from 'next/link';

// Assume these imports exist in your project structure
import Tile from '~/core/ui/Tile';
import Heading from '~/core/ui/Heading';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '~/core/ui/Table';
import { useUserSession } from '~/core/hooks/use-user-session';
import styles from './search.module.css'; // Make sure to create this CSS module file

interface User {
  reference: any;
  id: string;
  name: string;
  email: string;
  union:string;
}

export default function SearchPage() {
  const [query, setQuery] = useState('');
  const [activeFilter, setActiveFilter] = useState('');
  const [unionFilter, setUnionFilter] = useState('');
  const [searchResults, setSearchResults] = useState<User[]>([]);

  useEffect(() => {
    const executeSearch = async () => {
      const requestBody = { query, active: activeFilter, union: unionFilter };
      console.log("Search Request Body:", requestBody); // Logging for verification

      try {
        const response = await fetch('/api/search/search', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(requestBody),
        });

        if (response.ok) {
          const users = await response.json();
          setSearchResults(users);
        } else {
          console.error('Search failed');
        }
      } catch (error) {
        console.error('An error occurred during the search:', error);
      }
    };

    executeSearch();
  }, [query, activeFilter, unionFilter]);

  // Define styles for the form container
  const formContainerStyles: React.CSSProperties = {
    display: 'flex',
    flexDirection: 'column', // Fix TypeScript error by specifying the type
    alignItems: 'center',
    gap: '16px',
  };

  return (
    <div className={'flex flex-col space-y-6 pb-36'}>
      <UserGreetings />

      <form onSubmit={(e) => e.preventDefault()} style={formContainerStyles}>
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search users by name..."
          className={styles.inputField}
        />

        <select
          value={activeFilter}
          onChange={(e) => setActiveFilter(e.target.value)}
          className={styles.inputField}
        >
          <option value="">Select Active Status</option>
          <option value="true">Active</option>
          <option value="false">Inactive</option>
        </select>

        <select
          value={unionFilter}
          onChange={(e) => setUnionFilter(e.target.value)}
          className={styles.inputField}
        >
          <option value="">Select Union</option>
          <option value="coba">COBA</option>
          <option value="L831">L831</option>
        </select>
      </form>

      <div className={styles.tableContainer}>
  <Table className={styles.table}>
    <TableHead>
      <TableRow>
        <TableHeader>Name</TableHeader>
        <TableHeader>Email</TableHeader>
        <TableHeader>ID</TableHeader>
        <TableHeader>Union</TableHeader>
        <TableHeader>Reference</TableHeader>
        <TableHeader>Actions</TableHeader> {/* Added header for actions */}
      </TableRow>
    </TableHead>
    <TableBody>
      {searchResults.map((user) => (
        <TableRow key={user.id}>
          <TableCell>{user.name}</TableCell>
          <TableCell>{user.email}</TableCell>
          <TableCell>{user.id}</TableCell>
          <TableCell>{user.union}</TableCell>
          <TableCell>{user.reference}</TableCell>
          <TableCell>
            <Link href={`/admin/users/${user.id}`}>View user</Link>
          </TableCell>
        </TableRow>
      ))}
    </TableBody>
  </Table>
</div>
    </div>
  );
}


function UserGreetings() {
  const user = useUserSession();
  const userDisplayName = user?.auth?.displayName ?? user?.auth?.email ?? '';

  return (
    <div>
      <Heading type={4}>Welcome Back, {userDisplayName}</Heading>
      <p className={'text-gray-500 dark:text-gray-400'}>
        Heres whats happening across your business
      </p>
    </div>
  );
}