import LazyAdSlot from './ads/LazyAdSlot';
import CategoryGrid from './CategoryGrid';
import HomepageSidebarBlog from './HomepageSidebarBlog';

const HomepageCategorySection = ({ posts = [], categories = [], blogPosts = [] }) => (
  <section className="homepage-category-section editorial-container">
    <div className="homepage-category-section__layout">
      <div className="homepage-category-section__main">
        <CategoryGrid posts={posts} categories={categories} />
      </div>
      <aside className="homepage-category-section__sidebar" aria-label="Sidebar advertisements">
        <LazyAdSlot page="homepage" slot={6} variant="sidebar-skyscraper" />
        <LazyAdSlot page="homepage" slot={7} variant="sidebar-skyscraper" />
      </aside>
    </div>

    <div className="homepage-category-section__layout homepage-category-section__layout--billboard">
      <div className="homepage-category-section__main">
        <LazyAdSlot page="homepage" slot={2} variant="inline-billboard" />
      </div>
      <HomepageSidebarBlog posts={blogPosts} />
    </div>
  </section>
);

export default HomepageCategorySection;
