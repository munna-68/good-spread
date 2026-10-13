export type Diet = 'VG' | 'V' | 'GF' | 'DF';
export type Cat = 'all' | 'breakfast' | 'lunch' | 'boxed' | 'dinner' | 'sweet';

export interface Pkg {
  id: string;
  cat: Exclude<Cat, 'all'>;
  name: string;
  desc: string;
  pp: number;
  min: number;
  diet: Diet[];
  img: string;
  tag?: string;
}

export const IMG = (id: string, w = 800) =>
  `https://images.pexels.com/photos/${id}/pexels-photo-${id}.jpeg?auto=compress&cs=tinysrgb&w=${w}`;

export const DIET_LABEL: Record<Diet, string> = {
  VG: 'Vegan',
  V: 'Vegetarian',
  GF: 'Gluten free',
  DF: 'Dairy free',
};

export const PACKAGES: Pkg[] = [
  { id: 'sunrise', cat: 'breakfast', name: 'Sunrise breakfast spread', desc: 'Soft scrambled eggs, crispy potatoes, chicken apple sausage, seasonal fruit and salsa verde.', pp: 16, min: 10, diet: ['GF'], img: '16556113' },
  { id: 'kolache', cat: 'breakfast', name: 'Kolaches and coffee bar', desc: 'Sausage and jalapeño kolaches, fruit kolaches, cold brew and hot coffee with oat milk.', pp: 12, min: 12, diet: [], img: '34232215' },
  { id: 'tacos', cat: 'lunch', name: 'Build-your-own taco bar', desc: 'Chipotle chicken, carnitas and roasted cauliflower with corn tortillas, rice, beans and three salsas.', pp: 24, min: 15, diet: ['GF', 'DF'], img: '8448339', tag: 'Most ordered' },
  { id: 'bowls', cat: 'lunch', name: 'Grain bowl bar', desc: 'Farro and brown rice, roasted vegetables, lemon chicken or crispy tofu, and four sauces on the side.', pp: 22, min: 10, diet: ['VG', 'V', 'GF', 'DF'], img: '1640770' },
  { id: 'mezze', cat: 'lunch', name: 'Mediterranean mezze', desc: 'Chicken shawarma, falafel, hummus, tabbouleh, cucumber salad and warm pita.', pp: 21, min: 10, diet: ['V'], img: '23025179' },
  { id: 'boxed', cat: 'boxed', name: 'Labeled boxed lunches', desc: 'A sandwich or salad, side, cookie and drink in a box with each guest\u2019s name on it.', pp: 19, min: 8, diet: ['V'], img: '5852322' },
  { id: 'brisket', cat: 'dinner', name: 'Smoked brisket buffet', desc: '12-hour brisket, smoked chicken, mac and cheese, slaw, pickles and Texas toast.', pp: 32, min: 20, diet: [], img: '9397270', tag: 'Austin favorite' },
  { id: 'salmon', cat: 'dinner', name: 'Lemon herb salmon dinner', desc: 'Roasted salmon, herbed potatoes, charred broccolini and a little gem Caesar.', pp: 38, min: 15, diet: ['GF'], img: '1516415' },
  { id: 'sweets', cat: 'sweet', name: 'Cookie and bar tray', desc: 'Brown butter chocolate chip, lemon bars and fudgy brownies. Two pieces per guest.', pp: 6, min: 12, diet: ['V'], img: '1775283' },
  { id: 'drinks', cat: 'sweet', name: 'Agua fresca and sparkling water', desc: 'Two seasonal agua frescas and still and sparkling water, iced and ready.', pp: 5, min: 10, diet: ['VG', 'V', 'GF', 'DF'], img: '8215115' },
];

export const CATS: { id: Cat; label: string }[] = [
  { id: 'all', label: 'All' },
  { id: 'breakfast', label: 'Breakfast' },
  { id: 'lunch', label: 'Lunch bars' },
  { id: 'boxed', label: 'Boxed lunches' },
  { id: 'dinner', label: 'Dinner buffets' },
  { id: 'sweet', label: 'Desserts and drinks' },
];

export const DIETS: Diet[] = ['VG', 'V', 'GF', 'DF'];

