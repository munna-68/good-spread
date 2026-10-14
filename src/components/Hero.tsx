import { AnimatePresence, motion, useAnimationControls } from 'framer-motion';
import { useEffect, useRef, useState } from 'react';
import heroBg1672 from '../assets/hero-buffet-spread-1672.webp';
import heroBg900 from '../assets/hero-buffet-spread-900.webp';
import heroMobile940 from '../assets/hero-sunlit-table-940.webp';
import heroMobile700 from '../assets/hero-sunlit-table-700.webp';
import { IMG, LOGOS } from '../data';
import { TIMES, fmtTime, fmtTimeShort, mealFor, zipInfo } from '../lib';
import { AnimatedNumber, EASE, Item, Reveal, Stagger } from '../motion';
import { useOrder } from '../store';

function useCarousel(n: number, ms = 5000) {
  const [i, setI] = useState(0);
  const [paused, setPaused] = useState(false);
  useEffect(() => {
    if (paused) return;
    const t = setInterval(() => setI((v) => (v + 1) % n), ms);
    return () => clearInterval(t);
  }, [n, ms, paused]);
  return { i, go: setI, paused, setPaused };
}

export function Hero() {
  const o = useOrder();
  const { i: slide, go } = useCarousel(3);
  const formRef = useRef<HTMLFormElement>(null);
  const pop = useAnimationControls();
  const firstPop = useRef(true);

  useEffect(() => {
    const el = formRef.current;
    if (!el || !('IntersectionObserver' in window)) return;
    const ob = new IntersectionObserver((es) => o.setPlannerVisible(es[0].isIntersecting), { threshold: 0 });
    ob.observe(el);
    return () => ob.disconnect();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // jump to slide 1 when planner changes
  useEffect(() => { go(0); }, [o.bumpKey, go]);

  // pop the stepper whenever the guest count changes
  useEffect(() => {
    if (firstPop.current) { firstPop.current = false; return; }
    pop.start({ scale: [1, 1.06, 1], transition: { duration: 0.3, ease: 'easeOut' } });
  }, [o.guests, pop]);

  const zi = zipInfo(o.zip);
  const lead72 = zi.ok && zi.lead === 72 && o.mode === 'delivery';

  return (
    <section className="hero">
      <div className="wrap">
        <div className="hero-top">
          <div className="hero-grid">
          <motion.div
            className="hero-bg" aria-hidden="true"
            initial={{ opacity: 0, scale: 1.05 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1.5, ease: 'easeOut' }}
          >
            <picture>
              <source media="(max-width: 999px)" srcSet={`${heroMobile700} 700w, ${heroMobile940} 940w`} sizes="100vw" />
              <img
                src={heroBg1672}
                srcSet={`${heroBg900} 900w, ${heroBg1672} 1672w`}
                sizes="100vw"
                alt=""
                decoding="async"
                onError={(e) => (e.target as HTMLImageElement).remove()}
              />
            </picture>
          </motion.div>
          <div className="hero-copy">
            <motion.h1
              className="hero-rot" id="heroRot"
              initial={{ opacity: 0, y: 28 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.1, ease: EASE }}
            >
              <span className={`slide${slide === 0 ? ' is-on' : ''}`} aria-hidden={slide !== 0}>
                <span>{mealFor(o.time)}</span> for <span className="live"><AnimatedNumber value={o.guests} /></span>,<br />
                set up by <span className="live">{fmtTimeShort(o.time)}</span>.
              </span>
              <span className={`slide${slide === 1 ? ' is-on' : ''}`} aria-hidden={slide !== 1}>
                Catering for 10 to 500, ordered in <span className="live">two minutes</span>.
              </span>
              <span className={`slide${slide === 2 ? ' is-on' : ''}`} aria-hidden={slide !== 2}>
                Every dish labeled. Every order <span className="live">on time</span>.
              </span>
            </motion.h1>
            <motion.div
              className="rot-dots" role="group" aria-label="Choose headline"
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.5, delay: 0.45 }}
            >
              {[0, 1, 2].map((k) => (
                <button key={k} type="button" aria-label={`Headline ${k + 1}`} aria-pressed={slide === k} onClick={() => go(k)} />
              ))}
            </motion.div>
            <motion.p
              className="hero-sub"
              initial={{ opacity: 0, y: 22 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.28, ease: EASE }}
            >
              Austin's office and event caterer. Pick your headcount, choose a spread, and we deliver, set up and label every dish.
            </motion.p>
            <div className="trust">
              <div><strong className="num">4.9</strong><span><span className="stars" aria-hidden="true">★★★★★</span><br />1,240 Google reviews</span></div>
              <div><strong className="num">98.7%</strong><span>orders on time in the last 12 months</span></div>
              <div><strong className="num">3,400+</strong><span>office lunches</span></div>
              <div><strong className="num">10–500</strong><span>guests per order</span></div>
            </div>
          </div>

          <motion.form
            ref={formRef} className="planner" id="planner" aria-labelledby="plannerTitle"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.42, ease: EASE }}
            onSubmit={(e) => { e.preventDefault(); document.getElementById('menu')?.scrollIntoView({ behavior: 'smooth' }); }}
          >
            <div>
              <h2 id="plannerTitle">Plan your order</h2>
              <p className="planner-sub">Prices update to your headcount as you go.</p>
            </div>
            <div className="field">
              <label htmlFor="pGuests">How many guests?</label>
              <div className="stepper">
                <button type="button" aria-label="Five fewer guests" onClick={() => o.stepGuests(-5)}>−</button>
                <motion.input id="pGuests" type="number" inputMode="numeric" min={8} max={500} value={o.guests}
                  animate={pop}
                  onChange={(e) => { if (e.target.value !== '') o.setGuests(+e.target.value); }}
                  onBlur={(e) => { e.target.value = String(o.guests); }} />
                <button type="button" aria-label="Five more guests" onClick={() => o.stepGuests(5)}>+</button>
              </div>
            </div>
            <div className="row2">
              <div className="field">
                <label htmlFor="pDate">Date</label>
                <input className="input" id="pDate" type="date" min={o.dateMin} max={o.dateMax} value={o.date}
                  onChange={(e) => o.setDate(e.target.value)} />
              </div>
              <div className="field">
                <label htmlFor="pTime">Serve time</label>
                <select className="input" id="pTime" value={o.time} onChange={(e) => o.setTime(e.target.value)}>
                  {TIMES.map((t) => <option key={t} value={t.slice(0, 5)}>{fmtTime(t.slice(0, 5))}</option>)}
                </select>
              </div>
            </div>
            <div className="field">
              <span className="lbl" id="modeLbl">Delivery or pickup</span>
              <div className="seg" role="group" aria-labelledby="modeLbl">
                <button type="button" aria-pressed={o.mode === 'delivery'} onClick={() => o.setMode('delivery')}>
                  {o.mode === 'delivery' && <motion.span layoutId="seg-pill" className="seg-pill" transition={{ type: 'spring', stiffness: 500, damping: 38 }} />}
                  <span className="seg-label">Delivery and setup</span>
                </button>
                <button type="button" aria-pressed={o.mode === 'pickup'} onClick={() => o.setMode('pickup')}>
                  {o.mode === 'pickup' && <motion.span layoutId="seg-pill" className="seg-pill" transition={{ type: 'spring', stiffness: 500, damping: 38 }} />}
                  <span className="seg-label">Pickup</span>
                </button>
              </div>
            </div>
            <AnimatePresence initial={false}>
              {o.mode === 'delivery' && (
                <motion.div
                  key="zip" className="field" id="zipField"
                  initial={{ height: 0, opacity: 0, marginBottom: -18 }}
                  animate={{ height: 'auto', opacity: 1, marginBottom: 0 }}
                  exit={{ height: 0, opacity: 0, marginBottom: -18 }}
                  transition={{ duration: 0.32, ease: EASE }}
                  style={{ overflow: 'hidden' }}
                >
                  <label htmlFor="pZip">Delivery ZIP code</label>
                  <input className="input num" id="pZip" inputMode="numeric" maxLength={5} value={o.zip}
                    autoComplete="postal-code" onChange={(e) => o.setZip(e.target.value)} />
                  <span className="hint" style={zi.ok ? undefined : { color: 'var(--warn)' }}>
                    {zi.ok ? `We deliver to ${o.zip}. Delivery is $${zi.fee}, free over $500.` : zi.msg}
                  </span>
                </motion.div>
              )}
            </AnimatePresence>
            <div className="lead-note">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><circle cx="12" cy="12" r="9" /><path d="M12 7v5l3 2" /></svg>
              <span>{lead72 ? 'Your area needs 72 hours notice. Earlier dates are greyed out.' : 'Earliest date is 48 hours out. Need it sooner? Call us and we\u2019ll try.'}</span>
            </div>
            <button className="btn btn-primary" type="submit">See the menu for <span className="num"><AnimatedNumber value={o.guests} /></span> guests</button>
            <div className="planner-foot"><span>Wedding or 100+ guests?</span><a className="link" href="#events">Get a custom quote</a></div>
          </motion.form>
          </div>
        </div>

        <Stagger className="mosaic">
          <Item className="ph"><img src={IMG('32689477', 1400)} alt="Catering buffet with chafing dishes set up on a long table" loading="eager" onError={(e) => (e.target as HTMLImageElement).remove()} /><span className="ph-cap">Buffet setup photo</span></Item>
          <Item className="ph"><img src={IMG('34227771', 900)} alt="Bright grain bowl with vegetables" loading="lazy" onError={(e) => (e.target as HTMLImageElement).remove()} /><span className="ph-cap">Grain bowl photo</span></Item>
          <Item className="ph"><img src={IMG('6995246', 700)} alt="Group of people sharing a meal" loading="lazy" onError={(e) => (e.target as HTMLImageElement).remove()} /><span className="ph-cap">Team lunch photo</span></Item>
        </Stagger>
      </div>
    </section>
  );
}

