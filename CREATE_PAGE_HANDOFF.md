# Create Page Handoff (Current State)

## Entry + structure

- Route entry:
  - `src/pages/create/ui/CreatePage.tsx`
- Main flow widget (single orchestrator):
  - `src/widgets/create-post-flow/ui/CreatePostFlowWidget.tsx`
  - `src/widgets/create-post-flow/ui/CreatePostFlowWidget.module.scss`
  - `src/widgets/create-post-flow/ui/components/*`
- Feature UI blocks:
  - `src/features/create-post/upload/ui/CreatePostUploadStep.tsx`
  - `src/features/create-post/crop/ui/CreatePostCropControls.tsx`
  - `src/features/create-post/crop/ui/CreatePostCropOverlays.tsx`
  - `src/features/create-post/filters/ui/CreatePostFiltersPanel.tsx`
  - `src/features/create-post/publish/ui/CreatePostPublishPanel.tsx`
- Flow state/model:
  - `src/features/create-post/model/store.ts` (Zustand)
  - `src/features/create-post/model/types.ts`
  - `src/features/create-post/model/draftStorage.ts`
  - `src/features/create-post/model/getCreatePostErrorMessage.ts`

## Step flow and back behavior

- Wizard steps: `upload -> crop -> filters -> publish`
- Header Back rules:
  - `publish -> filters` (no confirm modal)
  - `filters -> crop` (no confirm modal)
  - on `crop`, Back opens confirm modal (save/continue/discard) and then exits create flow

## Exit/confirm behavior

- Unsaved changes tracking is based on:
  - `photos.length > 0`
  - non-empty description
  - non-empty location
- When user tries to leave via links or overlay close, confirm modal is shown.
- Confirm modal actions:
  - `Save draft` (persist + navigate to pending target)
  - `Continue editing` (close modal only)
  - `Discard` (clear draft + navigate to pending target)
- A `beforeunload` guard is active for browser close/reload with unsaved changes.

## Draft implementation (important)

- Storage key: `create_post_draft_v1`
- Draft contents:
  - current step + crop/filter params + description + photo list
- Photo persistence rules:
  - image upload response returns `{ uploadId, url }`
  - widget now uses backend `url` as `preview_url` when available
  - only `blob:` previews are converted to `data:` during draft save
  - stale drafts containing `blob:` previews are auto-cleared on read
- On opening create page:
  - widget reads draft from storage
  - if draft exists and current runtime has no photos loaded, it auto-opens draft

## Publication UI/content specifics

- Description is optional for publish.
- Localized placeholders:
  - description: “Enter description” (+ locales)
  - location: “Choose location” (+ locales)
- For Intlayer field values in native HTML attributes, `.value` is used (prevents `[object Object]` in placeholders/aria labels).

## Crop/layout specifics

- Crop stage fills full preview area (removed bottom gap by using flexible content sizing and full-height crop stage).
- Upload button text layout updated for long locales:
  - wraps and stays centered (no broken truncation on long strings like Spanish).

## API/data paths

- Upload images:
  - client: `src/entities/post/api/postMutations.ts -> uploadPostImages`
  - BFF proxy: `app/api/posts/image/route.ts`
- Create post publish:
  - client: `src/entities/post/api/postMutations.ts -> createPost`
  - BFF proxy: `app/api/posts/route.ts`
- Delete uploaded image:
  - client: `deletePostImage`
  - BFF proxy: `app/api/posts/image/[uploadId]/route.ts` (DELETE)

## Known constraints

- Location suggestions still use Nominatim directly (`useLocationSuggestions`), with debounce and outside-click close.
- Global `npm run lint` in this repo may fail due to unrelated existing issues outside create flow.

## Quick troubleshooting

1. If draft button seems inconsistent, check `localStorage['create_post_draft_v1']`.
2. If old broken draft exists from previous logic, clear it once and resave.
3. If navigation prompt appears unexpectedly, verify `has_unsaved_changes` inputs (photos/description/location).
