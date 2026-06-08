import LazyAdSlot from './LazyAdSlot';

const HomepageSponsorRow = () => (
  <>
    <LazyAdSlot page="homepage" slot={5} variant="section-stack-slot" />
    <LazyAdSlot page="homepage" slot={6} variant="section-stack-slot" />
    <LazyAdSlot page="homepage" slot={7} variant="section-stack-slot" />
    <LazyAdSlot page="homepage" slot={8} variant="section-stack-slot" />
  </>
);

export default HomepageSponsorRow;
