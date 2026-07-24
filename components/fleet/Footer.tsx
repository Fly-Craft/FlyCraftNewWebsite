import Link from "next/link";

export default function Footer({ variant = 'dark' }: { variant?: 'dark' | 'light' }) {
  return (
    <footer className={`footer footer--${variant}`} style={variant === 'light' ? { background: 'transparent' } : undefined}>
      <div className="footer-copy-group">
        <div className="footer-copy">&copy; 2026 CRAFT. All rights reserved.</div>
        <div className="footer-links">
          <Link href="/faq" className="footer-link">FAQ</Link>
          <Link href="/legal" className="footer-link">Legal</Link>
          <Link href="/reviews" className="footer-link">Reviews</Link>
        </div>
      </div>
      <div className="footer-logo">
        <img src="/assets/Logo No.png" alt="Craft" className="footer-logo-img" />
      </div>
    </footer>
  );
}
