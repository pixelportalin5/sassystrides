import Navbar from '../Navbar';

const Pulse = ({ className = '' }) => (
  <div className={`animate-pulse bg-espresso/10 ${className}`.trim()} />
);

const HomeSkeleton = () => (
  <div className="min-h-screen bg-ivory text-ink">
    <Navbar />
    <main className="homepage-magazine pb-20 lg:pb-8">
      <section className="hero-section editorial-container grid border-x border-b border-ink/10 bg-paper-grain lg:grid-cols-[1.02fr_1.48fr_0.82fr]">
        <div className="hero-section__content border-b border-ink/10 p-8 lg:border-b-0 lg:border-r">
          <Pulse className="mb-5 h-4 w-40" />
          <Pulse className="h-24 w-full max-w-xl" />
          <Pulse className="mt-6 h-16 w-full max-w-md" />
          <div className="mt-8 flex gap-3">
            <Pulse className="h-[46px] w-36" />
            <Pulse className="h-[46px] w-36" />
          </div>
        </div>
        <Pulse className="hero-section__image border-b border-ink/10 lg:border-b-0 lg:border-r" />
        <div className="hero-section__sidebar space-y-0 divide-y divide-ink/10">
          {[0, 1, 2, 3].map((item) => (
            <Pulse key={item} className="h-24 w-full bg-champagne/40" />
          ))}
        </div>
      </section>

      <div className="editorial-container space-y-10 py-10">
        <Pulse className="h-28 w-full" />
        <div className="homepage-category-section__layout">
          <div className="space-y-4">
            <div className="homepage-category-grid">
              {[0, 1, 2, 3, 4].map((item) => (
                <Pulse
                  key={item}
                  className={`homepage-category-grid__tile min-h-[220px] ${
                    item < 3
                      ? 'homepage-category-grid__tile--third'
                      : 'homepage-category-grid__tile--half'
                  }`}
                />
              ))}
            </div>
            <Pulse className="h-24 w-full" />
            <div className="homepage-category-section__layout homepage-category-section__layout--billboard">
              <Pulse className="h-24 w-full" />
              <Pulse className="hidden min-h-[280px] lg:block" />
            </div>
          </div>
          <div className="hidden space-y-4 lg:block">
            <Pulse className="h-[420px] w-full" />
            <Pulse className="h-[420px] w-full" />
          </div>
        </div>
      </div>
    </main>
  </div>
);

export default HomeSkeleton;
