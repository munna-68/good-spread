import { createContext, useCallback, useContext, useMemo, useRef, useState, type ReactNode } from 'react';
import { PACKAGES } from './data';
import { FREE_DEL, MIN_ORDER, TAX, addDays, defaultDate, earliestDate, iso, zipInfo } from './lib';
import type { Cat, Diet } from './data';

export interface CartLine { id: string; qty: number; follow: boolean; }

interface OrderCtx {
  guests: number;
  date: string; dateMin: string; dateMax: string;
  time: string;
  mode: 'delivery' | 'pickup';
  zip: string;
  cat: Cat;
  diets: Diet[];
  cart: CartLine[];
  sub: number; del: number; tax: number; total: number;
  zipOk: boolean;
  drawerOpen: boolean; navOpen: boolean; plannerVisible: boolean;
  toastMsg: string | null;
  setGuests: (n: number) => void;
  stepGuests: (d: number) => void;
  setDate: (s: string) => void;
  setTime: (t: string) => void;
  setMode: (m: 'delivery' | 'pickup') => void;
  setZip: (z: string) => void;
  setCat: (c: Cat) => void;
  toggleDiet: (d: Diet) => void;
  clearDiets: () => void;
  toggleItem: (id: string, qty?: number) => void;
  changeQty: (id: string, d: number) => void;
  reorder: (id: string, qty: number) => void;
  setDrawer: (open: boolean) => void;
  setNav: (open: boolean) => void;
  setPlannerVisible: (v: boolean) => void;
  toast: (msg: string) => void;
  bumpKey: number;
}

const Ctx = createContext<OrderCtx | null>(null);

