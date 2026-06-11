import { Link } from 'react-router-dom';
import {
  getSubcategoriesByParent,
  getSubcategoryPath,
  PARENT_CATEGORY_SLUGS,
} from '../constants/subcategories';

const categoryLabels = {
  fashion: 'Fashion',
  beauty: 'Beauty',
  lifestyle: 'Lifestyle',
  trends: 'Trends',
  news: 'News',
};

const HomepageCategoryDirectory = ({ posts = [] }) => (
  <section className="homepage-category-directory editorial-container" aria-label="Browse categories">
    <div className="homepage-category-directory__grid">
      {PARENT_CATEGORY_SLUGS.map((slug, index) => {
        const subcategories = getSubcategoriesByParent(slug);
        const post =
          posts.find((item) => item.categoryName.toLowerCase().includes(slug)) ||
          posts[index];

        return (
          <div key={slug} className="homepage-category-directory__column">
            <div className="homepage-category-directory__column-head">
              <Link to={`/${slug}`} className="homepage-category-directory__title">
                {categoryLabels[slug]}
              </Link>
              {post && (
                <Link to={`/${slug}`} className="homepage-category-directory__thumb-wrap">
                  <img
                    src={post.image}
                    alt={post.imageAlt}
                    srcSet={post.imageSrcSet}
                    sizes="120px"
                    className="homepage-category-directory__thumb"
                    loading="lazy"
                    decoding="async"
                  />
                </Link>
              )}
            </div>
            <ul className="homepage-category-directory__links">
              {subcategories.map((sub) => (
                <li key={sub.slug}>
                  <Link
                    to={getSubcategoryPath(slug, sub.slug)}
                    className="homepage-category-directory__link"
                    title={sub.description}
                  >
                    {sub.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        );
      })}
    </div>
  </section>
);

export default HomepageCategoryDirectory;
