/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      // Apple-derived design tokens (see docs/analysis/apple-iphone-grid-card-analysis.md)
      colors: {
        apple: {
          blue: '#0071E3', // primary CTA — the only high-saturation color per card
          ink: '#1D1D1F', // headings / body / secondary CTA
          tag: '#F56300', // eyebrow tag
          page: '#FFFFFF', // card surface
        },
      },
      borderRadius: {
        card: '18px',
        pill: '980px',
      },
      boxShadow: {
        card: '2px 4px 12px 0 rgba(0, 0, 0, 0.08)',
        'card-hover': '0 8px 24px 0 rgba(0, 0, 0, 0.14)',
      },
      transitionTimingFunction: {
        apple: 'cubic-bezier(0, 0, 0.5, 1)',
      },
      spacing: {
        scroller: '38px',
      },
      maxWidth: {
        nav: '1300px',
      },
    },
  },
  plugins: [],
};
