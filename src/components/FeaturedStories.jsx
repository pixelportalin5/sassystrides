import { ArrowUpRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { stripHtml } from '../services/wordpressApi';
import PostImage from './PostImage';

const FeaturedStories = ({ posts = [] }) => {
  const main = posts[0];
  const side = posts.slice(1, 4);

  if (!main) {
    return null;
  }

  return (
    <section id="featured" className="featured-stories">
      <div className="featured-stories__header">
        <h2 className="micro-label text-espresso">Featured Stories</h2>
        <Link
          to={`/blog/${main.slug}`}
          className="featured-stories__view-all"
        >
          View All Stories
          <ArrowUpRight size={14} strokeWidth={1.5} />
        </Link>
      </div>

      <div className="featured-stories__grid">
        <article className="featured-stories__main group">
          <Link to={`/blog/${main.slug}`} className="featured-stories__main-image">
            <PostImage
              src={main.heroImage || main.image}
              alt={main.imageAlt}
              srcSet={main.imageSrcSet}
              sizes="(min-width: 1024px) 58vw, 100vw"
              priority
              className="h-full w-full object-cover saturate-[0.82] transition duration-700 group-hover:scale-[1.02] group-hover:saturate-100"
            />
          </Link>
          <div className="featured-stories__main-copy">
            <p className="micro-label mb-3 text-bronze">{main.categoryName}</p>
            <Link to={`/blog/${main.slug}`}>
              <h3 className="serif-title text-3xl leading-[0.95] text-espresso transition group-hover:text-bronze sm:text-4xl lg:text-5xl">
                {stripHtml(main.title.rendered)}
              </h3>
            </Link>
            <p className="mt-4 max-w-2xl text-sm leading-7 text-taupe">
              {stripHtml(main.excerpt.rendered)}
            </p>
            <Link to={`/blog/${main.slug}`} className="featured-stories__read-link">
              Read Story
              <ArrowUpRight size={14} strokeWidth={1.5} />
            </Link>
          </div>
        </article>

        <div className="featured-stories__side">
          {side.map((post) => (
            <Link
              key={post.id}
              to={`/blog/${post.slug}`}
              className="featured-stories__side-item group"
            >
              <img
                src={post.image}
                alt={post.imageAlt}
                srcSet={post.imageSrcSet}
                sizes="120px"
                className="featured-stories__side-thumb"
                loading="lazy"
                decoding="async"
              />
              <span className="featured-stories__side-copy">
                <span className="micro-label mb-2 block text-bronze">{post.categoryName}</span>
                <span className="serif-title line-clamp-3 text-xl leading-none text-espresso transition group-hover:text-bronze sm:text-2xl">
                  {stripHtml(post.title.rendered)}
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
