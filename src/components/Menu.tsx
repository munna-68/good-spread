import { CATS, DIETS, DIET_LABEL, IMG, PACKAGES } from '../data';
import { FREE_DEL, MIN_ORDER, TIMES, fmtDate, fmtTime, money } from '../lib';
import { MIN_ORDER as MIN, useOrder } from '../store';

function MiniStep({ qty, onMinus, onPlus, label }: { qty: number; onMinus: () => void; onPlus: () => void; label: string }) {
  return (
    <span className="mini-step">
      <button type="button" aria-label={`One fewer ${label}`} onClick={onMinus}>−</button>
      <output className="num">{qty}</output>
      <button type="button" aria-label={`One more ${label}`} onClick={onPlus}>+</button>
    </span>
  );
}

export function MenuSection() {
  const o = useOrder();
  const list = PACKAGES.filter(
    (p) => (o.cat === 'all' || p.cat === o.cat) && o.diets.every((d) => p.diet.includes(d)),
  );
  return (
    <section className="sec menu-sec" id="menu">
      <div className="wrap">
        <div className="sec-head">
          <h2>The catering menu</h2>
          <p>Priced per guest. Each package includes plates, napkins, utensils and serving tools at no charge.</p>
        </div>
        <div className="eventbar" id="eventbar">
          <div className="eventbar-in">
            <span className="ev-chip">Guests <MiniStep qty={o.guests} label="guest" onMinus={() => o.stepGuests(-1)} onPlus={() => o.stepGuests(1)} /></span>
            <span className="ev-chip">Date <b>{fmtDate(o.date)}</b></span>
            <span className="ev-chip">Time <b>{fmtTime(o.time)}</b></span>
            <span className="ev-chip"><b>{o.mode === 'delivery' ? `Delivery to ${o.zip}` : 'Pickup, Sample Street'}</b></span>
            <a className="link" href="#top">Change</a>
          </div>
        </div>
        <div className="filters" role="group" aria-label="Filter by course">
          {CATS.map((c) => (
            <button key={c.id} className="chip" aria-pressed={o.cat === c.id} onClick={() => o.setCat(c.id)}>{c.label}</button>
          ))}
        </div>
        <div className="diet-filters">
          <span>Must be</span>
          {DIETS.map((d) => (
            <button key={d} className="chip diet" data-diet={d} aria-pressed={o.diets.includes(d)}
              title={DIET_LABEL[d]} onClick={() => o.toggleDiet(d)}>{DIET_LABEL[d]}</button>
          ))}
        </div>
        <div className="menu-grid">
          <div className="pk-grid" id="pkGrid">
            {!list.length && (
              <div className="empty-filter">Nothing in this course matches every filter. <button className="link" type="button" onClick={o.clearDiets}>Clear dietary filters</button></div>
            )}
            {list.map((p) => {
              const line = o.cart.find((l) => l.id === p.id);
              const q = Math.max(p.min, o.guests);
              return (
                <article key={p.id} className={`pk${line ? ' in-cart' : ''}`}>
                  <div className="ph">
                    {p.tag && <div className="pk-tags"><span className="tag pop">{p.tag}</span></div>}
                    <img src={IMG(p.img)} alt={p.name} loading="lazy" onError={(e) => (e.target as HTMLImageElement).remove()} />
                    <span className="ph-cap">{p.name}</span>
                  </div>
                  <div className="pk-body">
                    <div className="pk-top"><h3>{p.name}</h3><span className="pp">{`$${p.pp}`}<small>/guest</small></span></div>
                    <p className="desc">{p.desc}</p>
                    {!!p.diet.length && (
                      <div className="diets">{p.diet.map((d) => <span key={d} className="diet-badge" title={DIET_LABEL[d]}>{d}</span>)}</div>
                    )}
                    <div className="pk-foot">
                      <span className="pk-calc">
                        {o.guests < p.min ? <span style={{ color: 'var(--warn)' }}>Min {p.min} guests</span> : `For ${q} guests`}
                        <b>{money(p.pp * q, 0)}</b>
                      </span>
                      <button
                        className={`add${line ? ' added' : ''}`} type="button"
                        aria-label={line ? `Remove ${p.name} from order` : `Add ${p.name} for ${q} guests`}
                        onClick={() => {
                          const was = !!o.cart.some((l) => l.id === p.id);
                          o.toggleItem(p.id);
                          if (!was) o.toast(`Added for ${Math.max(p.min, o.guests)} guests.`);
                        }}
                      >{line ? (<><span className="a-l">Added ✓</span><span className="a-s">✓</span></>) : (<><span className="a-l">Add to order</span><span className="a-s">Add</span></>)}</button>
                    </div>
                  </div>
                </article>
              );
            })}
          </div>
          <OrderSheet />
        </div>
      </div>
    </section>
  );
}