export const OCCASIONS = [
  { img: '5852271', alt: 'Sandwiches and salads packed for an office lunch', h: 'Office lunches', p: 'Drop-off spreads and individually labeled boxes, set up in your break room.', from: 16, cta: 'Order now', href: '#menu' },
  { img: '34321369', alt: 'Evening corporate event with string lights', h: 'Corporate events', p: 'Launches, offsites and client dinners with servers, bar and rentals handled.', from: 42, cta: 'Get a quote', href: '#events' },
  { img: '27495819', alt: 'Wedding reception tables set for dinner', h: 'Weddings', p: 'Family style, plated or stations. A tasting for two is included once you book.', from: 58, cta: 'Get a quote', href: '#events' },
  { img: '57980', alt: 'Plated dish at a private dinner', h: 'Private parties', p: 'Birthdays, rehearsal dinners and backyard parties from 20 guests.', from: 28, cta: 'Get a quote', href: '#events' },
];

export const REVIEWS = [
  { q: 'Lunch for 60 used to take me three phone calls. Now it takes five minutes, and the setup is finished before I get downstairs.', init: 'DR', name: 'Dana R.', role: 'Office manager, Ledgerline', meta: 'Weekly order \u00B7 60 guests \u00B7 since 2024' },
  { q: 'They gave us a real number on day one. The final invoice was within $90 of the estimate, and our guests are still talking about the brisket.', init: 'PS', name: 'Priya and Sam', role: 'Wedding, Dripping Springs', meta: 'Family style \u00B7 140 guests \u00B7 May 2026' },
  { q: 'Our board lunch had nine different allergies. Every box came labeled with a name. Nobody had to ask a single question.', init: 'MT', name: 'Marcus T.', role: 'Executive assistant, Mesa Health', meta: 'Boxed lunches \u00B7 22 guests \u00B7 Aug 2026' },
];

export const FAQS = [
  { q: 'How far ahead do I need to order?', a: '48 hours for most orders, 72 hours outside central Austin, and two weeks for staffed events. The date picker only shows dates we can fill, so if you can pick it, we can make it.' },
  { q: 'Is there a minimum order?', a: 'Delivery orders start at $250. Most packages also have a minimum headcount, shown on each card, so the food arrives in full trays rather than half portions.' },
  { q: 'Can I change or cancel?', a: 'Change headcount up to 24 hours before delivery at no cost. Cancel more than 48 hours out for a full refund. Inside 48 hours we charge 50%, since the food is already ordered.' },
  { q: 'How do you handle allergies?', a: 'Every dish is labeled with the top nine allergens. Add names and needs at checkout and we will pack individually labeled meals at no extra charge.' },
  { q: 'Do you set up and clean up?', a: 'Delivery orders include setup with disposable chafers or cold display. Staffed events include servers, setup, breakdown and trash removal.' },
  { q: 'Can you invoice my company?', a: 'Yes. Office accounts get Net 30 terms with PO numbers. One-off orders can pay by card, Apple Pay or Google Pay at checkout.' },
];

export const ACCT_ROWS = [
  { t: 'Grain bowl bar', s: 'Tue, Sep 29 \u00B7 32 guests \u00B7 PO 4471', price: 704, id: 'bowls', qty: 32 },
  { t: 'Sunrise breakfast spread', s: 'Fri, Sep 25 \u00B7 18 guests \u00B7 PO 4468', price: 288, id: 'sunrise', qty: 18 },
  { t: 'Boxed lunches, labeled', s: 'Wed, Sep 23 \u00B7 41 guests \u00B7 PO 4459', price: 779, id: 'boxed', qty: 41 },
];

/* Quote builder */
export const QTYPES = [
  ['wedding', 'Wedding', 'Ceremony and reception'],
  ['corporate', 'Corporate event', 'Launch, offsite, holiday party'],
  ['private', 'Private party', 'Birthday, rehearsal, backyard'],
  ['gala', 'Fundraiser or gala', 'Seated or cocktail format'],
  ['other', 'Something else', 'Tell us about it'],
] as const;
export const QSTYLES: [string, string, string, number, number][] = [
  ['dropoff', 'Drop-off buffet', 'Set up, no staff', 28, 36],
  ['staffed', 'Staffed buffet', 'Servers and breakdown', 42, 55],
  ['family', 'Family style', 'Shared platters at each table', 58, 72],
  ['plated', 'Plated dinner', 'Coursed, seated service', 72, 95],
  ['stations', 'Chef stations', 'Carving, pasta, tacos', 62, 80],
];
export const QADDONS: [string, string, string, number, number][] = [
  ['bar', 'Bar service', 'Bartenders, mixers, ice', 18, 32],
  ['rentals', 'Rentals', 'Linens, china, glassware', 9, 14],
  ['dessert', 'Dessert table', 'Mini pies, bars, cookies', 6, 10],
  ['late', 'Late-night snack', 'Sliders or tacos at 10pm', 8, 12],
];
export const QNAMES = ['Event', 'Guests and date', 'Service style', 'Extras', 'Your details'];