export function OrderProvider({ children }: { children: ReactNode }) {
  const now = useMemo(() => new Date(), []);
  const [guests, setGuestsState] = useState(25);
  const [date, setDateState] = useState(() => iso(defaultDate(now)));
  const [dateMin, setDateMin] = useState(() => iso(earliestDate(now)));
  const dateMax = useMemo(() => iso(addDays(now, 120)), [now]);
  const [time, setTimeState] = useState('11:30');
  const [mode, setModeState] = useState<'delivery' | 'pickup'>('delivery');
  const [zip, setZipState] = useState('78704');
  const [cat, setCat] = useState<Cat>('all');
  const [diets, setDiets] = useState<Diet[]>([]);
  const [cart, setCart] = useState<CartLine[]>([{ id: 'tacos', qty: 25, follow: true }]);
  const [drawerOpen, setDrawer] = useState(false);
  const [navOpen, setNav] = useState(false);
  const [plannerVisible, setPlannerVisible] = useState(true);
  const [toastMsg, setToastMsg] = useState<string | null>(null);
  const [bumpKey, setBumpKey] = useState(0);
  const toastTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const toast = useCallback((msg: string) => {
    setToastMsg(msg);
    if (toastTimer.current) clearTimeout(toastTimer.current);
    toastTimer.current = setTimeout(() => setToastMsg(null), 2800);
  }, []);

  const setGuests = useCallback((n: number) => {
    const v = Math.max(8, Math.min(500, Math.round(+n || 8)));
    setGuestsState((prev) => {
      if (prev !== v) setBumpKey((k) => k + 1);
      return v;
    });
    setCart((prev) =>
      prev.map((l) => {
        if (!l.follow) return l;
        const p = PACKAGES.find((x) => x.id === l.id)!;
        return { ...l, qty: Math.max(p.min, v) };
      }),
    );
  }, []);
  const stepGuests = useCallback((d: number) => {
    setGuestsState((prev) => {
      const v = Math.max(8, Math.min(500, prev + d));
      if (v !== prev) setBumpKey((k) => k + 1);
      setCart((c) =>
        c.map((l) => {
          if (!l.follow) return l;
          const p = PACKAGES.find((x) => x.id === l.id)!;
          return { ...l, qty: Math.max(p.min, v) };
        }),
      );
      return v;
    });
  }, []);

  const setDate = useCallback((s: string, min = dateMin) => {
    if (s && s >= min) setDateState(s);
    else {
      setDateState((prev) => prev);
      toast('That date is inside our 48 hour lead time.');
    }
  }, [dateMin, toast]);

  const setTime = useCallback((t: string) => {
    setTimeState(t);
    setBumpKey((k) => k + 1);
  }, []);

  const setMode = useCallback((m: 'delivery' | 'pickup') => setModeState(m), []);

  const setZip = useCallback((raw: string) => {
    const z = raw.replace(/\D/g, '').slice(0, 5);
    setZipState(z);
    const zi = zipInfo(z);
    if (zi.ok && zi.lead === 72) {
      const min72 = iso(addDays(new Date(), 3));
      setDateMin(min72);
      setDateState((prev) => (prev < min72 ? min72 : prev));
    } else {
      setDateMin(iso(earliestDate(new Date())));
    }
  }, []);

  const toggleDiet = useCallback((d: Diet) => {
    setDiets((prev) => (prev.includes(d) ? prev.filter((x) => x !== d) : [...prev, d]));
  }, []);
  const clearDiets = useCallback(() => setDiets([]), []);

  const toggleItem = useCallback((id: string, qty?: number, silent = false) => {
    const p = PACKAGES.find((x) => x.id === id)!;
    setCart((prev) => {
      const i = prev.findIndex((l) => l.id === id);
      if (i > -1 && qty == null) return prev.filter((l) => l.id !== id);
      if (i > -1) return prev.map((l) => (l.id === id ? { ...l, qty: qty!, follow: false } : l));
      return [...prev, { id, qty: qty ?? Math.max(p.min, guests), follow: qty == null }];
    });
    if (!silent) {
      setCart((c) => c); // no-op to keep order stable
    }
  }, [guests]);

  const changeQty = useCallback((id: string, d: number) => {
    const p = PACKAGES.find((x) => x.id === id)!;
    let hitMin = false;
    setCart((prev) =>
      prev.map((l) => {
        if (l.id !== id) return l;
        const q = Math.max(p.min, l.qty + d);
        if (q === p.min && d < 0) hitMin = true;
        return { ...l, qty: q, follow: false };
      }),
    );
    if (hitMin) toast(`${p.name} needs at least ${p.min} servings.`);
  }, [toast]);

  const reorder = useCallback((id: string, qty: number) => {
    const p = PACKAGES.find((x) => x.id === id)!;
    setCart((prev) => {
      if (!prev.some((l) => l.id === id)) return [...prev, { id, qty, follow: false }];
      return prev.map((l) => (l.id === id ? { ...l, qty, follow: false } : l));
    });
    toast(`${p.name} for ${qty} added to your order.`);
  }, [toast]);

  const { sub, del, tax, total, zipOk } = useMemo(() => {
    const sub = cart.reduce((s, l) => s + PACKAGES.find((p) => p.id === l.id)!.pp * l.qty, 0);
    const zi = zipInfo(zip);
    const del = mode !== 'delivery' || !zi.ok ? 0 : sub >= FREE_DEL ? 0 : zi.fee!;
    const tax = (sub + del) * TAX;
    return { sub, del, tax, total: sub + del + tax, zipOk: !!zi.ok };
  }, [cart, mode, zip]);

  const value: OrderCtx = {
    guests, date, dateMin, dateMax, time, mode, zip, cat, diets, cart,
    sub, del, tax, total, zipOk,
    drawerOpen, navOpen, plannerVisible, toastMsg,
    setGuests, stepGuests, setDate, setTime, setMode, setZip, setCat,
    toggleDiet, clearDiets, toggleItem, changeQty, reorder,
    setDrawer, setNav, setPlannerVisible, toast, bumpKey,
  };
  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

export function useOrder(): OrderCtx {
  const v = useContext(Ctx);
  if (!v) throw new Error('useOrder outside provider');
  return v;
}

export { MIN_ORDER };
