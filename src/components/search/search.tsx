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
  FirstName: string;
  LastName:string;
    email: string;
  union:string;
  CaseNotes:string;
  CurrentTotalPremium:string;
  Active:boolean;
}

export default function SearchPage() {
  
}
