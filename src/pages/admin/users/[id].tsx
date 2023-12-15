import { getAuth, UserRecord } from 'firebase-admin/auth';

import { GetServerSidePropsContext } from 'next';
import Link from 'next/link';
import Head from 'next/head';

import {
  ChevronRightIcon,
  EllipsisVerticalIcon,
} from '@heroicons/react/24/outline';

import { withAdminProps } from '~/lib/admin/props/with-admin-props';
import { getOrganizationsForUser } from '~/lib/admin/queries';
import { Organization } from '~/lib/organizations/types/organization';
import { MembershipRole } from '~/lib/organizations/types/membership-role';

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '~/core/ui/Table';

import Heading from '~/core/ui/Heading';
import Tile from '~/core/ui/Tile';
import Label from '~/core/ui/Label';
import Badge from '~/core/ui/Badge';
import TextField from '~/core/ui/TextField';

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '~/core/ui/Dropdown';

import Button from '~/core/ui/Button';
import If from '~/core/ui/If';

import AdminRouteShell from '~/components/admin/AdminRouteShell';
import AdminHeader from '~/components/admin/AdminHeader';
import DisableUserModal from '~/components/admin/users/DisableUserModal';
import ImpersonateUserModal from '~/components/admin/users/ImpersonateUserModal';
import ReactivateUserModal from '~/components/admin/users/ReactivateUserModal';
import RoleBadge from '~/components/organizations/RoleBadge';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
interface SearchResult {
  union: string;
  uid: string; // Add the 'uid' property
  id:string;
  spouse: string;
  startdate: string;
  LastName: string;
  FirstName: string;
  LM: string;
  CurrentTotalPremium: string;
  CaseNotes:string;
  Status:string;
  MarkifBW:string;
  PreviousTotalPremium:string;
  MM:string;
  ChangeDate:string;
  // Add other properties if necessary
}


