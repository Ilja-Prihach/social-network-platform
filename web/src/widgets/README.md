# widgets

Composite UI blocks that stitch together entities/features for a page section.

## Suggested structure
- `Header/` – navigation and user controls.
- `Sidebar/` – filters or shortcuts.
- `Footer/` – site-wide footer content.
- `Card/` – reusable information blocks composed from features/entities.

## Example
```tsx
// Header/index.tsx
import { UserMenu } from "@/features/user-menu";
import styles from "./Header.module.scss";

export const Header = () => (
  <header className={styles.header}>
    <div className={styles.logo}>Incubator</div>
    <UserMenu />
  </header>
);
```
