import { ArrowUpRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import LazyAdSlot from '../ads/LazyAdSlot';
import { stripHtml } from '../../services/wordpressApi';

const AppendSponsoredStory = ({ posts = [] }) => {
  const story = posts[0];

  return (
    <section className="hp-append__sponsored" aria-label="Sponsored story">
      <div className="hp-append__sponsored-banner">
        <div className="hp-append__sponsored-layout">
          <div className="hp-append__sponsored-copy">
            <p className="hp-append__sponsored-badge">Sponsored</p>
            {story ? (
              <>
                <Link to={`/blog/${story.slug}`} className="hp-append__sponsored-headline">
                  {stripHtml(story.title.rendered)}
                </Link>
                <Link to={`/blog/${story.slug}`} className="hp-append__sponsored-cta">
                  Read Story
                  <ArrowUpRight size={13} strokeWidth={1.5} />
                </Link>
              </>
            ) : (
              <>
                <p className="hp-append__sponsored-headline">
                  The Quiet Luxury Brands Everyone Is Wearing
                </p>
                <span className="hp-append__sponsored-cta">
                  Read Story
                  <ArrowUpRight size={13} strokeWidth={1.5} />
                </span>
              </>
            )}
          </div>

          <div className="hp-append__sponsored-image-wrap">
            {story ? (
              <Link to={`/blog/${story.slug}`}>
                <img
                  src={story.heroImage || story.image}
                  alt={story.imageAlt}
                  srcSet={story.imageSrcSet}
                  sizes="(min-width: 768px) 50vw, 100vw"
                  className="hp-append__sponsored-image"
                  loading="lazy"
                  decoding="async"
                />
              </Link>
            ) : (
              <div className="hp-append__sponsored-ad">
                <LazyAdSlot page="homepage" slot={11} variant="inline-banner" />
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};

export default AppendSponsoredStory;
