import { useOrder } from '../store';

const NAV: [string, string, string?][] = [
  ['#menu', 'Order catering', 'Spreads from $16 per guest'],
  ['#events', 'Weddings and events', 'Live estimate in 5 steps'],
  ['#corporate', 'Office accounts', 'Net 30 + one-click reorder'],
  ['#delivery', 'Delivery area', 'Central Austin to Cedar Park'],
  ['#faq', 'FAQ', 'Minimums, changes, allergies'],
];

export function LeafMark() {
  return (
    <span className="logo-mark" aria-hidden="true">
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" style={{ color: 'var(--accent-ink)' }}>
        <path d="M12 21V9" />
        <path d="M12 9c0-3 2-6 6-6 0 3-2 6-6 6Z" />
        <path d="M12 13c0-2.5-1.8-5-5-5 0 2.5 1.8 5 5 5Z" />
      </svg>
    </span>
  );
}

export function Announce() {
  return (
    <div className="announce">
      <div className="wrap">
        <span>Order by <b>2pm</b> for delivery in 48 hours</span>
        <span>Free delivery on orders over $500 in Austin</span>
      </div>
    </div>
  );
}

export function Header() {
  const { cart, setDrawer, navOpen, setNav } = useOrder();
  return (
    <header className="site">
      <div className="wrap">
        <a className="logo" href="#top" aria-label="Alder Catering home"><LeafMark />Alder</a>
        <nav className="main" aria-label="Main">
          <a href="#menu">Order catering</a>
          <a href="#events">Weddings and events</a>
          <a href="#corporate">Office accounts</a>
          <a href="#delivery">Delivery area</a>
          <a href="#faq">FAQ</a>
        </nav>
        <div className="head-right">
          <a className="phone num" href="tel:+15551234567">(555) 123-4567</a>
          <a className="btn btn-ghost btn-sm head-quote" href="#events">Get a quote</a>
          <button className="cart-btn" aria-label="Open your order" onClick={() => setDrawer(true)}>
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
              <path d="M4 7h16l-1.4 11.2a2 2 0 0 1-2 1.8H7.4a2 2 0 0 1-2-1.8L4 7Z" />
              <path d="M9 7a3 3 0 0 1 6 0" />
            </svg>
            {!!cart.length && <span className="cart-count num">{cart.length}</span>}
          </button>
          <button
            className="burger" type="button" aria-label={navOpen ? 'Close menu' : 'Open menu'}
            aria-expanded={navOpen} onClick={() => setNav(!navOpen)}
          ><i /><i /></button>
        </div>
      </div>
    </header>
  );
}

export function NavSheet() {
  const { navOpen, setNav, toast } = useOrder();
  if (!navOpen) return null;
  return (
    <div className="nav-sheet" id="navSheet">
      <nav aria-label="Mobile">
        {NAV.map(([href, label, sub]) => (
          <a key={href} href={href} onClick={() => setNav(false)}>
            <span>{label}</span>
            {sub && <small>{sub}</small>}
          </a>
        ))}
      </nav>
      <div className="nav-sheet-foot">
        <a className="btn btn-primary" href="#events" onClick={() => setNav(false)}>Get a quote</a>
        <button className="btn btn-ghost" onClick={() => { setNav(false); toast('Demo: on Shopify this opens checkout with the event details attached to the order.'); }}>
          Call (555) 123-4567
        </button>
        <p className="muted">Pickup 7am–7pm Mon–Sat · 1234 Sample Street</p>
      </div>
    </div>
  );
}
