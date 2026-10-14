import { AnimatePresence, motion } from 'framer-motion';
import { useMemo, useState } from 'react';
import { ACCT_ROWS, FAQS, IMG, OCCASIONS, QADDONS, QNAMES, QSTYLES, QTYPES, REVIEWS } from '../data';
import { addDays, dayName, iso, money, round10, zipInfo } from '../lib';
import { AnimatedNumber, EASE, Item, Reveal, Stagger } from '../motion';
import { useOrder } from '../store';
import { LeafMark } from './Header';

export function Occasions() {
  return (
    <section className="sec" id="occasions">
      <div className="wrap">
        <Reveal className="sec-head">
          <h2>One kitchen, every kind of gathering</h2>
          <p>Drop-off for the weekly team lunch, full staff for the gala. Same food, same standards, priced up front.</p>
        </Reveal>
        <Stagger className="occ">
          {OCCASIONS.map((c) => (
            <Item as="a" key={c.h} className="occ-card" href={c.href}>
              <div className="ph"><img src={IMG(c.img)} alt={c.alt} loading="lazy" onError={(e) => (e.target as HTMLImageElement).remove()} /><span className="ph-cap">{c.h}</span></div>
              <div className="occ-body">
                <h3>{c.h}</h3><p>{c.p}</p>
                <div className="occ-meta"><span>From <span className="num">{`$${c.from}`}</span> per guest</span><span className="arrow">{c.cta} →</span></div>
              </div>
            </Item>
          ))}
        </Stagger>
      </div>
    </section>
  );
}