function UserAdminPage({
  user,
  organizations,
  unionData, // Access unionData from props
}: React.PropsWithChildren<{
  user: UserRecord & {
    isDisabled: boolean;
    isActive: boolean;
    union:string;
  };
  organizations: Array<
    WithId<
      Organization & {
        role: MembershipRole;
      }
    >
  >;
  unionData: any; // Define the type according to the structure of your data
}>) {
  const displayName =
    user.displayName || user.email || user.phoneNumber || user.uid || '';
    const [searchResults, setSearchResults] = useState<SearchResult[]>([]);

    const [query, setQuery] = useState('');
    const [activeFilter, setActiveFilter] = useState('');
    const [unionFilter, setUnionFilter] = useState('');
    const router = useRouter();
    const [formFields, setFormFields] = useState({});
    const [unionInput, setUnionInput] = useState('');
    const [CaseNotesInput, setCaseNotesInput] = useState('');
    const [CurrentTotalPremiumInput, setCurrentTotalPremiumInput] = useState('');
    const [LMInput, setLMInput] = useState('');
    const [MMInput, setMMInput] = useState('');
    const [ChangeDateInput, setChangeDatenput] = useState('');
    const [MarkifBWInput, setMarkifBWInput] = useState('');
    const [PreviousTotalPremiumInput, setPreviousTotalPremiumInput] = useState('');
    const [StatusInput, setStatusInput] = useState('');
    const [FirstNameInput, setFirstNameInput] = useState('');
    const [spouseInput, setSpouseInput] = useState('');
    const [startDateInput, setStartDateInput] = useState('');
    const [LastNameInput, setLastNameInput] = useState('');
    const [successMessage, setSuccessMessage] = useState('');
    useEffect(() => {
      const fetchUsers = async () => {
        const requestBody = {
          query,
          active: activeFilter,
          union: unionFilter,
          userId: user.uid, // Include the user's UID in the request
        };
        console.log("Search Request Body:", requestBody);
    
        try {
          const response = await fetch('/api/search/search', { // Update the API endpoint
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify(requestBody),
          });
    
          if (response.ok) {
            const users = await response.json();
            console.log('API response:', users); // Log the API response

            setSearchResults(users);
            console.log('Search results:', users); // Log the search results

          } else {
            console.error('Search failed');
          }
        } catch (error) {
          console.error('An error occurred during the search:', error);
        }
      };
    
      fetchUsers();
    }, [query, activeFilter, unionFilter, user]);
    useEffect(() => {
      const currentUser = searchResults.find(result => result.id === user.uid);
      console.log('Current user:', currentUser); // Log the current user

      if (currentUser) {
        setUnionInput(currentUser.union);
        setCaseNotesInput(currentUser.CaseNotes);
        setCurrentTotalPremiumInput(currentUser.CurrentTotalPremium);
        setSpouseInput(currentUser.spouse);
        setStartDateInput(currentUser.startdate);
        setLastNameInput(currentUser.LastName);
        setLMInput(currentUser.spouse);
        setMMInput(currentUser.MM);
        setChangeDatenput(currentUser.ChangeDate);
        setMarkifBWInput(currentUser.MarkifBW);
        setPreviousTotalPremiumInput(currentUser.PreviousTotalPremium);
        setStatusInput(currentUser.Status);
        setFirstNameInput(currentUser.FirstName);

      }
    }, [searchResults, user.uid]);
    const updateUser = async (userId: string,CaseNotes:string, LM:string,CurrentTotalPremium:string,union: string, spouse: string, startDate: string, LastName: string) => {
      try {
        const requestBody = {
          union: union,
          CaseNotes: CaseNotes,
          spouse: spouse,
          startdate: startDate,
          LastName: LastName,
          CurrentTotalPremium: CurrentTotalPremium,
          LM:LM,
          

        };
  
        const response = await fetch(`/api/update-user/${userId}`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(requestBody),
        });
  
        if (response.ok) {
          setSuccessMessage('User updated successfully!');
                } else {
          console.error('Update failed');
        }
      } catch (error) {
        console.error('An error occurred while updating the user:', error);
      }
    };
      
  return (
    <AdminRouteShell>
      <Head>
        <title>{`Manage User | ${displayName}`}</title>
      </Head>

      <AdminHeader>Manage User</AdminHeader>

      <div className={'p-3 flex flex-col flex-1'}>
        <div className={'flex flex-col space-y-6'}>
          <div className={'flex justify-between'}>
            <Breadcrumbs displayName={displayName} />

            <div>
              <UserActionsDropdown
                uid={user.uid}
                isDisabled={user.disabled}
                displayName={displayName}
              />
            </div>
          </div>

          <Tile>
            <Heading type={4}>User Details</Heading>

            <div className={'flex space-x-2 items-center'}>
              <div>
                <Label>Status</Label>
              </div>

              <div className={'inline-flex'}>
                {user.isActive ? (
                  <Badge size={'small'} color={'error'}>
                    Disabled
                  </Badge>
                ) : (
                  <Badge size={'small'} color={'success'}>
                    Active
                  </Badge>
                )}
              </div>
            </div>

            <TextField.Label>
              Display name
              <TextField.Input
                className={'max-w-sm'}
                defaultValue={user.displayName ?? ''}
                
              />
            </TextField.Label>

        

            <TextField.Label>
              Phone number
              <TextField.Input
                className={'max-w-sm'}
                defaultValue={user.phoneNumber ?? ''}
                disabled
              />
            </TextField.Label>

{searchResults.map((searchResult) => {
  if (searchResult.id === user.uid) {
    return (
      <form 
      key={searchResult.id} 
      onSubmit={(e) => { 
        e.preventDefault(); 
        updateUser(searchResult.id, CaseNotesInput, CurrentTotalPremiumInput, LMInput, unionInput, spouseInput, startDateInput, LastNameInput); 
      }}
      style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between' }}
    >
      <div style={{ width: '30%' }}>
        <TextField.Label>
          Union
          <TextField.Input
            className={'max-w-sm'}
            value={unionInput}
            onChange={(e) => setUnionInput((e.target as HTMLInputElement).value)}
          />
        </TextField.Label>
        <TextField.Label>
          Spouse
          <TextField.Input
            className={'max-w-sm'}
            value={spouseInput}
            onChange={(e) => setSpouseInput((e.target as HTMLInputElement).value)}
          />
        </TextField.Label>
        <TextField.Label>
          LM
          <TextField.Input
            className={'max-w-sm'}
            value={LMInput}
            onChange={(e) => setLMInput((e.target as HTMLInputElement).value)}
          />
        </TextField.Label>
      </div>
      <div style={{ width: '30%' }}>
        <TextField.Label>
          Start Date
          <TextField.Input
            className={'max-w-sm'}
            value={startDateInput}
            onChange={(e) => setStartDateInput((e.target as HTMLInputElement).value)}
          />
        </TextField.Label>
        <TextField.Label>
          Last Name
          <TextField.Input
            className={'max-w-sm'}
            value={LastNameInput}
            onChange={(e) => setLastNameInput((e.target as HTMLInputElement).value)}
          />
        </TextField.Label>
        <TextField.Label>
          LM
          <TextField.Input
            className={'max-w-sm'}
            value={LMInput}
            onChange={(e) => setLMInput((e.target as HTMLInputElement).value)}
          />
        </TextField.Label>
      </div>
      <div style={{ width: '30%' }}>
        <TextField.Label>
          Case Notes
          <TextField.Input
            className={'max-w-sm'}
            value={CaseNotesInput}
            onChange={(e) => setCaseNotesInput((e.target as HTMLInputElement).value)}
          />
        </TextField.Label>
        <TextField.Label>
          Current Total Premium
          <TextField.Input
            className={'max-w-sm'}
            value={CurrentTotalPremiumInput}
            onChange={(e) => setCurrentTotalPremiumInput((e.target as HTMLInputElement).value)}
          />
        </TextField.Label>
        <TextField.Label>
          LM
          <TextField.Input
            className={'max-w-sm'}
            value={LMInput}
            onChange={(e) => setLMInput((e.target as HTMLInputElement).value)}
          />
        </TextField.Label>
        
      </div>
      <div style={{ width: '100%', display: 'flex', justifyContent: 'center' }}>
    <Button style={{ marginTop: '20px', width: 'auto' }} type="submit">Update User</Button>
  </div>    </form>
    );
  }
  return null;
})}

{successMessage && <p style={{ color: 'green' }}>{successMessage}</p>}


          </Tile>
       
         
        </div>
      </div>
    </AdminRouteShell>
  );
}


