import { memo } from 'react';

const FilterGroup = ({ title, options = [], selected = [], onToggle }) => {
  if (!options.length) {
    return null;
  }

  return (
    <div className="border-t border-ink/10 pt-5">
      <h4 className="micro-label mb-4 text-espresso">{title}</h4>
      <div className="space-y-3">
        {options.map((option) => {
          const checked = selected.includes(option.value);
          return (
            <label
              key={option.value}
              className="flex cursor-pointer items-center justify-between gap-3 text-[0.72rem] text-taupe"
            >
              <span className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={checked}
                  onChange={() => onToggle(option.value)}
                  className="h-3.5 w-3.5 accent-espresso"
                />
                {option.label}
              </span>
              {typeof option.count === 'number' && <span>{option.count}</span>}
            </label>
          );
        })}
      </div>
    </div>
  );
};

const ColorGroup = ({ options = [], selected = [], onToggle }) => {
  if (!options.length) {
    return null;
  }

  return (
    <div className="border-t border-ink/10 pt-5">
      <h4 className="micro-label mb-4 text-espresso">Color</h4>
      <div className="flex flex-wrap gap-2">
        {options.map((option) => {
          const checked = selected.includes(option.value);
          return (
            <button
              key={option.value}
              type="button"
              aria-label={`Filter by ${option.label}`}
              onClick={() => onToggle(option.value)}
              className={`h-5 w-5 border transition ${
                checked ? 'border-espresso ring-2 ring-espresso/20' : 'border-ink/20'
              }`}
              style={{ backgroundColor: option.hex }}
            />
          );
        })}
      </div>
    </div>
  );
};

const CategoryFilters = ({ filters, options, onToggle, onClear }) => (
  <section className="space-y-5 border border-ink/10 bg-porcelain p-5">
    <div className="flex items-center justify-between">
      <h3 className="micro-label text-espresso">Filter By</h3>
      <button
        type="button"
        onClick={onClear}
        className="text-[0.6rem] font-semibold uppercase tracking-[0.18em] text-taupe transition hover:text-bronze"
      >
        Clear All
      </button>
    </div>
    <FilterGroup
      title="Category"
      options={options.categories}
      selected={filters.categories}
      onToggle={(value) => onToggle('categories', value)}
    />
    <FilterGroup
      title="Brand"
      options={options.brands}
      selected={filters.brands}
      onToggle={(value) => onToggle('brands', value)}
    />
    <ColorGroup
      options={options.colors}
      selected={filters.colors}
      onToggle={(value) => onToggle('colors', value)}
    />
    <FilterGroup
      title="Tag"
      options={options.tags}
      selected={filters.tags}
      onToggle={(value) => onToggle('tags', value)}
    />
  </section>
);

export default memo(CategoryFilters);
