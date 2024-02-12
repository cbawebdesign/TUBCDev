import { Line, ResponsiveContainer, LineChart, XAxis } from 'recharts';
import { useEffect, useMemo, useState } from 'react';

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
import { Title } from '@radix-ui/react-dialog';

export default function NYStatePage() {
  const mrr = useMemo(() => generateDemoData(), []);
  const visitors = useMemo(() => generateDemoData(), []);
  const returningVisitors = useMemo(() => generateDemoData(), []);
  const churn = useMemo(() => generateDemoData(), []);
  const netRevenue = useMemo(() => generateDemoData(), []);
  const fees = useMemo(() => generateDemoData(), []);
  const newCustomers = useMemo(() => generateDemoData(), []);
  const tickets = useMemo(() => generateDemoData(), []);
  const activeUsers = useMemo(() => generateDemoData(), []);
  const [documents, setDocuments] = useState<Document[]>([]);
  
  
  useEffect(() => {
    fetch('/api/datatwo/datatwo')
      .then(response => response.json())
      .then(setDocuments);
  }, []);
  const L831Documents = documents
  .filter(document => document.title.includes('L831'))
  .sort((a, b) => {
    const dateA = new Date(a.title.split(" ").pop() || "");
    const dateB = new Date(b.title.split(" ").pop() || "");
    return dateB.getTime() - dateA.getTime();
  });

const COBADocuments = documents
  .filter(document => document.title.includes('COBA'))
  .sort((a, b) => {
    const dateA = new Date(a.title.split(" ").pop() || "");
    const dateB = new Date(b.title.split(" ").pop() || "");
    return dateB.getTime() - dateA.getTime();
  });
  return (
    <div className={'flex flex-col space-y-6 pb-36'}>
      <UserGreetings />
      <p>ADMIN REPORTS</p>
  
      <div className={'mb-8'}>
        <h2 className={'mb-4'}>L831 Documents</h2>
        <div className={'grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4'}>
          {L831Documents.map((document, index) => (
            <div key={index} className="flex flex-col items-center justify-center w-full max-w-md p-4 bg-white shadow rounded-lg overflow-hidden mx-auto h-64">
              <Tile>
                <div className="text-center font-bold text-sm mb-2">
                  <div className="text-sm">
                    <Tile.Heading>{document.title}</Tile.Heading>
                  </div>
                </div>
  
                <div className="px-6 py-4">
                  <Tile.Body>
                    <a href={document.URL} download>
                      <button className="mt-4 bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
                        Download
                      </button>
                    </a>
                  </Tile.Body>
                </div>
              </Tile>
            </div>
          ))}
        </div>
      </div>
  
      <div className={'mb-8'}>
        <h2 className={'mb-4'}>COBA Documents</h2>
        <div className={'grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4'}>
          {COBADocuments.map((document, index) => (
            <div key={index} className="flex flex-col items-center justify-center w-full max-w-md p-4 bg-white shadow rounded-lg overflow-hidden mx-auto h-64">
              <Tile>
                <div className="text-center font-bold text-sm mb-2">
                  <div className="text-sm">
                    <Tile.Heading>{document.title}</Tile.Heading>
                  </div>
                </div>
  
                <div className="px-6 py-4">
                  <Tile.Body>
                    <a href={document.URL} download>
                      <button className="mt-4 bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
                        Download
                      </button>
                    </a>
                  </Tile.Body>
                </div>
              </Tile>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

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
}
