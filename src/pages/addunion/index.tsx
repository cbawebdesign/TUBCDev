import { GetServerSidePropsContext } from 'next';
import dynamic from 'next/dynamic';

import { withAppProps } from '~/lib/props/with-app-props';
import RouteShell from '~/components/RouteShell';
import { add } from 'cypress/types/lodash';

const AddUnionPage = dynamic(
  () => import('~/components/addunion/addunion'),
  {
    ssr: false,
  }
);

const addunion = () => {
  return (
    <RouteShell title={'Add User'}>
      <AddUnionPage/>
    </RouteShell>
  );
};

export default addunion;

export async function getServerSideProps(ctx: GetServerSidePropsContext) {
  return await withAppProps(ctx);
}
