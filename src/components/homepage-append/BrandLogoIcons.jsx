const logoProps = {
  className: 'hp-append__brand-mark',
  'aria-hidden': true,
};

export const LouisVuittonLogo = () => (
  <svg viewBox="0 0 64 32" fill="none" {...logoProps}>
    <path
      d="M8 26V6h5.2l4.8 12.4L22.8 6H28v20h-4.6V13.2L18.8 26h-3.2L10.6 13.4V26H8zm24 0V6h8.4c3.4 0 5.8 1.8 5.8 5.1 0 2.2-1.2 3.8-3.2 4.5L48.8 26h-5.2l-4.8-9.6h-2.2V26H32zm4.6-13.2h3.2c1.4 0 2.2-.7 2.2-1.9s-.8-1.9-2.2-1.9h-3.2v3.8z"
      fill="currentColor"
    />
  </svg>
);

export const GucciLogo = () => (
  <svg viewBox="0 0 64 32" fill="none" {...logoProps}>
    <path
      d="M18.5 16c0-4.8 3.8-8.6 8.5-8.6s8.5 3.8 8.5 8.6-3.8 8.6-8.5 8.6-8.5-3.8-8.5-8.6zm11.2 0c0-1.6-1.2-2.8-2.7-2.8s-2.7 1.2-2.7 2.8 1.2 2.8 2.7 2.8 2.7-1.2 2.7-2.8zM35 16c0-4.8 3.8-8.6 8.5-8.6s8.5 3.8 8.5 8.6-3.8 8.6-8.5 8.6S35 20.8 35 16zm11.2 0c0-1.6-1.2-2.8-2.7-2.8s-2.7 1.2-2.7 2.8 1.2 2.8 2.7 2.8 2.7-1.2 2.7-2.8z"
      fill="currentColor"
    />
  </svg>
);

export const PradaLogo = () => (
  <svg viewBox="0 0 64 32" fill="none" {...logoProps}>
    <path d="M32 5 18 27h6.5l3.5-6h8l3.5 6H46L32 5zm0 9.5 3.2 5.5h-6.4L32 14.5z" fill="currentColor" />
  </svg>
);

export const DiorLogo = () => (
  <svg viewBox="0 0 64 32" fill="none" {...logoProps}>
    <path
      d="M10 22V10h4.8l5.8 8.4V10h4.2v12h-4.6l-6-8.6V22H10zm22.2 0 6.8-12h5l6.8 12h-4.8l-1.1-2h-7l-1.1 2h-4.6zm5.4-4.8h4.4l-2.2-3.8-2.2 3.8z"
      fill="currentColor"
    />
  </svg>
);

export const ChanelLogo = () => (
  <svg viewBox="0 0 64 32" fill="none" {...logoProps}>
    <path
      d="M20 8c-4.2 0-7.5 3.3-7.5 8s3.3 8 7.5 8c2.2 0 4.1-.9 5.5-2.4l2.8 2.8c-2.1 2-4.9 3.2-8.3 3.2-6.1 0-11-4.9-11-11S13.9 5 20 5c3.4 0 6.2 1.2 8.3 3.2l-2.8 2.8C24.1 8.9 22.2 8 20 8zm24 0c-4.2 0-7.5 3.3-7.5 8s3.3 8 7.5 8c2.2 0 4.1-.9 5.5-2.4l2.8 2.8c-2.1 2-4.9 3.2-8.3 3.2-6.1 0-11-4.9-11-11S37.9 5 44 5c3.4 0 6.2 1.2 8.3 3.2l-2.8 2.8C48.1 8.9 46.2 8 44 8z"
      fill="currentColor"
    />
  </svg>
);

export const SaintLaurentLogo = () => (
  <svg viewBox="0 0 64 32" fill="none" {...logoProps}>
    <path
      d="M32 6 22 26h4.2l2.1-4.6h11.4L41.8 26H46L36 6h-4zm-1.2 14.2 3.8-8.4 3.8 8.4H30.8z"
      fill="currentColor"
    />
  </svg>
);

export const CartierLogo = () => (
  <svg viewBox="0 0 64 32" fill="none" {...logoProps}>
    <path
      d="M12 22c0-5.2 4-9.2 9.6-9.2 2.8 0 5.1 1.1 6.7 3l-3.2 2.8c-.9-1-2.1-1.6-3.5-1.6-2.8 0-4.9 2.1-4.9 4.9s2.1 4.9 4.9 4.9c1.4 0 2.6-.6 3.5-1.6l3.2 2.8c-1.6 1.9-3.9 3-6.7 3C16 31.2 12 27.2 12 22zm22.4-9.2h4.2v14.4h7.2V26H34.6V12.8z"
      fill="currentColor"
    />
  </svg>
);

const BRAND_LOGOS = {
  'Louis Vuitton': LouisVuittonLogo,
  Gucci: GucciLogo,
  Prada: PradaLogo,
  Dior: DiorLogo,
  Chanel: ChanelLogo,
  'Saint Laurent': SaintLaurentLogo,
  Cartier: CartierLogo,
};

export default BRAND_LOGOS;
