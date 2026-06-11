import { ArrowUpRight, ChevronLeft, ChevronRight } from 'lucide-react';
import { memo, useRef } from 'react';
import { Link } from 'react-router-dom';
import { getCardImageProps } from '../utils/imageSizes';

const STYLE_MOODS = [
  'Old Money',
  'Quiet Luxury',
  'Parisian Chic',
  'Streetwear',
  'Scandi Minimal',
  'Coastal Summer',
  'NYC Corporate',
  'Clean Girl',
];

const StyleMoodCarousel = memo(({ posts = [] }) => {
  const trackRef = useRef(null);

  const scrollByAmount = (direction) => {
    const track = trackRef.current;
    if (!track) {
      return;
    }

    const amount = Math.max(track.clientWidth * 0.72, 220);
    track.scrollBy({ left: direction * amount, behavior: 'smooth' });
  };

  return (
    <section id="style-mood" className="style-mood-section editorial-container">
      <div className="style-mood-section__header">
        <h2 className="micro-label text-espresso">Browse By Style Mood</h2>
        <Link to="/trends" className="style-mood-section__view-all">
          View All
          <ArrowUpRight size={14} strokeWidth={1.5} />
        </Link>
      </div>

      <div className="style-mood-section__carousel">
        <button
          type="button"
          className="style-mood-section__nav style-mood-section__nav--prev"
          aria-label="Scroll style moods left"
          onClick={() => scrollByAmount(-1)}
        >
          <ChevronLeft size={18} strokeWidth={1.4} />
        </button>

        <div ref={trackRef} className="style-mood-section__track luxury-scrollbar">
          {STYLE_MOODS.map((mood, index) => {
            const post = posts[index % Math.max(posts.length, 1)];
            const imageProps = post ? getCardImageProps(post, { compact: true }) : null;

            return (
              <Link
                key={mood}
                to={post ? `/blog/${post.slug}` : '/trends'}
                className="style-mood-section__card group"
              >
                <div className="style-mood-section__image-wrap">
                  {imageProps && (
                    <img
                      src={imageProps.src}
                      alt={post.imageAlt}
                      srcSet={imageProps.srcSet}
                      sizes="180px"
                      className="style-mood-section__image"
                      loading="lazy"
                      decoding="async"
                    />
                  )}
                </div>
                <p className="style-mood-section__label">{mood}</p>
              </Link>
            );
          })}
        </div>

        <button
          type="button"
          className="style-mood-section__nav style-mood-section__nav--next"
          aria-label="Scroll style moods right"
          onClick={() => scrollByAmount(1)}
        >
          <ChevronRight size={18} strokeWidth={1.4} />
        </button>
      </div>
    </section>
  );
});

StyleMoodCarousel.displayName = 'StyleMoodCarousel';

export default StyleMoodCarousel;
