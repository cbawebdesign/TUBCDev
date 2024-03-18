import configuration from '~/configuration';
import { Cog8ToothIcon, ShieldCheckIcon, CodeBracketIcon, Squares2X2Icon, MagnifyingGlassPlusIcon, CodeBracketSquareIcon, ArchiveBoxArrowDownIcon, UserPlusIcon, ServerIcon, ArrowPathRoundedSquareIcon, PlusCircleIcon, PlusSmallIcon, PlusIcon, DocumentCheckIcon } from '@heroicons/react/24/outline';

const NAVIGATION_CONFIG = {
  items: [
    {
      label: 'common:dashboardTabLabel',
      path: '/dashboard',
      Icon: ({ className }: { className: string }) => {
        return <DocumentCheckIcon className={className} />;
      },
    },
    {
      label: 'common:settingsTabLabel',
      path: '/settings',
      Icon: ({ className }: { className: string }) => {
        return <Cog8ToothIcon className={className} />;
      },
    },
    {
      label: 'common:AddUnionLabel',
      path: '/addunion',
      Icon: ({ className }: { className: string }) => {
        return <PlusCircleIcon className={className} />;
      },
    },
    {
      label: 'common:CreateUserLabel',
      path: '/adduser',
      Icon: ({ className }: { className: string }) => {
        return <UserPlusIcon className={className} />;
      },
    },
    {
      label: 'common:searchLabel',
      path: '/search',
      Icon: ({ className }: { className: string }) => {
        return <MagnifyingGlassPlusIcon        className={className} />;
      },
    },
    {
      label: 'common:reportsLabel',
      path: '/dataview',
      Icon: ({ className }: { className: string }) => {
        return <ArchiveBoxArrowDownIcon        className={className} />;
      },
    },
    {
      label: 'common:OutgoingLabel',
      path: '/outgoing',
      Icon: ({ className }: { className: string }) => {
        return <ServerIcon        className={className} />;
      },
    },
    {
      label: 'common:adminLabel',
      path: '/admin',
      Icon: ({ className }: { className: string }) => {
        return <ShieldCheckIcon
        className={className} />;
      },
    },
    {
      label: 'common:NYLabel',
      path: '/nystate',
      Icon: ({ className }: { className: string }) => {
        return <CodeBracketSquareIcon className={className} />;
      },
    },
  
  ],
};

export default NAVIGATION_CONFIG;
