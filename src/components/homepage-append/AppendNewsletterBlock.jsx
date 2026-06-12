import LazyAdSlot from '../ads/LazyAdSlot';

const AppendNewsletterBlock = () => (
  <section className="hp-append__section hp-append__section--newsletter" aria-label="Newsletter signup">
    <div className="hp-append__container">
      <div className="hp-append__newsletter-banner" aria-label="Advertisement">
        <LazyAdSlot page="homepage" slot={13} variant="inline-banner" />
      </div>

      <div className="hp-append__newsletter-form">
        <p className="hp-append__newsletter-eyebrow">Weekly Muse</p>
        <h2 className="hp-append__newsletter-title">Never Miss The Next Trend.</h2>
        <p className="hp-append__newsletter-description">
          Receive runway notes, celebrity looks, beauty edits, and refined style inspiration
          curated for the modern wardrobe.
        </p>
        <form className="hp-append__newsletter-input-row">
          <input
            type="email"
            required
            placeholder="Enter your email address"
            className="hp-append__newsletter-input"
            aria-label="Email address"
          />
          <button type="submit" className="hp-append__newsletter-submit">
            Subscribe
          </button>
        </form>
      </div>
    </div>
  </section>
);

export default AppendNewsletterBlock;
