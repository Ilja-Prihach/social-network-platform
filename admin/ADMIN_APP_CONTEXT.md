# Admin App Context

## Goal

- Build a separate Next.js admin frontend in `admin/`.
- The admin frontend will use Apollo GraphQL.
- In this branch, implementation should start with sign-in only.
- For now, this file stores product and structure context only. No UI or business logic is implemented here.

## Route plan

- `/` -> redirect to `/sign-in` for guests and to `/users` for authenticated admins
- `/sign-in` -> superadmin sign-in
- `/users` -> users list
- `/users/[userId]` -> user details with tabs
- `/payments` -> payments list
- `/posts` -> posts list with GraphQL subscription updates
- `/statistics` -> reserved route for admin statistics

## Use cases

### UC-1. Admin sign-in

- Credentials are hardcoded for now:
- `admin@gmail.com`
- `admin`
- Successful sign-in redirects to `Users list`

### UC-2. Users list

- Main menu entry: `Users list`
- Table columns:
- `User ID`
- `username`
- `Profile link`
- `Date added`
- actions: delete, ban, un-ban
- Default page size: `8`
- Pagination is required

### UC-3. Delete user

- Action comes from the user row context menu
- Confirmation text:
- `Are you sure you want to delete __username__?`
- After confirm:
- delete user
- close dialog
- return to users list
- Student accounts from the shared training list must not be deleted

### UC-4. Search users

- Search by `username`
- Search works on the users list page

### UC-5. Sort users

- Sort by username:
- `from A to Z`
- `from Z to A`
- Sort by date added:
- newest
- oldest
- Front-end implementation of extra filtering is optional for this area

### UC-6. User details

- Opened from `More information`
- Profile contains:
- photo
- username
- ID
- profile link
- created date
- Tabs:
- `Payments`
- `Followers`
- `Following`
- Each tab uses a table with pagination

### UC-7. Ban user

- Action label: `Ban in the system`
- Confirmation text:
- `Are you sure you want to ban __Username__?`
- Reasons:
- `Bad behavior`
- `Advertising placement`
- `Another reason`
- If `Another reason` is selected, show a custom reason input

### UC-8. Un-ban user

- Optional list filter values:
- `Not selected`
- `Blocked`
- `Not blocked`
- Confirmation text:
- `Are you sure want to un-ban __Username__?`

### UC-9. Payments list

- Main menu entry: `Payments list`
- Table columns:
- user photo
- username
- date
- amount
- subscription
- payment method
- Default page size: `6`
- Search by `username`
- Sorting:
- username
- date added
- amount
- payment method

### UC-10. Posts list

- Main menu entry: `Posts list`
- Infinite scroll list
- Search by `username`
- Show:
- post image
- description
- publication date
- New posts should appear without page reload using Apollo GraphQL Subscription
- From the post row/card, admin can start the ban flow

## Planned folder ownership

- `src/app`
- route folders and route-level composition
- `src/screens`
- page-level admin screens
- `src/widgets`
- complex sections such as tables, filters, menus, tab panels
- `src/features`
- user-facing actions such as sign-in, delete user, ban user, un-ban user, search, sorting
- `src/entities`
- domain slices such as admin, user, payment, post
- `src/shared`
- shared Apollo setup, UI kit primitives, config, lib helpers, constants

## First implementation boundary

- This branch should implement sign-in first
- Do not start users, payments, posts, or statistics implementation until sign-in flow is agreed
- Keep future work aligned with this file unless requirements change