export default UserAdminPage;

export async function getServerSideProps(ctx: GetServerSidePropsContext) {
  const adminProps = await withAdminProps(ctx);

  if ('redirect' in adminProps) {
    return adminProps;
  }

  const auth = getAuth();
  const user = await auth.getUser(ctx.query.id as string);

  const userProps = {
    uid: user.uid,
    email: user.email || '',
    phoneNumber: user.phoneNumber || '',
    displayName: user.displayName || '',
    photoURL: user.photoURL || '',
    disabled: user.disabled,

  };

  const organizations = await getOrganizationsForUser(user.uid);

  return {
    props: {
      ...adminProps.props,
      organizations,
      user: userProps,

    },
  };
}

function Breadcrumbs({
  displayName,
}: React.PropsWithChildren<{
  displayName: string;
}>) {
  return (
    <div className={'flex space-x-1 items-center text-xs p-2'}>
      <Link href={'/admin'}>Admin</Link>
      <ChevronRightIcon className={'w-3'} />
      <Link href={'/admin/users'}>Users</Link>
      <ChevronRightIcon className={'w-3'} />
      <span>{displayName}</span>
    </div>
  );
}

function UserActionsDropdown({
  uid,
  displayName,
  isDisabled,
}: React.PropsWithChildren<{
  uid: string;
  isDisabled: boolean;
  displayName: string;
}>) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant={'ghost'}>
          <span className={'flex space-x-2.5 items-center'}>
            <span>Manage User</span>

            <EllipsisVerticalIcon className={'w-4'} />
          </span>
        </Button>
      </DropdownMenuTrigger>

      <DropdownMenuContent>
        <DropdownMenuItem onSelect={(e) => e.preventDefault()}>
          <ImpersonateUserModal userId={uid} displayName={displayName}>
            Impersonate
          </ImpersonateUserModal>
        </DropdownMenuItem>

        <If condition={!isDisabled}>
          <DropdownMenuItem onSelect={(e) => e.preventDefault()}>
            <DisableUserModal userId={uid} displayName={displayName}>
              <span className={'text-red-500'}>Disable</span>
            </DisableUserModal>
          </DropdownMenuItem>
        </If>

        <If condition={isDisabled}>
          <DropdownMenuItem onSelect={(e) => e.preventDefault()}>
            <ReactivateUserModal userId={uid} displayName={displayName}>
              Reactivate
            </ReactivateUserModal>
          </DropdownMenuItem>
        </If>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}