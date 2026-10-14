# Contributors

Social Network Platform was developed collaboratively, but the contribution was not distributed evenly. The preserved product history shows two leading contributors: **Ilya Prihach as the principal contributor and integration owner**, followed by **Artem Bedash as the second-largest contributor and owner of several core feature tracks**.

## Contribution overview

The figures below use the final product commit before the repository was prepared for public portfolio use. They exclude documentation, security cleanup, dependency maintenance, and other publication-only commits.

| Rank | Contributor                                           | Product commits |     Share | Contribution level                          |
| ---: | ----------------------------------------------------- | --------------: | --------: | ------------------------------------------- |
|    1 | [Ilya Prihach](https://github.com/Ilja-Prihach)       |         **296** | **52.8%** | Principal contributor and integration owner |
|    2 | [Artem Bedash](https://github.com/ArtemBedash)        |         **111** | **19.8%** | Core contributor and feature owner          |
|    3 | [Gadel Abdulkaev](https://github.com/AbdulkaevGadel)  |              56 |     10.0% | Feature contributor                         |
|    4 | [alexwebx](https://github.com/alexwebx)               |              49 |      8.7% | Foundation contributor                      |
|    5 | [Egor Gorokh](https://github.com/Egor-Gorokh)         |              35 |      6.2% | UI contributor                              |
|    6 | [socialnetworkai](https://github.com/socialnetworkai) |              14 |      2.5% | Team integration account                    |

**Ilya and Artem authored 407 of 561 product commits — 72.5% of the complete product history.** Commit count is not a perfect measurement of engineering impact, so the ownership and breadth of work are described below as well.

## Leading contributors

### Ilya Prihach — principal contributor and integration owner

Ilya contributed across the widest part of the system and remained the primary contributor through the project's final development phase. His work connected isolated feature branches into a coherent application and covered both product delivery and architectural evolution.

Main areas of ownership:

- frontend architecture and cross-feature integration;
- migration to an npm-workspace monorepo with shared packages;
- creation of the separate administration application;
- Apollo Client and admin GraphQL foundation;
- admin authentication, route protection, user listing, search, filtering, sorting, pagination, and moderation actions;
- authentication, session management, SSR user hydration, and BFF integration;
- profile editing, localized validation, avatar upload, crop, and deletion flows;
- public profiles, post viewer, post editing and deletion, feed behavior, and pagination;
- payment-history integration and settings flows;
- major refactoring that split large screens into maintainable entities, features, widgets, hooks, and shared modules;
- build stabilization, merge integration, and final portfolio maintenance.

This was not limited to one assigned feature: Ilya's contribution spans the user application, admin application, shared packages, server integration layer, and later-stage stabilization of the codebase.

### Artem Bedash — core contributor and feature owner

Artem was the second-largest contributor and owned several technically central feature tracks. His work established important foundations early in development and delivered one of the project's largest end-to-end user flows.

Main areas of ownership:

- Feature-Sliced architecture foundation and early project structure;
- ESLint, Stylelint, Prettier, aliases, Husky, and repository conventions;
- reusable Select and language-selection components;
- Intlayer integration, locale routing, six-language UI, and Hebrew RTL support;
- logout and authentication refinements;
- initial secure BFF structure and cookie-forwarding patterns;
- full multi-step post creation and publishing flow;
- image upload, crop controls, filters, location autocomplete, draft recovery, and Zustand state decomposition;
- AI-assisted post translation integration and translation UI;
- localized, accessible date-picker component with validation;
- feature documentation and architecture handoff notes.

Artem's 111 commits are concentrated in foundational architecture, internationalization, BFF work, and complex feature flows rather than isolated visual changes.

## Additional team contributions

| Contributor                                           | Main areas of contribution                                                                                                                                                        |
| ----------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| [Gadel Abdulkaev](https://github.com/AbdulkaevGadel)  | WebSocket notification center, notification history and synchronization, profile pages and API integration, sign-in flows, typing, build stabilization, and component refactoring |
| [alexwebx](https://github.com/alexwebx)               | Initial application setup, design tokens and core UI components, registration, base API integration, OAuth, early server-rendered pages, and original deployment groundwork       |
| [Egor Gorokh](https://github.com/Egor-Gorokh)         | Shared pagination, tabs, textarea, icons and SVG sprite assets, locale flags, favicons, and lint-related fixes                                                                    |
| [socialnetworkai](https://github.com/socialnetworkai) | Team integration account used for repository maintenance, settings scaffolding, documentation, and infrastructure updates                                                         |

## How attribution was preserved

- Original author names, timestamps, commit messages, and merge relationships remain in Git history.
- Author aliases are normalized through `.mailmap` for readable local statistics.
- Personal commit email addresses were replaced with contributors' GitHub `noreply` addresses for privacy.
- History was rewritten only to remove environment files, generated output, exposed configuration, and internal deployment artifacts.
- Product work was not squashed or reassigned during publication.

Current totals, including portfolio-maintenance commits, can be inspected with:

```bash
git shortlog -sne HEAD
```
