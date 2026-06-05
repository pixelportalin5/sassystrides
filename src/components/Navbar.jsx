import { Menu, Search, ShoppingBag, UserRound } from 'lucide-react';
import { memo, useCallback } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { Link, useLocation } from 'react-router-dom';
import { prefetchCategoryData } from '../services/categoryQueries';

const logoUrl =
  'https://sassystrides.com/wp-content/uploads/2026/03/cropped-Maha-Utsav-Instagram-Post-3.png';

const navItems = [
  { label: 'Fashion', path: '/fashion', slug: 'fashion' },
  { label: 'Beauty', path: '/beauty', slug: 'beauty' },
  { label: 'Lifestyle', path: '/lifestyle', slug: 'lifestyle' },
  { label: 'Trends', path: '/trends', slug: 'trends' },
  { label: 'News', path: '/news', slug: 'news' },
];

const Navbar = () => {
  const { pathname } = useLocation();
  const queryClient = useQueryClient();

  const isActive = (item) =>
    pathname === item.path || pathname === `/category/${item.slug}`;
  const prefetchCategory = useCallback(
    (slug) => {
      prefetchCategoryData(queryClient, slug);
    },
    [queryClient],
  );

  return (
    <header className="sticky top-0 z-50 border-b border-ink/10 bg-ivory/94 backdrop-blur-xl">
      <div className="editorial-container grid h-20 grid-cols-[1fr_auto_1fr] items-center gap-4 sm:h-24">
        <div className="flex items-center gap-5">
          <button
            type="button"
            aria-label="Open menu"
            className="grid h-9 w-9 place-items-center border border-transparent transition hover:border-ink/20 hover:bg-parchment"
          >
            <Menu size={19} strokeWidth={1.4} />
          </button>
        </div>

        <Link
          to="/"
          className="group flex justify-center"
          aria-label="Sassy Strides homepage"
        >
          <img
            src={logoUrl}
            alt="Sassy Strides"
            className="h-14 w-auto max-w-[190px] object-contain drop-shadow-[0_10px_24px_rgba(155,115,76,0.18)] transition duration-500 group-hover:scale-[1.025] sm:h-20 sm:max-w-[360px]"
            loading="eager"
            decoding="async"
            fetchPriority="high"
          />
        </Link>

        <div className="flex justify-end gap-1 sm:gap-2">
          {[Search, UserRound, ShoppingBag].map((Icon, index) => (
            <button
              key={index}
              type="button"
              aria-label={['Search', 'Account', 'Shopping bag'][index]}
              className="grid h-9 w-9 place-items-center transition hover:bg-parchment"
            >
              <Icon size={18} strokeWidth={1.35} />
            </button>
          ))}
        </div>
      </div>

      <nav className="border-t border-ink/10">
        <div className="editorial-container flex h-10 items-center justify-center gap-8 overflow-x-auto">
          {navItems.map((item) => (
            <Link
              key={item.slug}
              to={item.path}
              onMouseEnter={() => prefetchCategory(item.slug)}
              onFocus={() => prefetchCategory(item.slug)}
              className={`relative flex h-full items-center text-[0.62rem] font-semibold uppercase tracking-[0.22em] transition hover:text-bronze ${
                isActive(item) ? 'text-espresso' : 'text-ink/68'
              }`}
              aria-current={isActive(item) ? 'page' : undefined}
            >
              {item.label}
              <span
                className={`absolute inset-x-0 bottom-0 h-px bg-espresso transition ${
                  isActive(item) ? 'opacity-100' : 'opacity-0'
                }`}
              />
            </Link>
          ))}
        </div>
      </nav>
    </header>
  );
};

export default memo(Navbar);
