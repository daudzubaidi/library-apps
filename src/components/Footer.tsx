import { Link } from 'react-router-dom';
import Logo from './Logo';

function TikTokIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
      <path d="M19.59 6.69a4.83 4.83 0 01-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 01-2.88 2.5 2.89 2.89 0 01-2.89-2.89 2.89 2.89 0 012.89-2.89c.28 0 .54.04.79.1V9.01a6.33 6.33 0 00-.79-.05 6.34 6.34 0 00-6.34 6.34 6.34 6.34 0 006.34 6.34 6.34 6.34 0 006.33-6.34V8.69a8.27 8.27 0 004.84 1.55V6.79a4.85 4.85 0 01-1.07-.1z" />
    </svg>
  );
}

function FacebookIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
      <path d="M18 2h-3a5 5 0 00-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 011-1h3z" />
    </svg>
  );
}

function InstagramIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
      <circle cx="12" cy="12" r="4" />
      <circle cx="17.5" cy="6.5" r="1.5" fill="currentColor" stroke="none" />
    </svg>
  );
}

function LinkedInIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
      <path d="M16 8a6 6 0 016 6v7h-4v-7a2 2 0 00-2-2 2 2 0 00-2 2v7h-4v-7a6 6 0 016-6zM2 9h4v12H2z" />
      <circle cx="4" cy="4" r="2" />
    </svg>
  );
}

const SOCIAL_LINKS = [
  { icon: FacebookIcon, label: 'Facebook', href: '#' },
  { icon: InstagramIcon, label: 'Instagram', href: '#' },
  { icon: LinkedInIcon, label: 'LinkedIn', href: '#' },
  { icon: TikTokIcon, label: 'TikTok', href: '#' },
];

export default function Footer() {
  return (
    <footer
      className="mt-[64px] border-t border-solid border-[var(--color-neutral-200)] py-[48px]"
      style={{ backgroundColor: 'white' }}
    >
      <div className="mx-auto flex max-w-[1200px] flex-col items-center gap-[16px] px-[24px]">
        {/* Logo + brand */}
        <Link to="/books" className="flex items-center gap-[10px]">
          <Logo />
          <span className="text-xl font-bold" style={{ fontFamily: 'var(--font-family-quicksand)', color: 'var(--color-neutral-950)' }}>
            Booky
          </span>
        </Link>

        {/* Tagline */}
        <p
          className="max-w-[540px] text-center text-sm font-semibold"
          style={{ fontFamily: 'var(--font-family-quicksand)', color: 'var(--color-neutral-600)' }}
        >
          Discover inspiring stories &amp; timeless knowledge, ready to borrow anytime. Explore online or visit our nearest library branch.
        </p>

        {/* Social */}
        <div className="flex flex-col items-center gap-[12px]">
          <p className="text-sm font-bold" style={{ fontFamily: 'var(--font-family-quicksand)', color: 'var(--color-neutral-950)' }}>
            Follow on Social Media
          </p>
          <div className="flex items-center gap-[16px]">
            {SOCIAL_LINKS.map(({ icon: Icon, label, href }) => (
              <a
                key={label}
                href={href}
                aria-label={label}
                className="flex h-[36px] w-[36px] items-center justify-center rounded-full transition-opacity hover:opacity-70"
                style={{ color: 'var(--color-neutral-700)' }}
              >
                <Icon />
              </a>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}
