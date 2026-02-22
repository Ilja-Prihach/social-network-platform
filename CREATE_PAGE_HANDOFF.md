# Create Page Handoff (Crop / Filters / Publication)

## Source refs

- `public/fig/img_1.png` ... `public/fig/img_11.png`
- Latest implemented targets:
  - `public/fig/img_10.png` (Filters)
  - `public/fig/img_11.png` (Publication)

## Current architecture (after decomposition)

- Route entry:
  - `src/pages/create/ui/CreatePage.tsx` (thin wrapper)
- Main widget (flow orchestrator + layout shell):
  - `src/widgets/create-post-flow/ui/CreatePostFlowWidget.tsx`
  - `src/widgets/create-post-flow/ui/CreatePostFlowWidget.module.scss`
  - `src/widgets/create-post-flow/ui/components/*`
- Feature UI split:
  - `src/features/create-post/upload/ui/CreatePostUploadStep.tsx`
  - `src/features/create-post/crop/ui/CreatePostCropControls.tsx`
  - `src/features/create-post/crop/ui/CreatePostCropOverlays.tsx`
  - `src/features/create-post/filters/ui/CreatePostFiltersPanel.tsx`
  - `src/features/create-post/publish/ui/CreatePostPublishPanel.tsx`
- Feature model split:
  - `src/features/create-post/model/types.ts`
  - `src/features/create-post/model/store.ts` (zustand flow state)
  - `src/features/create-post/model/draftStorage.ts`
  - `src/features/create-post/model/getCreatePostErrorMessage.ts`
  - `src/features/create-post/location-search/model/useLocationSuggestions.ts`

## What is implemented now

- Full wizard flow: `upload -> crop -> filters -> publish`
- Crop step from refs (`img_2..img_6`) with mobile controls:
  - ratio sheet
  - zoom slider
  - crop gallery overlay
- Filters step from `img_10`:
  - modal size `972x564`
  - left preview with arrows + dots
  - right 3x3 filter grid
- Publication step from `img_11`:
  - header title `Publication` + `Publish` action
  - left preview synced with selected photo
  - right panel: profile row, description, location search
- Draft behavior:
  - save/open draft via localStorage
  - draft photos restored from data URLs
- Location behavior:
  - real Nominatim search, debounce ~350ms
  - loading/empty states
  - close on outside click

## Pixel sizing now (key)

- Filters/Publish modal: `972x564`
- Main preview area (left): `490x503`
- Description textarea: `433x120`
- Description block with counter: `144` height
- Location input area: `433x60`

## Type/lint status (latest local)

- `npx tsc --noEmit`:
  - pass
- `npx eslint` on updated Create Post files:
  - no errors
  - warnings only about `<img>` (`@next/next/no-img-element`)
- `npx stylelint src/widgets/create-post-flow/ui/CreatePostFlowWidget.module.scss`:
  - pass
- `npm run lint` (global repo):
  - still fails on unrelated existing `.intlayer/**` issues

## Notes / constraints

- Runtime network is required for location suggestions (Nominatim).
- External geocoding provider can rate-limit.
- `src/pages/create/ui/CreatePage.module.scss` was removed; styles now live in widget SCSS.

## Next session checklist

1. Visual pass against `public/fig/img_11.png` after decomposition (desktop + mobile).
2. Validate no UI regressions between steps after zustand migration.
3. If backend location endpoint appears, switch from direct Nominatim request to project API/BFF route.
4. Optional: replace `<img>` with `next/image` where practical.