function Totals({ withBtn }: { withBtn: boolean }) {
  const o = useOrder();
  const need = Math.max(0, MIN_ORDER - o.sub);
  const freeLeft = o.mode === 'delivery' && o.zipOk && o.sub < FREE_DEL ? FREE_DEL - o.sub : 0;
  return (
    <>
      <div className="tot-row"><span>Subtotal</span><span>{money(o.sub)}</span></div>
      <div className="tot-row"><span>{o.mode === 'delivery' ? 'Delivery and setup' : 'Pickup'}</span><span>{o.mode === 'delivery' ? (o.del ? money(o.del) : 'Free') : 'Free'}</span></div>
      <div className="tot-row"><span>Sales tax (8.25%)</span><span>{money(o.tax)}</span></div>
      <div className="tot-row grand"><span>Total</span><span>{money(o.total)}</span></div>
      {!!o.cart.length && need > 0 && (
        <div className="minbar"><div className="minbar-track"><div className="minbar-fill" style={{ width: `${Math.min(100, (o.sub / MIN_ORDER) * 100)}%` }} /></div>
          <p>Add <span className="num">{money(need, 0)}</span> more to reach the $250 delivery minimum.</p></div>
      )}
      {!!o.cart.length && need === 0 && freeLeft > 0 && (
        <div className="minbar"><div className="minbar-track"><div className="minbar-fill" style={{ width: `${Math.min(100, (o.sub / FREE_DEL) * 100)}%` }} /></div>
          <p><span className="num">{money(freeLeft, 0)}</span> away from free delivery.</p></div>
      )}
      {withBtn && (
        <button className="btn btn-primary" type="button" disabled={!o.cart.length || need > 0} onClick={() => o.setDrawer(true)}>Review order</button>
      )}
      {!!o.cart.length && <p className="pp-line">Works out to <span className="num">{money(o.total / o.guests)}</span> per guest, all in</p>}
    </>
  );
}

function Lines({ editable }: { editable: boolean }) {
  const o = useOrder();
  if (!o.cart.length) return <div className="sheet-empty">Nothing added yet. Packages scale to your {o.guests} guests automatically.</div>;
  return (
    <div className="sheet-lines">
      {o.cart.map((l) => {
        const p = PACKAGES.find((x) => x.id === l.id)!;
        return (
          <div className="line" key={l.id}>
            <span className="line-name">{p.name}</span><span className="line-price">{money(p.pp * l.qty)}</span>
            <span className="line-sub">
              {editable
                ? <MiniStep qty={l.qty} label="serving" onMinus={() => o.changeQty(p.id, -1)} onPlus={() => o.changeQty(p.id, 1)} />
                : <span className="num">{l.qty}</span>} × ${p.pp}
            </span>
            {editable && <button className="line-remove" type="button" onClick={() => o.toggleItem(p.id)}>Remove</button>}
          </div>
        );
      })}
    </div>
  );
}

function Meta() {
  const o = useOrder();
  return (
    <dl className="sheet-meta" style={{ display: 'grid' }}>
      <dt>Guests</dt><dd className="num">{o.guests}</dd>
      <dt>When</dt><dd>{fmtDate(o.date)}, {fmtTime(o.time)}</dd>
      <dt>{o.mode === 'delivery' ? 'Delivery' : 'Pickup'}</dt><dd>{o.mode === 'delivery' ? `ZIP ${o.zip}, setup included` : '1234 Sample Street'}</dd>
    </dl>
  );
}

export function OrderSheet() {
  return (
    <aside className="sheet" id="sheet" aria-label="Your order">
      <div className="sheet-head"><h3>Your order</h3><Meta /></div>
      <Lines editable />
      <div className="sheet-tot"><Totals withBtn /></div>
    </aside>
  );
}

export function MobileBar() {
  const o = useOrder();
  const show = o.cart.length > 0 && !o.plannerVisible && !o.drawerOpen;
  return (
    <div className={`mbar${show ? ' show' : ''}`} id="mbar" aria-hidden={!show}>
      <div className="mbar-info"><b>{money(o.total)}</b><span>{o.cart.length} {o.cart.length === 1 ? 'package' : 'packages'} · {o.guests} guests</span></div>
      <button className="btn btn-primary" id="mbarBtn" onClick={() => o.setDrawer(true)}>Review</button>
    </div>
  );
}

export function Drawer() {
  const o = useOrder();
  if (!o.drawerOpen) return null;
  const need = MIN - o.sub;
  return (
    <div className="scrim" id="drawer" onClick={(e) => { if (e.target === e.currentTarget) o.setDrawer(false); }}>
      <div className="drawer" role="dialog" aria-label="Review your order">
        <span className="grab" aria-hidden="true" />
        <div className="drawer-head"><h3>Review your order</h3><button className="x" id="drawerClose" aria-label="Close" onClick={() => o.setDrawer(false)}>×</button></div>
        <div className="drawer-body">
          <div className="order-sheet">
            <div className="sheet-head"><Meta /></div>
            <Lines editable />
            <div className="sheet-tot"><Totals withBtn={false} /></div>
          </div>
          <p className="muted" style={{ fontSize: 13.5 }}>Serve time {fmtTime(o.time)} · {o.mode === 'delivery' ? `Delivery + setup to ${o.zip}` : 'Pickup at 1234 Sample Street'}. Driver ETA by text on the day.</p>
        </div>
        <div className="drawer-foot">
          <button className="btn btn-primary" id="toCheckout" disabled={!o.cart.length || need > 0}
            onClick={() => o.toast('Demo: on Shopify this opens checkout with the event details attached to the order.')}>
            {!o.cart.length ? 'Add a package to continue' : need > 0 ? `Add ${money(need, 0)} to continue` : `Continue to payment · ${money(o.total)}`}
          </button>
        </div>
      </div>
    </div>
  );
}

export function Toast() {
  const { toastMsg } = useOrder();
  if (!toastMsg) return null;
  return <div className="toast" role="status">{toastMsg}</div>;
}

export { TIMES };
