import { memo } from 'react';
import { Link } from 'react-router-dom';
import { getSubcategoriesByParent, getSubcategoryPath } from '../constants/subcategories';

const CategorySidebar = ({
  category,
  categories = [],
  parentSlug: parentSlugProp,
  activeSubSlug,
}) => {
  const parentSlug =
    parentSlugProp ||
    categories.find((item) => item.name === category?.name)?.slug ||
    category?.slug ||
    'fashion';
  const browseItems = getSubcategoriesByParent(parentSlug);

  return (
    <aside className="space-y-6">
      <section className="border border-ink/10 bg-porcelain p-5">
        <h3 className="micro-label mb-5 text-espresso">Browse {category?.name || 'Fashion'}</h3>
        <nav className="space-y-4">
          {browseItems.map((item) => {
            const isActive = activeSubSlug === item.slug;

            return (
              <Link
                key={item.slug}
                to={getSubcategoryPath(parentSlug, item.slug)}
                className={`category-sidebar__link group block border-b border-ink/10 pb-4 transition last:border-0 last:pb-0 ${isActive ? 'is-active' : ''}`}
                aria-current={isActive ? 'page' : undefined}
              >
                <span className="category-sidebar__link-title block text-[0.68rem] font-semibold uppercase tracking-[0.12em]">
                  {item.name}
                </span>
                <span className="category-sidebar__link-description mt-1.5 block text-xs leading-5">
                  {item.description}
                </span>
              </Link>
            );
          })}
        </nav>
      </section>
    </aside>
  );
};

export default memo(CategorySidebar);
