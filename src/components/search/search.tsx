import React, { useState, useMemo } from 'react';
import { getUsersCollection } from 'src/lib/server/collections';
import Link from 'next/link'; // Import Link from Next.js for navigation

import Tile from '~/core/ui/Tile';
import Heading from '~/core/ui/Heading';

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '~/core/ui/Table';

import { useUserSession } from '~/core/hooks/use-user-session';

interface User {
  id: string;
  name: string;
  email: string;
}

export default function SearchPage() {
  const [query, setQuery] = useState('');
  const [searchResults, setSearchResults] = useState<User[]>([]);

  // Function to handle the search form submission
  const handleSearch = async (event: React.FormEvent) => {
    event.preventDefault();
    try {
      const response = await fetch('/api/search/search', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ query }),
      });
      if (response.ok) {
        const users = await response.json();
        console.log(users);  // Add this line to log the search results
        setSearchResults(users);
      } else {
        console.error('Search failed');
        // Optionally handle the error in the UI
      }
    } catch (error) {
      console.error('An error occurred during the search:', error);
      // Optionally handle the error in the UI
    }
  };
  return (
    <div className={'flex flex-col space-y-6 pb-36'}>
      <UserGreetings />
      <p>IN DEVELOPMENT-DRAFT</p>

      {/* Search Form */}
      <form onSubmit={handleSearch}>
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search users by name..."
        />
        <button type="submit">Search</button>
      </form>

      {/* Display Search Results */}
      <div>
        <Table>
          <TableHead>
            <TableRow>
              <TableHeader>Name</TableHeader>
              <TableHeader>Email</TableHeader>
              <TableHeader>ID</TableHeader>
            </TableRow>
          </TableHead>
          <TableBody>
            {searchResults.map((user) => (
              <TableRow key={user.id}>
                <TableCell>{user.name}</TableCell>
                <TableCell>{user.email}</TableCell>
                <TableCell>
                <Link href={`/admin/users/${user.id}`}>View user</Link>

                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      {/* Rest of the page content with Tiles, Charts, etc. */}
      {/* ... */}
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
        Heres what is happening across your business
      </p>
    </div>
  );
}
