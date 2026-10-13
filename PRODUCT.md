# Product

## Register

brand

## Users

Office managers and operations leads in Austin who order lunch for 10 to 500
people, plus event planners booking weddings and corporate functions.

They arrive mid-workday, on a phone or a laptop between meetings, and they have
one job: find a spread their team will actually like, price it per guest, and
place the order without a phone call. The secondary job is reassurance. They are
handing over lunch for their whole team, so "will it show up on time" matters
more than whether the menu is charming.

Success is an order placed in under two minutes, or a quote request that gets a
human response.

## Product Purpose

Alder is an Austin catering company selling office lunches, corporate events and
weddings. This page is the entire storefront. It has to earn trust fast, then
hand the visitor a working order planner rather than a "contact us" form.

The page is a portfolio demo rebuilt 1:1 from a professional designer's original
at `freshbakes.store/aldercatering/`. That original is the design north star, not
a starting point to be improved upon.

## Brand Personality

Energetic, modern, friendly.

Confident without being precious. This is a company that delivers reliably at
scale, so it should feel like it has its act together. It is not fine dining
performing humility, and it is not a startup landing page. The energy comes from
the typography and the working planner, never from decoration competing with them.

## Anti-references

- **Washed beige nothingness.** Everything one value and one temperature, so the
  page has no depth and no focal point. This is the single worst outcome and the
  main thing this project must never regress into.
- **Heavy stock food photography.** Big glossy hero shots of catering trays
  shouting over the copy. Photography is texture here, not the message.
- **Earthy artisan overcorrect.** Kraft paper, farmhouse script, chalkboard
  lettering. Wrong register entirely for a company feeding office buildings.
- **Generic SaaS landing.** Purple or blue gradient, floating glass cards,
  centred logo bar, "Trusted by thousands of teams" without proof.

## Design Principles

1. **The order is the product.** The planner is the hero. Anything that does not
   move someone toward placing an order is secondary, including photography.
2. **Prove reliability with numbers, not adjectives.** On-time percentage, meals
   delivered, guests per order. Specifics beat "quality you can trust".
3. **Earn the confidence before asking for the order.** Trust signals come
   before the ask, not buried underneath it.
4. **Energy comes from type and motion, not ornament.** The page should feel
   alive through scale, contrast and pacing rather than badges, stickers or
   floating shapes.
5. **One decision per screen.** Each section asks for one thing. Never stack a
   form, a checklist and a competing CTA in the same viewport.

## Accessibility & Inclusion

WCAG 2.1 AA is the bar and it is not negotiable.

- Body and secondary text must clear 4.5:1 against their actual background.
  Contrast has to be measured on the rendered surface, including where
  photography sits underneath text.
- Focus states stay visible on every interactive element (`:focus-visible`,
  2px accent outline, 3px offset).
- `prefers-reduced-motion` disables the headline rotator animation, smooth
  scroll and all transitions.
- Status is never carried by colour alone. Validation errors pair colour with
  text.
- Targets stay at or above 44px on touch for the planner stepper, filters and
  mobile order bar.