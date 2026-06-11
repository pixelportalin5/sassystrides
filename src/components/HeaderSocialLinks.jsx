import { Facebook, Instagram, Linkedin } from 'lucide-react';
import { memo } from 'react';
import { socialLinks } from '../constants/social';

const iconMap = {
  Instagram,
  Facebook,
  LinkedIn: Linkedin,
};

const HeaderSocialLinks = () => (
  <div className="site-header__social">
    {socialLinks.map(({ label, href, followers }) => {
      const Icon = iconMap[label];

      return (
        <a
          key={label}
          href={href}
          className="site-header__social-link"
          target="_blank"
          rel="noopener noreferrer"
          aria-label={`${label}, ${followers} followers`}
        >
          <Icon size={16} strokeWidth={1.4} aria-hidden="true" />
          <span className="site-header__social-count">{followers}</span>
        </a>
      );
    })}
  </div>
);

export default memo(HeaderSocialLinks);
