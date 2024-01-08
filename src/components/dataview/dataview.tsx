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

export default function DataviewPage() {
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
    fetch('/api/data/data')
      .then(response => response.json())
      .then(setDocuments);
  }, []);

  return (
    <div className={'flex flex-col space-y-6 pb-36'}>
      <UserGreetings />
      <p>ADMIN REPORTS</p>
  
      <div
        className={
          'grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3' +
          ' xl:grid-cols-4'
        }
      >
        {documents.map((document, index) => (
          <div key={index}>
            <Tile>
              <Tile.Heading>{document.title}</Tile.Heading>
  
              <Tile.Body>
                <a href={document.URL} download>
                  <button className="px-4 py-2 bg-blue-500 text-white rounded">Download</button>
                </a>
              </Tile.Body>
            </Tile>
          </div>
        ))}
  
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
