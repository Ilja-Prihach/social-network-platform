'use client';

import styles from './Sidebar.module.scss';
import { Button } from '@/shared/ui/Button';
import { Icon } from '@/shared/ui/Icon';
import { usePathname } from 'next/navigation';
import { useDictionary } from 'next-intlayer';
import sidebarContent from '../../sidebar.content';

export const Sidebar = () => {
  const pathname = usePathname();
  const content = useDictionary(sidebarContent);

  const navItems = [
    { href: '/feed', label: content.feed.value, icon: 'home-outline', iconActive: 'home' },
    {
      href: '/create',
      label: content.create.value,
      icon: 'plus-square-outline',
      iconActive: 'plus-square',
    },
    {
      href: '/my-profile',
      label: content.myProfile.value,
      icon: 'person-outline',
      iconActive: 'person',
    },
    {
      href: '/messenger',
      label: content.messenger.value,
      icon: 'message-circle-outline',
      iconActive: 'message-circle',
    },
    {
      href: '/search',
      label: content.search.value,
      icon: 'search-outline',
      iconActive: 'search-outline',
    },
  ];

  const toolsItems = [
    {
      href: '/statistics',
      label: content.statistics.value,
      icon: 'trending-up-outline',
      iconActive: 'trending-up-outline',
    },
    {
      href: '/favorites',
      label: content.favorites.value,
      icon: 'bookmark-outline',
      iconActive: 'bookmark',
    },
  ];

  const logoutItem = {
    href: '/sign-in',
    label: content.logOut.value,
    icon: 'log-out-outline',
    iconActive: 'log-out-outline',
  };

  const renderNavItem = (href: string, label: string, icon: string, iconActive: string) => {
    const isActive = pathname === href;
    // const isActive = true;
    return (
      <li key={href}>
        <Button
          href={href}
          variant="text"
          className={`${styles.sidebar_button} ${isActive ? styles.active : ''}`}
        >
          <div className={styles.svg}>
            <Icon iconId={isActive ? iconActive : icon} />
          </div>
          <span>{label}</span>
        </Button>
      </li>
    );
  };

  return (
    <nav className={styles.sidebar}>
      <ul className={styles.sidebar_nav}>
        {navItems.map((item) => renderNavItem(item.href, item.label, item.icon, item.iconActive))}
      </ul>

      <ul className={styles.sidebar_tools}>
        {toolsItems.map((item) => renderNavItem(item.href, item.label, item.icon, item.iconActive))}
      </ul>

      <ul className={styles.sidebar_logout}>
        {renderNavItem(logoutItem.href, logoutItem.label, logoutItem.icon, logoutItem.iconActive)}
      </ul>
    </nav>
  );
};
