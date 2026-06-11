import AdSlot from './ads/AdSlot';

const Newsletter = ({ topSlot, rightSlot }) => (
  <section className="editorial-container editorial-section">
    {topSlot ? <AdSlot page="homepage" slot={topSlot} variant="newsletter-top" /> : null}

    <div className="grid overflow-hidden border border-ink/10 bg-porcelain lg:grid-cols-[1fr_minmax(220px,280px)]">
      <div className="flex flex-col justify-center p-8 text-center sm:p-12">
        <p className="micro-label mb-4 text-bronze">Weekly Muse</p>
        <h2 className="serif-title text-5xl leading-none text-espresso sm:text-7xl">
          Never Miss The Next Trend.
        </h2>
        <p className="mx-auto mt-5 max-w-xl text-sm leading-7 text-taupe">
          Receive runway notes, celebrity looks, beauty edits, and refined style
          inspiration curated for the modern wardrobe.
        </p>
        <form className="mx-auto mt-7 flex w-full max-w-xl flex-col border border-ink/15 bg-ivory sm:flex-row">
          <input
            type="email"
            required
            placeholder="Enter your email address"
            className="min-h-12 flex-1 bg-transparent px-5 text-sm outline-none placeholder:text-taupe/70"
          />
          <button
            type="submit"
            className="btn-cta btn-cta--primary w-full sm:w-auto"
          >
            Subscribe
          </button>
        </form>
      </div>

      <div className="newsletter-ad-slot flex items-center justify-center border-t border-ink/10 bg-champagne/35 p-4 lg:border-l lg:border-t-0">
        {rightSlot ? <AdSlot page="homepage" slot={rightSlot} variant="newsletter-right" /> : null}
      </div>
    </div>
  </section>
);

export default Newsletter;