export function Quote() {
  const [step, setStep] = useState(0);
  const [dir, setDir] = useState(1);
  const [type, setType] = useState<string>('wedding');
  const [guests, setGuests] = useState(120);
  const [date, setDate] = useState(() => iso(addDays(new Date(), 200)));
  const [city, setCity] = useState('Dripping Springs');
  const [style, setStyle] = useState('family');
  const [addons, setAddons] = useState<string[]>(['bar', 'dessert']);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [notes, setNotes] = useState('');
  const [err, setErr] = useState('');
  const [done, setDone] = useState(false);

  const est = useMemo(() => {
    const s = QSTYLES.find((x) => x[0] === style)!;
    let lo = s[3], hi = s[4];
    const rows: [string, number, number][] = [[s[1], s[3], s[4]]];
    QADDONS.forEach((a) => { if (addons.includes(a[0])) { lo += a[3]; hi += a[4]; rows.push([a[1], a[3], a[4]]); } });
    const f = guests < 40 ? 1.12 : guests >= 200 ? 0.94 : 1;
    return { lo: Math.round(lo * f), hi: Math.round(hi * f), rows, f };
  }, [style, addons, guests]);

  const submit = () => {
    if (step < 4) { setDir(1); setStep(step + 1); return; }
    if (!name.trim()) { setErr('Add your name so Jordan knows who to write to.'); return; }
    if (!/^\S+@\S+\.\S+$/.test(email)) { setErr('Enter an email like name@company.com so we can send the proposal.'); return; }
    setErr('');
    setDone(true);
  };

  return (
    <section className="sec quote-sec" id="events">
      <div className="wrap">
        <Reveal className="sec-head">
          <h2>Planning something bigger? Price it now.</h2>
          <p>Answer five quick questions and watch the estimate update. A coordinator sends a full proposal within two business hours.</p>
        </Reveal>
        <div className="qb">
          <div className="qb-form">
            <div className="qb-progress" id="qbProgress">{[0, 1, 2, 3, 4].map((k) => <i key={k} className={k <= step || done ? 'on' : ''} />)}</div>
            {done ? (
              <motion.div
                className="qb-done"
                initial={{ opacity: 0, scale: 0.94, y: 12 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                transition={{ type: 'spring', stiffness: 320, damping: 24 }}
              >
                <span className="tick"><svg viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round"><motion.path d="M5 12l5 5 9-10" initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ duration: 0.45, delay: 0.25, ease: 'easeOut' }} /></svg></span>
                <h3 style={{ margin: 0 }}>Got it, {name.split(' ')[0] || 'thanks'}.</h3>
                <p className="muted" style={{ maxWidth: '48ch' }}>Jordan will email {email || 'you'} a full proposal with menus, staffing and a tasting date within two business hours. Your estimate is saved on the right.</p>
                <button type="button" className="btn btn-ghost" onClick={() => { setDone(false); setStep(0); }}>Start another quote</button>
              </motion.div>
            ) : (
              <>
                <div id="qbStep">
                  <AnimatePresence mode="wait" custom={dir} initial={false}>
                    <motion.div
                      key={step} custom={dir}
                      variants={{
                        enter: (d: number) => ({ opacity: 0, x: 36 * d }),
                        center: { opacity: 1, x: 0 },
                        exit: (d: number) => ({ opacity: 0, x: -28 * d }),
                      }}
                      initial="enter"
                      animate="center"
                      exit="exit"
                      transition={{ duration: 0.3, ease: EASE }}
                    >
                      <p className="qb-stepname">{step + 1} of 5 · {QNAMES[step]}</p>
                      {step === 0 && (<><h3>What are you celebrating?</h3><div className="tiles t3">{QTYPES.map((t) => (
                        <motion.button whileTap={{ scale: 0.97 }} key={t[0]} type="button" className="tile" aria-pressed={type === t[0]} onClick={() => setType(t[0])}><b>{t[1]}</b><span>{t[2]}</span></motion.button>))}</div></>)}
                      {step === 1 && (<><h3>How many guests, and when?</h3>
                        <div className="range-wrap">
                          <div className="range-top"><label htmlFor="qGuests" className="muted" style={{ fontSize: 14 }}>Expected guests</label><output className="num"><AnimatedNumber value={guests} /></output></div>
                          <input type="range" id="qGuests" min={20} max={500} step={5} value={guests} onChange={(e) => setGuests(+e.target.value)} />
                          <div className="range-top muted num" style={{ fontSize: 12 }}><span>20</span><span>500</span></div>
                        </div>
                        <div className="qb-fields two" style={{ marginTop: 18 }}>
                          <div className="field"><label htmlFor="qDate">Event date</label><input className="input" type="date" id="qDate" value={date} min={iso(addDays(new Date(), 14))} onChange={(e) => setDate(e.target.value)} /><span className="hint">Staffed events need two weeks notice.</span></div>
                          <div className="field"><label htmlFor="qCity">Venue or city</label><input className="input" id="qCity" value={city} onChange={(e) => setCity(e.target.value)} /></div>
                        </div></>)}
                      {step === 2 && (<><h3>How should we serve it?</h3><div className="tiles t3">{QSTYLES.map((s) => (
                        <motion.button whileTap={{ scale: 0.97 }} key={s[0]} type="button" className="tile" aria-pressed={style === s[0]} onClick={() => setStyle(s[0])}><b>{s[1]}</b><span>{s[2]}</span><span className="num">${s[3]}–${s[4]} per guest</span></motion.button>))}</div></>)}
                      {step === 3 && (<><h3>Anything else to handle?</h3><div className="tiles">{QADDONS.map((a) => (
                        <motion.button whileTap={{ scale: 0.97 }} key={a[0]} type="button" className="tile check-tile" aria-pressed={addons.includes(a[0])}
                          onClick={() => setAddons((p) => (p.includes(a[0]) ? p.filter((x) => x !== a[0]) : [...p, a[0]]))}>
                          <span className="check-box"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round" style={{ color: 'var(--accent-ink)' }}><path d="M5 12l5 5 9-10" /></svg></span>
                          <span style={{ display: 'flex', flexDirection: 'column', gap: 4 }}><b>{a[1]}</b><span>{a[2]}</span><span className="num">+${a[3]}–${a[4]} per guest</span></span>
                        </motion.button>))}</div></>)}
                      {step === 4 && (<><h3>Where should we send the proposal?</h3>
                        <div className="qb-fields two">
                          <div className="field"><label htmlFor="qName">Name</label><input className="input" id="qName" autoComplete="name" value={name} placeholder="Priya Shah" onChange={(e) => setName(e.target.value)} /></div>
                          <div className="field"><label htmlFor="qEmail">Email</label><input className="input" id="qEmail" type="email" autoComplete="email" value={email} placeholder="priya@example.com" onChange={(e) => setEmail(e.target.value)} /></div>
                          <div className="field"><label htmlFor="qPhone">Phone (optional)</label><input className="input" id="qPhone" type="tel" autoComplete="tel" value={phone} placeholder="(555) 987-6543" onChange={(e) => setPhone(e.target.value)} /></div>
                          <div className="field"><label htmlFor="qBudget">Food budget per guest</label><select className="input" id="qBudget"><option>Not sure yet</option><option>Under $40</option><option>$40 to $70</option><option>$70 to $100</option><option>$100+</option></select></div>
                          <div className="field" style={{ gridColumn: '1/-1' }}><label htmlFor="qNotes">Anything we should know?</label><textarea className="input" id="qNotes" placeholder="Dietary needs, cuisine you love, venue kitchen access" value={notes} onChange={(e) => setNotes(e.target.value)} /></div>
                        </div>
                        {!!err && <p style={{ marginTop: 12, fontSize: 13.5, color: 'var(--warn)' }}>{err}</p>}</>)}
                    </motion.div>
                  </AnimatePresence>
                </div>
                <div className="qb-nav" id="qbNav">
                  <button type="button" className="btn btn-ghost" style={{ visibility: step ? 'visible' : 'hidden' }} onClick={() => { setDir(-1); setStep(step - 1); }}>Back</button>
                  <button type="button" className="btn btn-primary" onClick={submit}>{step === 4 ? 'Send my quote request' : 'Continue'}</button>
                </div>
              </>
            )}
          </div>
          <Reveal delay={0.15} className="est-wrap">
            <div className="est" aria-live="polite">
              <h3>Your estimate</h3>
              <div className="est-big" id="estBig">
                <AnimatedNumber value={round10(est.lo * guests)} format={(n) => money(n, 0)} />
                {' – '}
                <AnimatedNumber value={round10(est.hi * guests)} format={(n) => money(n, 0)} />
              </div>
              <div className="est-pp" id="estPP">${est.lo} – ${est.hi} per guest · <AnimatedNumber value={guests} /> guests</div>
              <motion.dl
                id="estDl"
                key={est.rows.map((r) => r[0]).join('|') + est.f}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.35, ease: EASE }}
              >
                {est.rows.map((r) => (<div key={r[0]} style={{ display: 'contents' }}><dt>{r[0]}</dt><dd>${r[1]}–${r[2]}</dd></div>))}
                {est.f !== 1 && (<div style={{ display: 'contents' }}><dt>{est.f > 1 ? 'Small event adjustment' : 'Volume pricing'}</dt><dd>{est.f > 1 ? '+12%' : '−6%'}</dd></div>)}
              </motion.dl>
              <p className="est-note">Estimate covers food, staff and the add-ons you picked. A 20% service charge and 8.25% Texas sales tax are added on the final proposal.</p>
              <div className="est-person"><span className="avatar">JM</span><p><b>Jordan Meyer</b><br />Events lead. Replies to every quote personally.</p></div>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}

export function Corporate() {
  const { reorder, toast } = useOrder();
  return (
    <section className="sec" id="corporate">
      <div className="wrap corp">
        <Reveal>
          <div>
            <h2>An office account for the person who orders lunch</h2>
            <p className="corp-lead">If you feed a team every week, you shouldn't re-enter the address, the allergy list and the card number every time. Open a free account and reorder in one click.</p>
            <Stagger className="perks">
              {[['Net 30 invoicing', 'Monthly statement with PO numbers on every order.'], ['One-click reorders', "Repeat last Tuesday's lunch, adjust the headcount, done."], ['Saved dietary lists', 'Name-labeled boxes for every allergy on your team.'], ['A named coordinator', 'One person who knows your office and your loading dock.']].map(([b, s]) => (
                <Item key={b} className="perk"><span className="perk-ic"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M5 12l5 5 9-10" /></svg></span><div><b>{b}</b><span>{s}</span></div></Item>
              ))}
            </Stagger>
            <div className="corp-cta">
              <button className="btn btn-primary" onClick={() => toast('Demo: office accounts are free — this would open signup.')}>Open an office account</button>
              <a className="link" href="#menu" style={{ alignSelf: 'center' }}>Order without one</a>
            </div>
          </div>
        </Reveal>
        <Reveal delay={0.12}>
          <div className="acct" aria-label="Example account view">
            <div className="acct-head"><div><b>Ledgerline, 4th floor</b><br /><span>Example account view</span></div><span className="pill">Net 30</span></div>
            <Stagger>
              {ACCT_ROWS.map((r) => (
                <Item key={r.t} className="acct-row">
                  <span className="t">{r.t}</span><span className="s">{r.s}</span>
                  <span className="r"><span className="num">${r.price.toFixed(2)}</span><button className="btn btn-ghost btn-sm" onClick={() => reorder(r.id, r.qty)}>Reorder</button></span>
                </Item>
              ))}
            </Stagger>
            <div className="acct-foot"><span>September statement</span><span><b className="num">$1,771.00</b> <span className="muted">Due Oct 30</span></span></div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}

export function Reviews() {
  return (
    <section className="sec" id="reviews">
      <div className="wrap">
        <Reveal className="reviews-top">
          <div className="score"><span className="big">4.9</span><div><span className="stars">★★★★★</span><p>1,240 reviews on Google</p></div></div>
          <h2 style={{ fontSize: 'clamp(1.8rem,3.4vw,2.6rem)' }}>What the people who order say</h2>
        </Reveal>
        <Stagger className="rev-grid">
          {REVIEWS.map((r) => (
            <Item key={r.init} className="rev">
              <blockquote>“{r.q}”</blockquote>
              <div className="rev-who"><span className="avatar">{r.init}</span><div><b>{r.name}</b><span>{r.role}</span></div></div>
              <div className="rev-order">{r.meta}</div>
            </Item>
          ))}
        </Stagger>
      </div>
    </section>
  );
}

export function DeliveryFaq() {
  const [z, setZ] = useState('78759');
  const [res, setRes] = useState(() => zipInfo('78759'));
  const check = (e?: React.FormEvent) => {
    e?.preventDefault();
    const v = z.replace(/\D/g, '').slice(0, 5);
    setZ(v);
    setRes(zipInfo(v));
  };
  return (
    <section className="sec" id="delivery">
      <div className="wrap split">
        <Reveal className="zone">
          <h2>Check if we deliver to you</h2>
          <p className="lead">We cover central Austin and most of the metro. Further out, pickup from our Sample Street kitchen is always free.</p>
          <form className="zip-form" onSubmit={check}>
            <input className="input" aria-label="ZIP code" inputMode="numeric" value={z} onChange={(e) => setZ(e.target.value)} />
            <button className="btn btn-ink" type="submit">Check</button>
          </form>
          <motion.div
            key={`${res.ok}-${res.msg ?? res.zone}`}
            className={`zip-result${res.ok ? ' ok' : ''}`} role="status"
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, ease: EASE }}
          >
            {res.ok ? `Yes, we deliver to ${z}. That's ${res.zone}: $${res.fee} delivery, free over $500, ${res.lead} hours notice.` : res.msg}
          </motion.div>
          <table className="zone-table">
            <thead><tr><th>Zone</th><th>Lead time</th><th>Delivery</th></tr></thead>
            <tbody>
              <tr><td>Central Austin</td><td>48 hours</td><td>$35</td></tr>
              <tr><td>Greater Austin</td><td>48 hours</td><td>$55</td></tr>
              <tr><td>Round Rock, Cedar Park</td><td>72 hours</td><td>$75</td></tr>
            </tbody>
          </table>
        </Reveal>
        <Reveal className="faq-col" id="faq" delay={0.1}>
          <h2>Questions people ask before ordering</h2>
          <div className="faq">
            {FAQS.map((f, k) => (
              <details key={f.q} open={k === 0}>
                <summary>{f.q}</summary>
                <p>{f.a}</p>
              </details>
            ))}
          </div>
        </Reveal>
      </div>
    </section>
  );
}

