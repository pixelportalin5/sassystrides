import LazyAdSlot from './ads/LazyAdSlot';
import CategoryGrid from './CategoryGrid';

const HomepageCategorySection = ({ posts = [], categories = [] }) => (
  <section className="homepage-category-section editorial-container">
    <div className="homepage-category-section__layout">
      <div className="homepage-category-section__main">
        <CategoryGrid posts={posts} categories={categories} />
        <LazyAdSlot page="homepage" slot={2} variant="inline-billboard" />
      </div>

      <aside className="homepage-category-section__sidebar" aria-label="Sidebar advertisements">
        <LazyAdSlot page="homepage" slot={6} variant="sidebar-skyscraper" />
        <LazyAdSlot page="homepage" slot={7} variant="sidebar-skyscraper" />
      </aside>
    </div>
  </section>
);

export default HomepageCategorySection;
