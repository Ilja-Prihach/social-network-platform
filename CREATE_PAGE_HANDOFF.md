# Create Page Handoff (Crop / Filters / Publication)

## Source refs

- `public/fig/img_1.png` ... `public/fig/img_11.png`
- Latest implemented targets:
  - `public/fig/img_10.png` (Filters)
  - `public/fig/img_11.png` (Publication)

## Files touched (current scope)

- `src/pages/create/ui/CreatePage.tsx`
- `src/pages/create/ui/CreatePage.module.scss`

## What is implemented now

- Crop step from refs (`img_2..img_6`) with mobile-style controls/panels.
- Filters step from `img_10`:
  - modal size `972x564`
  - left preview area with arrows + dots
  - right 3x3 filter grid
  - bottom thumbnails hidden for Crop/Filters/Publish
- Publication step from `img_11`:
  - header title `Publication` with `Publish` action
  - two-column layout synced to preview area
  - left preview block keeps arrows + dots behavior
  - right panel includes profile row, description area, location input

## Pixel sizing now (key)

- Filters/Publish modal: `972x564`
- Main preview area (left): `490x503`
- Description textarea: `433x120`
- Description block with counter/placeholder area: `144` height
- Location input area: `433x60`

## Location dropdown behavior (real, no hardcode)

- Typing in `Add location` triggers real suggestions via Nominatim search API.
- Debounced request (~350ms), with loading/empty states.
- Dropdown opens under input and closes on outside click.
- Dropdown shows 2 items visible, rest via scroll.
- Selecting an item writes city into the input.
- Item typography:
  - city: Regular Text 16 (`16/24`, white)
  - subtitle: SmallText (`12/16`)

## Validation run (local)

- `npx eslint src/pages/create/ui/CreatePage.tsx`
  - no errors, warnings only about `<img>` (`@next/next/no-img-element`)
- `npx stylelint src/pages/create/ui/CreatePage.module.scss`
  - pass

## Known constraints / context

- Global repo checks currently contain unrelated existing issues outside CreatePage (e.g. `.intlayer/**`, some unrelated SCSS files).
- Network access is required at runtime for live location search results.
- External geocoding provider may rate-limit requests.

## Next session checklist

1. Open `public/fig/img_11.png` and verify final pixel match for spacing/typography.
2. Verify publish panel has no internal scroll while dropdown is closed.
3. Verify location search flow:
   - type query (2+ chars)
   - see 2 visible suggestions + scroll for more
   - select suggestion and confirm input update
4. If backend location endpoint appears, replace client-side geocoding call with project API/BFF route.
