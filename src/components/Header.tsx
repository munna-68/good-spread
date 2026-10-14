import { AnimatePresence, motion } from 'framer-motion';
import { useOrder } from '../store';
import { EASE } from '../motion';

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
      <svg viewBox="2 1 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
        <rect x="2" y="1" width="40" height="40" rx="11" fill="#114B2B" />
        <path fillRule="evenodd" clipRule="evenodd" d="M19.3 9.5H24.7L33.2 32.5H28.0L26.2 27.2H17.8L16.0 32.5H10.8L19.3 9.5ZM19.2 23.0H24.8L22.0 14.6L19.2 23.0Z" fill="#FFFFFF" />
        <path d="M22.0 23.2C22.0 18.6 25.8 15.2 30.8 15.2C30.8 19.8 27.0 23.2 22.0 23.2Z" fill="#86EFAC" />
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
            {!!cart.length && (
              <motion.span
                key={cart.length}
                className="cart-count num"
                initial={{ scale: 0.4, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ type: 'spring', stiffness: 600, damping: 22 }}
              >
                {cart.length}
              </motion.span>
            )}
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
  return (
    <AnimatePresence>
      {navOpen && (
        <motion.div
          className="nav-sheet" id="navSheet"
          initial={{ opacity: 0, y: -14 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -14 }}
          transition={{ duration: 0.28, ease: EASE }}
        >
          <motion.nav
            aria-label="Mobile"
            initial="off"
            animate="on"
            variants={{ off: {}, on: { transition: { staggerChildren: 0.05, delayChildren: 0.08 } } }}
          >
            {NAV.map(([href, label, sub]) => (
              <motion.a
                key={href} href={href} onClick={() => setNav(false)}
                variants={{ off: { opacity: 0, y: 14 }, on: { opacity: 1, y: 0, transition: { duration: 0.35, ease: EASE } } }}
              >
                <span>{label}</span>
                {sub && <small>{sub}</small>}
              </motion.a>
            ))}
          </motion.nav>
          <div className="nav-sheet-foot">
            <a className="btn btn-primary" href="#events" onClick={() => setNav(false)}>Get a quote</a>
            <button className="btn btn-ghost" onClick={() => { setNav(false); toast('Demo: on Shopify this opens checkout with the event details attached to the order.'); }}>
              Call (555) 123-4567
            </button>
            <p className="muted">Pickup 7am–7pm Mon–Sat · 1234 Sample Street</p>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
