'use client';

import * as NavigationMenu from '@radix-ui/react-navigation-menu';
import { navigationStyles } from './Navigation.css';

function Navigation() {
  return (
    <NavigationMenu.Root className={navigationStyles.root}>
      <NavigationMenu.List className={navigationStyles.list}>
        <NavigationMenu.Item>
          <NavigationMenu.Link
            className={navigationStyles.link}
            href="/"
          >
            Home
          </NavigationMenu.Link>
        </NavigationMenu.Item>
        <NavigationMenu.Item>
          <NavigationMenu.Link
            className={navigationStyles.link}
            href="/drinks"
          >
            Drinks
          </NavigationMenu.Link>
        </NavigationMenu.Item>
        <NavigationMenu.Item>
          <NavigationMenu.Link
            className={navigationStyles.link}
            href="/ingredients"
          >
            Ingredients
          </NavigationMenu.Link>
        </NavigationMenu.Item>
      </NavigationMenu.List>
    </NavigationMenu.Root>
  );
}

export { Navigation }; 