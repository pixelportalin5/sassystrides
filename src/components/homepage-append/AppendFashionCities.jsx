import { Link } from 'react-router-dom';
import LazyAdSlot from '../ads/LazyAdSlot';

const CITIES = [
  {
    name: 'Paris',
    slug: 'paris',
    image:
      'https://images.unsplash.com/photo-1502602898657-3e91760cbb34?auto=format&fit=crop&w=640&q=80',
  },
  {
    name: 'Milan',
    slug: 'milan',
    image:
      'https://images.unsplash.com/photo-1513581166391-887a96ddeafd?auto=format&fit=crop&w=640&q=80',
  },
  {
    name: 'London',
    slug: 'london',
    image:
      'https://images.unsplash.com/photo-1513635269975-59663e0ac1ad?auto=format&fit=crop&w=640&q=80',
  },
  {
    name: 'New York',
    slug: 'new-york',
    image:
      'https://images.unsplash.com/photo-1496442226666-8d4d0e62e6e9?auto=format&fit=crop&w=640&q=80',
  },
  {
    name: 'Los Angeles',
    slug: 'los-angeles',
    image:
      'https://images.unsplash.com/photo-1533174072545-7a4b6ad7a6c3?auto=format&fit=crop&w=640&q=80',
  },
];

const AppendFashionCities = () => (
  <section className="hp-append__section hp-append__section--cities" aria-label="Fashion cities">
    <div className="hp-append__container">
      <div className="hp-append__cities-banner" aria-label="Advertisement">
        <LazyAdSlot page="homepage" slot={9} variant="inline-banner" />
      </div>

      <h2 className="hp-append__cities-title">Fashion Cities</h2>

      <div className="hp-append__cities-grid">
        {CITIES.map((city) => (
          <Link key={city.slug} to="/lifestyle" className="hp-append__city-card">
            <img
              src={city.image}
              alt={`${city.name} fashion city`}
              className="hp-append__city-image"
              loading="lazy"
              decoding="async"
            />
            <span className="hp-append__city-overlay" aria-hidden="true" />
            <span className="hp-append__city-name">{city.name}</span>
          </Link>
        ))}
      </div>
    </div>
  </section>
);

export default AppendFashionCities;
