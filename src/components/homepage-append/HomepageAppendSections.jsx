import AppendFashionCities from './AppendFashionCities';
import AppendInstagramInspo from './AppendInstagramInspo';
import AppendNewsletterBlock from './AppendNewsletterBlock';
import AppendSponsoredStory from './AppendSponsoredStory';
import '../../styles/homepage-append.css';

const HomepageAppendSections = ({ posts = [] }) => (
  <div className="hp-append">
    <AppendFashionCities />
    <AppendSponsoredStory posts={posts.slice(5, 6)} />
    <AppendNewsletterBlock />
    <AppendInstagramInspo posts={posts.slice(0, 10)} />
  </div>
);

export default HomepageAppendSections;
