import { Link } from 'react-router-dom';
import { GridAdCard } from './EditorialAds';

const InstagramGallery = ({ posts = [], gridAdId }) => {
  const gallery = posts.slice(0, 8);

  if (!gallery.length) {
    return null;
  }

  const items = [];

  gallery.forEach((post, index) => {
    items.push(
      <Link
        key={post.id}
        to={`/blog/${post.slug}`}
        className="group relative aspect-[0.82/1] overflow-hidden bg-champagne"
      >
        <img
          src={post.image}
          alt={post.imageAlt}
          srcSet={post.imageSrcSet}
          sizes="(min-width: 1024px) 11vw, 33vw"
          className="h-full w-full object-cover saturate-[0.82] transition duration-500 group-hover:scale-105 group-hover:saturate-100"
          loading="lazy"
          decoding="async"
        />
        <span className="absolute inset-0 grid place-items-center bg-espresso/0 text-[0.62rem] font-semibold uppercase tracking-[0.2em] text-transparent transition group-hover:bg-espresso/45 group-hover:text-porcelain">
          View
        </span>
      </Link>,
    );

    if (gridAdId && index === gallery.length - 1) {
      items.push(
        <GridAdCard key={`instagram-grid-ad-${gridAdId}`} adId={gridAdId} variant="inset-span2" />,
      );
    }
  });

  return (
    <section className="editorial-container editorial-section">
      <div className="mb-4 flex items-center justify-between border-b border-ink/10 pb-3">
        <h2 className="micro-label text-espresso">Instagram Inspo</h2>
        <span className="text-[0.62rem] font-semibold uppercase tracking-[0.2em] text-taupe">
          @sassystrides
        </span>
      </div>
      <div className="grid grid-cols-3 gap-2 sm:grid-cols-4 lg:grid-cols-6">
        {items}
      </div>
    </section>
  );
};

export default InstagramGallery;