export function Logos() {
  return (
    <div className="logos">
      <div className="wrap">
        <p>Feeding teams at</p>
        <div className="marquee">
          <div className="marquee-track">
            {[0, 1].map((copy) => (
              <div className="marquee-half" key={copy} aria-hidden={copy === 1 || undefined}>
                {LOGOS.map((l) => (
                  <span key={`${copy}-${l.name}`} className={`wordmark${l.variant ? ` ${l.variant}` : ''}`}>{l.name}</span>
                ))}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export function Steps() {
  return (
    <section className="sec">
      <div className="wrap">
        <Reveal className="sec-head">
          <h2>Ordering for 40 should take two minutes</h2>
          <p>Everything a catering coordinator would ask you on the phone is built into the order. You get a confirmed time, a fixed price and an order sheet you can forward to finance.</p>
        </Reveal>
        <Stagger className="steps">
          <Item className="step"><span className="n">Step 1</span><h3>Set your headcount and time</h3><p>We only show dates we can actually deliver, and we scale every package to your guest count.</p></Item>
          <Item className="step"><span className="n">Step 2</span><h3>Pick a spread or two</h3><p>Filter by vegan, gluten free or dairy free. Every dish arrives labeled with allergens.</p></Item>
          <Item className="step"><span className="n">Step 3</span><h3>Pay or invoice, then relax</h3><p>Card at checkout, or Net 30 invoicing on an office account. We text the driver's ETA on the day.</p></Item>
        </Stagger>
      </div>
    </section>
  );
}
