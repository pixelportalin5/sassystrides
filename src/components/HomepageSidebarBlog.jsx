import { ArrowUpRight } from 'lucide-react';
import { memo } from 'react';
import { Link } from 'react-router-dom';
import { stripHtml } from '../services/wordpressApi';

const HomepageSidebarBlog = memo(({ posts = [] }) => {
  const stories = posts.slice(0, 3);

  if (!stories.length) {
    return null;
  }

  return (
    <aside className="homepage-sidebar-blog" aria-label="Latest stories">
      <div className="homepage-sidebar-blog__header">
        <h3 className="micro-label text-espresso">Latest Stories</h3>
        <Link to="#featured" className="homepage-sidebar-blog__view-all">
          View All
          <ArrowUpRight size={13} strokeWidth={1.5} />
        </Link>
      </div>
      <div className="homepage-sidebar-blog__list">
        {stories.map((post) => (
          <Link
            key={post.id}
            to={`/blog/${post.slug}`}
            className="homepage-sidebar-blog__item group"
          >
            <img
              src={post.image}
              alt={post.imageAlt}
              srcSet={post.imageSrcSet}
              sizes="88px"
              className="homepage-sidebar-blog__thumb"
              loading="lazy"
              decoding="async"
            />
            <span className="homepage-sidebar-blog__copy">
              <span className="micro-label mb-1.5 block text-bronze">{post.categoryName}</span>
              <span className="homepage-sidebar-blog__title serif-title line-clamp-2 leading-none text-espresso transition group-hover:text-bronze">
                {stripHtml(post.title.rendered)}
              </span>
            </span>
          </Link>
        ))}
      </div>
    </aside>
  );
});

HomepageSidebarBlog.displayName = 'HomepageSidebarBlog';

export default HomepageSidebarBlog;
