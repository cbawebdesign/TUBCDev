import { Line, ResponsiveContainer, LineChart, XAxis } from 'recharts';

import Tile from '~/core/ui/Tile';
import Heading from '~/core/ui/Heading';
import React, { useState, useMemo } from 'react';
pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.min.js`;
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '~/core/ui/Table';

import { useUserSession } from '~/core/hooks/use-user-session';
import { Title } from '@radix-ui/react-dialog';
import { Document, Page, pdfjs } from 'react-pdf';

export default function DashboardDemo() {
  const mrr = useMemo(() => generateDemoData(), []);
  const visitors = useMemo(() => generateDemoData(), []);
  const returningVisitors = useMemo(() => generateDemoData(), []);
  const churn = useMemo(() => generateDemoData(), []);
  const netRevenue = useMemo(() => generateDemoData(), []);
  const fees = useMemo(() => generateDemoData(), []);
  const newCustomers = useMemo(() => generateDemoData(), []);
  const tickets = useMemo(() => generateDemoData(), []);
  const activeUsers = useMemo(() => generateDemoData(), []);
  const [numPages, setNumPages] = useState<number | null>(null);
    const [pageNumber, setPageNumber] = useState(1);



  function onDocumentLoadSuccess({ numPages }: { numPages: number }) {
    setNumPages(numPages);
  }
  return (
    <div className={'flex flex-col pb-36'}>
      <UserGreetings />
  
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        <h1 style={{ 
          fontSize: '2em', 
          textAlign: 'center', 
          textDecoration: 'underline', 
          fontFamily: 'Arial, sans-serif' 
        }}>
          Tristate Union Benefits Admin Systems Overview & User Guide
        </h1>
        <div style={{ height: '70vh', overflow: 'auto' }}>
          <Document
            file="/assets/images/tr.pdf"
            onLoadSuccess={onDocumentLoadSuccess}
          >
            <Page pageNumber={pageNumber} renderTextLayer={false} />
          </Document>
        </div>
        <p>Page {pageNumber} of {numPages ?? 'unknown'}</p>
        <div>
          <button 
            style={{
              backgroundColor: '#000033', 
              color: 'white', 
              borderRadius: '5px', 
              boxShadow: '3px 3px 5px 0px rgba(0,0,0,0.75)', 
              padding: '10px 20px', 
              margin: '10px', 
              border: 'none'
            }}
            onClick={() => setPageNumber(pageNumber - 1)} 
            disabled={pageNumber <= 1}
          >
            Previous
          </button>
          <button 
            style={{
              backgroundColor: '#000033', 
              color: 'white', 
              borderRadius: '5px', 
              boxShadow: '3px 3px 5px 0px rgba(0,0,0,0.75)', 
              padding: '10px 20px', 
              margin: '10px', 
              border: 'none'
            }}
            onClick={() => setPageNumber(pageNumber + 1)} 
            disabled={pageNumber >= (numPages ?? 1)}
          >
            Next
          </button>
        </div>
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
        <span>Here&apos;s what is happening across your business</span>
      </p>
    </div>
  );
}

function generateDemoData() {
  const today = new Date();

  const formatter = new Intl.DateTimeFormat('en-us', {
    month: 'long',
    year: '2-digit',
  });

  const data: { value: string; name: string }[] = [];

  for (let n = 8; n > 0; n -= 1) {
    const date = new Date(today.getFullYear(), today.getMonth() - n, 1);

    data.push({
      name: formatter.format(date) as string,
      value: (Math.random() * 10).toFixed(1),
    });
  }

  return [data, data[data.length - 1].value] as [typeof data, string];
}

function Chart(
  props: React.PropsWithChildren<{ data: { value: string; name: string }[] }>,
) {
  return (
    <div className={'h-36'}>
      <ResponsiveContainer width={'100%'} height={'100%'}>
        <LineChart data={props.data}>
          <Line
            className={'text-primary'}
            type="monotone"
            dataKey="value"
            stroke="currentColor"
            strokeWidth={2.5}
            dot={false}
          />

          <XAxis
            style={{ fontSize: 9 }}
            axisLine={false}
            tickSize={0}
            dataKey="name"
            height={15}
            dy={10}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>

    
  );
}

function CustomersTable() {
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Placeholder</TableHead>
          <TableHead>Placeholder</TableHead>
          <TableHead>Placeholder</TableHead>
          <TableHead>Placeholder</TableHead>
          <TableHead>Placeholder</TableHead>
        </TableRow>
      </TableHeader>

      <TableBody>
        <TableRow>
          <TableCell>Placeholder</TableCell>
          <TableCell>Placeholder</TableCell>
          <TableCell>Placeholder</TableCell>
          <TableCell>Placeholder</TableCell>
          <TableCell>
            <Tile.Badge trend={'up'}>Placeholder</Tile.Badge>
          </TableCell>
        </TableRow>

        <TableRow>
          <TableCell>Placeholder</TableCell>
          <TableCell>Placeholder</TableCell>
          <TableCell>Placeholder</TableCell>
          <TableCell>Placeholder</TableCell>
          <TableCell>
            <Tile.Badge trend={'stale'}>Placeholder</Tile.Badge>
          </TableCell>
        </TableRow>

        <TableRow>
          <TableCell>Placeholder</TableCell>
          <TableCell>Placeholder</TableCell>
          <TableCell>Placeholder</TableCell>
          <TableCell></TableCell>
          <TableCell>
            <Tile.Badge trend={'up'}>Placeholder</Tile.Badge>
          </TableCell>
        </TableRow>

        <TableRow>
          <TableCell>Placeholder</TableCell>
          <TableCell>Placeholder</TableCell>
          <TableCell>Placeholder</TableCell>
          <TableCell>Placeholder</TableCell>
          <TableCell>
            <Tile.Badge trend={'down'}>Placeholder</Tile.Badge>
          </TableCell>
        </TableRow>
      </TableBody>
    </Table>

    
  );
}
