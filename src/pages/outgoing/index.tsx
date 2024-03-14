import { GetServerSidePropsContext } from 'next';
import dynamic from 'next/dynamic';

import { withAppProps } from '~/lib/props/with-app-props';
import RouteShell from '~/components/RouteShell';

const OutgoingPage = dynamic(
  () => import('~/components/outgoing/outgoing'),
  {
    ssr: false,
  }
);

const Outgoing = () => {
    return (
      <RouteShell title={'Outgoing'}>
        <OutgoingPage/>
      </RouteShell>
    );
  };

export default Outgoing;

export async function getServerSideProps(ctx: GetServerSidePropsContext) {
  return await withAppProps(ctx);
}
