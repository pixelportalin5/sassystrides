import Navbar from '../Navbar';

const Pulse = ({ className = '' }) => (
  <div className={`animate-pulse bg-espresso/10 ${className}`.trim()} />
);

const HomeSkeleton = () => (
  <div className="min-h-screen bg-ivory text-ink">
    <Navbar />
    <main className="homepage-magazine pb-20 lg:pb-8">
      <section className="editorial-container grid border-x border-b border-ink/10 bg-paper-grain lg:grid-cols-[1.02fr_1.48fr_0.82fr]">
        <div className="min-h-[520px] border-b border-ink/10 p-8 lg:border-b-0 lg:border-r">
          <Pulse className="mb-5 h-4 w-40" />
          <Pulse className="h-24 w-full max-w-xl" />
          <Pulse className="mt-6 h-16 w-full max-w-md" />
          <div className="mt-8 flex gap-3">
            <Pulse className="h-11 w-36" />
            <Pulse className="h-11 w-36" />
          </div>
        </div>
        <Pulse className="min-h-[520px] border-b border-ink/10 lg:border-b-0 lg:border-r" />
        <div className="min-h-[520px] space-y-0 divide-y divide-ink/10">
          {[0, 1, 2, 3].map((item) => (
            <Pulse key={item} className="h-24 w-full bg-champagne/40" />
          ))}
        </div>
      </section>

      <div className="editorial-container space-y-16 py-16">
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          {[0, 1, 2, 3].map((item) => (
            <div key={item} className="space-y-4 border border-ink/10 bg-porcelain p-4">
              <Pulse className="aspect-[1.12/1] w-full bg-champagne/50" />
              <Pulse className="h-4 w-20" />
              <Pulse className="h-8 w-full" />
            </div>
          ))}
        </div>
      </div>
    </main>
  </div>
);

export default HomeSkeleton;
