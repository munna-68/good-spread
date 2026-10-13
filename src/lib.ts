export const MIN_ORDER = 250;
export const FREE_DEL = 500;
export const TAX = 0.0825;

export const money = (n: number, d = 2) =>
  '$' + n.toLocaleString('en-US', { minimumFractionDigits: d, maximumFractionDigits: d });

export const addDays = (d: Date, n: number) => {
  const x = new Date(d);
  x.setDate(x.getDate() + n);
  return x;
};
export const iso = (d: Date) =>
  `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;

export function earliestDate(now = new Date()): Date {
  let e = addDays(now, now.getHours() >= 14 ? 3 : 2);
  if (e.getDay() === 0) e = addDays(e, 1);
  return e;
}
export function defaultDate(now = new Date()): Date {
  let d = new Date(earliestDate(now));
  while (d.getDay() === 0 || d.getDay() === 6) d = addDays(d, 1);
  return d;
}

export const fmtDate = (s: string) => {
  const [y, m, d] = s.split('-').map(Number);
  return new Date(y, m - 1, d).toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' });
};
export const dayName = (s: string) => {
  const [y, m, d] = s.split('-').map(Number);
  return new Date(y, m - 1, d).toLocaleDateString('en-US', { weekday: 'long' });
};

export const TIMES: string[] = [];
for (let h = 7; h <= 19; h++)
  for (const mm of [0, 30]) {
    if (h === 19 && mm === 30) continue;
    TimesPush(h, mm);
  }
function TimesPush(h: number, mm: number) {
  TIMES.push(`${String(h).padStart(2, '0')}:${mm ? '30' : '00'}`);
}

export const fmtTime = (t: string) => {
  const [hh, mm] = t.split(':').map(Number);
  const ap = hh >= 12 ? 'pm' : 'am';
  return `${hh % 12 || 12}:${String(mm).padStart(2, '0')} ${ap}`;
};
export const fmtTimeShort = (t: string) => fmtTime(t).replace(' am', 'am').replace(' pm', 'pm');

export interface ZipInfo {
  ok: boolean;
  fee?: number;
  zone?: string;
  lead?: number;
  msg?: string;
}
export function zipInfo(z: string): ZipInfo {
  if (!/^\d{5}$/.test(z)) return { ok: false, msg: 'Enter a 5-digit ZIP code.' };
  const n = +z;
  if ((n >= 78701 && n <= 78705) || n === 78712 || n === 78722 || n === 78751 || n === 78756)
    return { ok: true, fee: 35, zone: 'Central Austin', lead: 48 };
  if (n >= 78706 && n <= 78759) return { ok: true, fee: 55, zone: 'Greater Austin', lead: 48 };
  if ([78613, 78664, 78665, 78681, 78641].includes(n))
    return { ok: true, fee: 75, zone: 'Round Rock and Cedar Park', lead: 72 };
  return { ok: false, msg: `We don't deliver to ${z} yet. Pickup from our Sample Street kitchen is free, or ask us about a one-off delivery.` };
}

export const mealFor = (t: string) => {
  const [h, m] = t.split(':').map(Number);
  if (h < 10 || (h === 10 && m < 30)) return 'Breakfast';
  if (h < 15) return 'Lunch';
  return 'Dinner';
};

export const round10 = (n: number) => Math.round(n / 10) * 10;