export function Final() {
  const { date } = useOrder();
  let day = 'Thursday';
  try { day = dayName(date); } catch { /* keep default */ }
  return (
    <section className="final">
      <Stagger className="wrap">
        <Item as="h2">Feed the team on {day}.</Item>
        <Item as="p">Pick the headcount, pick the food, done in two minutes. Your order sheet lands in your inbox right after checkout.</Item>
        <Item className="ctas">
          <a className="btn btn-primary" href="#menu">Start an order</a>
          <a className="btn btn-ghost" href="#events">Get an event quote</a>
        </Item>
      </Stagger>
    </section>
  );
}

export function Footer() {
  return (
    <footer className="site">
      <div className="wrap">
        <div className="foot-grid">
          <div className="brand">
            <a className="logo" href="#top"><LeafMark />Alder</a>
            <p>Catering kitchen at 1234 Sample Street, Austin, TX 78704. Open for pickup 7am to 7pm, Monday to Saturday.</p>
          </div>
          <div><h4>Order</h4><ul><li><a href="#menu">Catering menu</a></li><li><a href="#menu">Boxed lunches</a></li><li><a href="#corporate">Office accounts</a></li><li><a href="#delivery">Delivery area</a></li></ul></div>
          <div><h4>Events</h4><ul><li><a href="#events">Weddings</a></li><li><a href="#events">Corporate events</a></li><li><a href="#events">Private parties</a></li><li><a href="#events">Book a tasting</a></li></ul></div>
          <div><h4>Contact</h4><ul><li className="muted">(555) 123-4567</li><li className="muted">hello@example.com</li><li><a href="#faq">FAQ</a></li></ul></div>
        </div>
        <div className="foot-base"><span>© 2026 Alder Catering Co. By Restaurant Design Guy</span><span>Licensed and insured · Texas food establishment permit</span></div>
      </div>
    </footer>
  );
}
