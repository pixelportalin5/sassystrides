import { Link } from 'react-router-dom';
import BlogCard from './BlogCard';
import { stripHtml } from '../services/wordpressApi';

const FeaturedStories = ({ posts = [] }) => {
  const main = posts[0];
  const side = posts.slice(1, 5);

  if (!main) {
    return null;
  }

  return (
    <section id="featured" className="editorial-container py-8">
      <div className="mb-4 flex items-end justify-between border-b border-ink/10 pb-3">
        <h2 className="micro-label text-espresso">Featured Stories</h2>
        <Link
          to={`/blog/${main.slug}`}
          className="text-[0.62rem] font-semibold uppercase tracking-[0.2em] text-taupe hover:text-bronze"
        >
          View All Stories
        </Link>
      </div>
      <div className="grid gap-4 lg:grid-cols-[1.35fr_0.85fr]">
        <BlogCard post={main} variant="large" />
        <div className="grid gap-px border border-ink/10 bg-ink/10">
          {side.map((post) => (
            <Link
              key={post.id}
              to={`/blog/${post.slug}`}
              className="group grid grid-cols-[96px_1fr] gap-4 bg-porcelain p-3 transition hover:bg-parchment sm:grid-cols-[130px_1fr]"
            >
              <img
                src={post.image}
                alt={post.imageAlt}
                srcSet={post.imageSrcSet}
                sizes="130px"
                className="h-24 w-full object-cover saturate-[0.82] transition duration-500 group-hover:saturate-100 sm:h-28"
                loading="lazy"
                decoding="async"
              />
              <span className="flex flex-col justify-center">
                <span className="micro-label mb-2 text-bronze">{post.categoryName}</span>
                <span className="serif-title line-clamp-2 text-2xl leading-none text-espresso group-hover:text-bronze">
                  {stripHtml(post.title.rendered)}
                </span>
                <span className="mt-2 line-clamp-2 text-xs leading-5 text-taupe">
                  {stripHtml(post.excerpt.rendered)}
                </span>
              </span>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FeaturedStories;
