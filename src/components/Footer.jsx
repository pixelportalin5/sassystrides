import { Facebook, Instagram, Linkedin } from 'lucide-react';
import { Link } from 'react-router-dom';
import { socialLinks } from '../constants/social';
import { LOGO_URL } from '../constants/subcategories';

const categoryLinks = [
  { label: 'Fashion', path: '/fashion' },
  { label: 'Beauty', path: '/beauty' },
  { label: 'Lifestyle', path: '/lifestyle' },
  { label: 'Trends', path: '/trends' },
  { label: 'News', path: '/news' },
];

const companyLinksColOne = [
  { label: 'About Us', path: '/about' },
  { label: 'Privacy Policy', path: '#' },
  { label: 'Terms of Service', path: '#' },
];

const companyLinksColTwo = [
  { label: 'Contact', path: '/contact' },
  { label: 'Advertise', path: '/advertise' },
];

const socialIconMap = {
  Instagram,
  Facebook,
  LinkedIn: Linkedin,
};

const FooterLink = ({ item, className }) =>
  item.path === '#' ? (
    <a href={item.path} className={className}>
      {item.label}
    </a>
  ) : (
    <Link to={item.path} className={className}>
      {item.label}
    </Link>
  );

const Footer = () => (
  <footer className="site-footer">
    <div className="editorial-container site-footer__inner">
      <div className="site-footer__brand">
        <Link to="/" className="site-footer__logo-link" aria-label="Sassy Strides homepage">
          <img
            src={LOGO_URL}
            alt="Sassy Strides"
            className="site-footer__logo"
            loading="lazy"
            decoding="async"
          />
        </Link>
        <p className="site-footer__follow">Follow Us</p>
        <div className="site-footer__social">
          {socialLinks.map(({ label, href }) => {
            const Icon = socialIconMap[label];

            return (
              <a
                key={label}
                href={href}
                className="site-footer__social-link"
                target="_blank"
                rel="noopener noreferrer"
                aria-label={label}
              >
                <Icon size={18} strokeWidth={1.5} />
              </a>
            );
          })}
        </div>
      </div>

      <nav className="site-footer__categories" aria-label="Footer categories">
        <p className="site-footer__section-title">Categories</p>
        <ul className="site-footer__category-list">
          {categoryLinks.map((item) => (
            <li key={item.label}>
              <FooterLink item={item} className="site-footer__category-link" />
            </li>
          ))}
        </ul>
      </nav>

      <div className="site-footer__company">
        <p className="site-footer__section-title">Company</p>
        <div className="site-footer__company-columns">
          <ul className="site-footer__company-list">
            {companyLinksColOne.map((item) => (
              <li key={item.label}>
                <FooterLink item={item} className="site-footer__company-link" />
              </li>
            ))}
          </ul>
          <ul className="site-footer__company-list">
            {companyLinksColTwo.map((item) => (
              <li key={item.label}>
                <FooterLink item={item} className="site-footer__company-link" />
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>

    <div className="site-footer__copyright">
      © 2026 Sassy Strides
    </div>
  </footer>
);

export default Footer;
