export interface MenuItem {
  key: string;
  title: string;
  icon?: string;
  routerLink?: string;
  children?: MenuItem[];
  permissions?: string[];
  roles?: string[];
}

export interface NavigationConfig {
  role: string;
  menuItems: MenuItem[];
}
