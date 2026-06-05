import { Link } from 'react-router-dom';

const footerGroups = {
  Fashion: ['Runway', 'Street Style', 'Celebrity', 'Shopping'],
  Beauty: ['Makeup', 'Skincare', 'Hair', 'Fragrance'],
  Lifestyle: ['Culture', 'Travel', 'Interiors', 'Wellness'],
  Trends: ['Seasonal', 'Accessories', 'Editors Picks', 'Moodboard'],
  News: ['Magazine', 'Interviews', 'Events', 'Archives'],
};

const Footer = () => (
  <footer className="mt-8 border-t border-ink/10 bg-parchment">
    <div className="editorial-container grid gap-10 py-10 lg:grid-cols-[1.2fr_2fr]">
      <div>
        <Link to="/" className="serif-title text-4xl uppercase leading-none tracking-[0.08em]">
          Sassy Strides
        </Link>
        <p className="mt-4 max-w-sm text-sm leading-7 text-taupe">
          A refined digital fashion magazine for elevated style, contemporary
          beauty, and editorial culture.
        </p>
        <p className="mt-6 text-[0.62rem] uppercase tracking-[0.22em] text-taupe">
          © 2026 Sassy Strides
        </p>
      </div>
      <div className="grid grid-cols-2 gap-7 sm:grid-cols-5">
        {Object.entries(footerGroups).map(([title, links]) => (
          <div key={title}>
            <h3 className="micro-label mb-4 text-espresso">{title}</h3>
            <ul className="space-y-2">
              {links.map((item) => (
                <li key={item}>
                  <a className="text-xs text-taupe transition hover:text-bronze" href="/">
                    {item}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </div>
    <div className="border-t border-ink/10 py-4 text-center text-[0.62rem] uppercase tracking-[0.2em] text-taupe">
      Privacy Policy · Terms & Conditions · Editorial Standards
    </div>
  </footer>
);

export default Footer;
