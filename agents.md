1. Inspected existing Next.js App Router setup, configs, and globals.
2. Created FSD scaffold under src (app, pages, widgets, features, entities, shared).
3. Added stub pages with paired TSX/SCSS for required routes, including modal query handling on home and redirects on profile/settings.
4. Wired App Router routes to re-export src pages; then updated re-exports to include both default and metadata to match the required format.
5. Added per-page metadata stubs in src/pages/_ and extended tsconfig paths with @/pages/_ alias.
6. Moved root layout to src/app/layouts/root and kept App Router layout as a thin re-export.
7. Added placeholder middleware.ts, instrumentation.ts, and documented pages/README.md stub.
8. Added README placeholders for shared/api, shared/lib, shared/config to keep empty dirs in VCS and show usage patterns.
9. Added widgets/README with a Header example.
10. Stubbed sidebar routes (feed, create, my-profile, messenger, search, statistics, favorites) with paired UI/SCSS and App Router re-exports.
    11.Cleaned corrupted node_modules, reinstalled deps; dev server start blocked in sandbox by port permissions.
    12.Fixed imports that referenced `@/src/*` to use the configured `@/*` alias (Button, user entity, privacy policy page).
    13.ok
11. zhopa
