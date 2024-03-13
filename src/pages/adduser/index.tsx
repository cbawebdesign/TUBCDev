import { GetServerSidePropsContext } from 'next';
import dynamic from 'next/dynamic';

import { withAppProps } from '~/lib/props/with-app-props';
import RouteShell from '~/components/RouteShell';
import { add } from 'cypress/types/lodash';

const AddUserPage = dynamic(
  () => import('~/components/adduser/adduser'),
  {
    ssr: false,
  }
);

const adduser = () => {
  return (
    <RouteShell title={'Add User'}>
      <AddUserPage/>
    </RouteShell>
  );
};

export default adduser;

export async function getServerSideProps(ctx: GetServerSidePropsContext) {
  return await withAppProps(ctx);
}
