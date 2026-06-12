import { memo, useCallback } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { Link, useLocation } from 'react-router-dom';
import { LOGO_URL } from '../constants/subcategories';
import { prefetchCategoryData } from '../services/categoryQueries';
import HeaderSearch from './HeaderSearch';
import HeaderSocialLinks from './HeaderSocialLinks';

const navItems = [
  { label: 'Fashion', path: '/fashion', slug: 'fashion' },
  { label: 'Beauty', path: '/beauty', slug: 'beauty' },
  { label: 'Lifestyle', path: '/lifestyle', slug: 'lifestyle' },
  { label: 'Trends', path: '/trends', slug: 'trends' },
  { label: 'News', path: '/news', slug: 'news' },
  { label: 'About Us', path: '/about' },
  { label: 'Advertise', path: '/advertise' },
];

const Navbar = () => {
  const { pathname } = useLocation();
  const queryClient = useQueryClient();

  const isActive = (item) => {
    if (item.path === pathname) {
      return true;
    }

    if (item.slug) {
      return pathname === `/category/${item.slug}` || pathname.startsWith(`${item.path}/`);
    }

    return false;
  };

  const prefetchCategory = useCallback(
    (slug) => {
      if (slug) {
        prefetchCategoryData(queryClient, slug);
      }
    },
    [queryClient],
  );

  return (
    <header className="site-header sticky top-0 z-50 border-b border-ink/10 bg-ivory/94 backdrop-blur-xl">
      <div className="site-header__top editorial-container">
        <div className="site-header__top-spacer" aria-hidden="true" />

        <Link to="/" className="site-header__brand" aria-label="Sassy Strides homepage">
          <img
            src={LOGO_URL}
            alt="Sassy Strides"
            className="site-header__logo-image"
            loading="eager"
            decoding="async"
            fetchPriority="high"
          />
        </Link>

        <div className="site-header__top-actions">
          <HeaderSearch />
          <HeaderSocialLinks />
        </div>
      </div>

      <nav className="site-header__nav" aria-label="Primary">
        <div className="site-header__nav-inner editorial-container">
          {navItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              onMouseEnter={() => prefetchCategory(item.slug)}
              onFocus={() => prefetchCategory(item.slug)}
              className={`site-header__nav-link ${isActive(item) ? 'is-active' : ''}`}
              aria-current={isActive(item) ? 'page' : undefined}
            >
              {item.label}
            </Link>
          ))}
        </div>
      </nav>
    </header>
  );
};

export default memo(Navbar);
