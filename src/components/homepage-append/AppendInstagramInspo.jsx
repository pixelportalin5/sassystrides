import { Link } from 'react-router-dom';

const AppendInstagramInspo = ({ posts = [] }) => {
  const gallery = posts.slice(0, 10);

  if (!gallery.length) {
    return null;
  }

  return (
    <section className="hp-append__section" aria-label="Instagram inspiration">
      <div className="hp-append__container">
        <div className="hp-append__instagram-header">
          <h2 className="hp-append__instagram-title">Instagram Inspo</h2>
          <span className="hp-append__instagram-handle">@sassystrides</span>
        </div>
        <div className="hp-append__instagram-grid">
          {gallery.map((post) => (
            <Link
              key={post.id}
              to={`/blog/${post.slug}`}
              className="hp-append__instagram-item"
            >
              <img
                src={post.image}
                alt={post.imageAlt}
                srcSet={post.imageSrcSet}
                sizes="(min-width: 1024px) 10vw, 20vw"
                className="hp-append__instagram-image"
                loading="lazy"
                decoding="async"
              />
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
};

export default AppendInstagramInspo;
