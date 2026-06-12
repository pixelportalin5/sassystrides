import { useQuery } from '@tanstack/react-query';
import { Search, X } from 'lucide-react';
import { memo, useCallback, useEffect, useId, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  CATEGORY_CACHE_TIME,
  CATEGORY_STALE_TIME,
  categoryQueryKeys,
  fetchSearchPostsQuery,
} from '../services/categoryQueries';
import { stripHtml } from '../services/wordpressApi';

const MIN_QUERY_LENGTH = 2;

const HeaderSearch = () => {
  const listboxId = useId();
  const inputRef = useRef(null);
  const rootRef = useRef(null);
  const navigate = useNavigate();

  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState('');
  const [debouncedQuery, setDebouncedQuery] = useState('');
  const [activeIndex, setActiveIndex] = useState(-1);

  useEffect(() => {
    const timer = window.setTimeout(() => {
      setDebouncedQuery(query.trim());
    }, 250);

    return () => window.clearTimeout(timer);
  }, [query]);

  const trimmedQuery = debouncedQuery.trim();
  const canSearch = trimmedQuery.length >= MIN_QUERY_LENGTH;

  const searchQuery = useQuery({
    queryKey: categoryQueryKeys.searchPosts(trimmedQuery),
    queryFn: () => fetchSearchPostsQuery(trimmedQuery),
    enabled: open && canSearch,
    staleTime: CATEGORY_STALE_TIME,
    gcTime: CATEGORY_CACHE_TIME,
  });

  const results = searchQuery.data || [];
  const showSuggestions = open && canSearch;

  const closeSearch = useCallback(() => {
    setOpen(false);
    setActiveIndex(-1);
  }, []);

  const openSearch = useCallback(() => {
    setOpen(true);
    window.requestAnimationFrame(() => {
      inputRef.current?.focus();
    });
  }, []);

  const goToPost = useCallback(
    (slug) => {
      if (!slug) {
        return;
      }

      closeSearch();
      setQuery('');
      setDebouncedQuery('');
      navigate(`/blog/${slug}`);
    },
    [closeSearch, navigate],
  );

  const submitSearch = useCallback(() => {
    if (!canSearch) {
      return;
    }

    const selected = results[activeIndex >= 0 ? activeIndex : 0];

    if (selected?.slug) {
      goToPost(selected.slug);
    }
  }, [activeIndex, canSearch, goToPost, results]);

  useEffect(() => {
    setActiveIndex(-1);
  }, [trimmedQuery, results.length]);

  useEffect(() => {
    if (!open) {
      return undefined;
    }

    const handlePointerDown = (event) => {
      if (!rootRef.current?.contains(event.target)) {
        closeSearch();
      }
    };

    const handleKeyDown = (event) => {
      if (event.key === 'Escape') {
        closeSearch();
      }
    };

    document.addEventListener('mousedown', handlePointerDown);
    document.addEventListener('keydown', handleKeyDown);

    return () => {
      document.removeEventListener('mousedown', handlePointerDown);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [closeSearch, open]);

  const handleInputKeyDown = (event) => {
    if (event.key === 'ArrowDown') {
      event.preventDefault();

      if (!results.length) {
        return;
      }

      setActiveIndex((current) => (current + 1 >= results.length ? 0 : current + 1));
      return;
    }

    if (event.key === 'ArrowUp') {
      event.preventDefault();

      if (!results.length) {
        return;
      }

      setActiveIndex((current) => (current <= 0 ? results.length - 1 : current - 1));
      return;
    }

    if (event.key === 'Enter') {
      event.preventDefault();
      submitSearch();
    }
  };

  return (
    <div
      ref={rootRef}
      className={`site-header__search ${open ? 'is-open' : ''}`}
      role="search"
    >
      <button
        type="button"
        className="site-header__search-toggle"
        aria-label={open ? 'Close search' : 'Open search'}
        aria-expanded={open}
        aria-controls={listboxId}
        onClick={() => (open ? closeSearch() : openSearch())}
      >
        {open ? <X size={16} strokeWidth={1.4} aria-hidden="true" /> : <Search size={16} strokeWidth={1.4} aria-hidden="true" />}
      </button>

      <div className="site-header__search-panel">
        <label className="sr-only" htmlFor={`${listboxId}-input`}>
          Search stories
        </label>
        <input
          ref={inputRef}
          id={`${listboxId}-input`}
          type="search"
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          onKeyDown={handleInputKeyDown}
          onFocus={() => setOpen(true)}
          placeholder="Search stories"
          className="site-header__search-input"
          autoComplete="off"
          role="combobox"
          aria-autocomplete="list"
          aria-expanded={showSuggestions}
          aria-controls={listboxId}
          aria-activedescendant={
            activeIndex >= 0 ? `${listboxId}-option-${activeIndex}` : undefined
          }
        />

        {showSuggestions ? (
          <ul
            id={listboxId}
            className="site-header__search-suggestions"
            role="listbox"
            aria-label="Story suggestions"
          >
            {searchQuery.isFetching ? (
              <li className="site-header__search-status" role="presentation">
                Searching...
              </li>
            ) : null}

            {!searchQuery.isFetching && !results.length ? (
              <li className="site-header__search-status" role="presentation">
                No stories found
              </li>
            ) : null}

            {results.map((post, index) => (
              <li key={post.id || post.slug} role="presentation">
                <button
                  type="button"
                  id={`${listboxId}-option-${index}`}
                  role="option"
                  aria-selected={activeIndex === index}
                  className={`site-header__search-option ${activeIndex === index ? 'is-active' : ''}`}
                  onMouseEnter={() => setActiveIndex(index)}
                  onClick={() => goToPost(post.slug)}
                >
                  {stripHtml(post.title)}
                </button>
              </li>
            ))}
          </ul>
        ) : null}
      </div>
    </div>
  );
};

export default memo(HeaderSearch);
