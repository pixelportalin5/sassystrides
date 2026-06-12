import BRAND_LOGOS from './BrandLogoIcons';

const BRANDS = [
  'Louis Vuitton',
  'Gucci',
  'Prada',
  'Dior',
  'Chanel',
  'Saint Laurent',
  'Cartier',
];

const AppendBrandStrip = () => (
  <section className="hp-append__brand-strip" aria-label="Partner brands">
    <div className="hp-append__container hp-append__brand-strip-inner">
      {BRANDS.map((brand) => {
        const Logo = BRAND_LOGOS[brand];

        return (
          <div key={brand} className="hp-append__brand-item">
            <Logo />
            <span className="hp-append__brand-name">{brand}</span>
          </div>
        );
      })}
    </div>
  </section>
);

export default AppendBrandStrip;
