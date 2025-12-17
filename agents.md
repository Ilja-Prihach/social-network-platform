1. Inspected existing Next.js App Router setup, configs, and globals.
2. Created FSD scaffold under src (app, pages, widgets, features, entities, shared).
3. Added stub pages with paired TSX/SCSS for required routes, including modal query handling on home and redirects on profile/settings.
4. Wired App Router routes to re-export src pages; then updated re-exports to include both default and metadata to match the required format.
5. Added per-page metadata stubs in src/pages/* and extended tsconfig paths with @/pages/* alias.
6. Moved root layout to src/app/layouts/root and kept App Router layout as a thin re-export.
7. Added placeholder middleware.ts, instrumentation.ts, and documented pages/README.md stub.
