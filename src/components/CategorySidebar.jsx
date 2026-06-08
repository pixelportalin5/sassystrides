import { memo } from 'react';
import { Link } from 'react-router-dom';
import CategoryFilters from './CategoryFilters';

const browseFallback = {
  fashion: ['Clothing', 'Fashion Week', 'Look of the Day', 'Accessories', 'Shoes'],
  beauty: ['Hair', 'Skin', 'Makeup', 'Fragrance', 'Wellness'],
  lifestyle: ['Culture', 'Travel', 'Interiors', 'Parties', 'Wellbeing'],
  trends: ['Spring', 'Summer', 'Autumn', 'Winter', 'Runway'],
  news: ['Awards & Events', 'Entertainment', 'Interviews', 'Magazine', 'Shopping'],
};

const CategorySidebar = ({
  category,
  categories = [],
  filters,
  filterOptions,
  onToggleFilter,
  onClearFilters,
}) => {
  const slug = category?.slug || 'fashion';
  const browseItems = browseFallback[slug] || browseFallback.fashion;

  const resolveHref = (name) => {
    const normalizedName = name.toLowerCase();
    const match = categories.find(
      (item) =>
        item.slug === normalizedName.replace(/\s+/g, '-') ||
        item.name.toLowerCase() === normalizedName ||
        item.name.toLowerCase().includes(normalizedName),
    );

    return match ? `/category/${match.slug}` : '#category-posts';
  };

  return (
    <aside className="space-y-6">
      <section className="border border-ink/10 bg-porcelain p-5">
        <h3 className="micro-label mb-5 text-espresso">Browse {category?.name || 'Fashion'}</h3>
        <nav className="space-y-3">
          {browseItems.map((item) => (
            <Link
              key={item}
              to={resolveHref(item)}
              className="block border-b border-ink/10 pb-3 text-[0.68rem] font-semibold uppercase tracking-[0.12em] text-taupe transition last:border-0 last:pb-0 hover:text-bronze"
            >
              {item}
            </Link>
          ))}
        </nav>
      </section>

      <CategoryFilters
        filters={filters}
        options={filterOptions}
        onToggle={onToggleFilter}
        onClear={onClearFilters}
      />
    </aside>
  );
};

export default memo(CategorySidebar);
