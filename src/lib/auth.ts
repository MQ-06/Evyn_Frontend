import Cookies from 'js-cookie';
import type { AuthUser, RoleType } from '@/types';

const ROLE_COOKIE = 'evyn-role';

export function setRoleCookie(role: RoleType) {
  Cookies.set(ROLE_COOKIE, role, { expires: 7, sameSite: 'lax' });
}

export function clearRoleCookie() {
  Cookies.remove(ROLE_COOKIE);
}

export function getDashboardPath(role: RoleType): string {
  return `/${role}/dashboard`;
}

export function getInitials(name: string): string {
  return name
    .split(' ')
    .slice(0, 2)
    .map((w) => w[0]?.toUpperCase() ?? '')
    .join('');
}

export function formatPrice(amount: number): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
  }).format(amount);
}

export function formatDate(iso: string): string {
  return new Intl.DateTimeFormat('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  }).format(new Date(iso));
}

export function canUserAccess(user: AuthUser | null, role: RoleType): boolean {
  return user?.role === role;
}

export function greeting(): string {
  const h = new Date().getHours();
  if (h < 12) return 'Good morning';
  if (h < 17) return 'Good afternoon';
  return 'Good evening';
}

export function getTodayLabel(): string {
  return new Date().toLocaleDateString('en-US', {
    weekday: 'long',
    month: 'long',
    day: 'numeric',
  });
}

export function getFirstName(name: string | undefined | null, fallback = 'there'): string {
  return name?.split(' ')[0] ?? fallback;
}

const ORDER_ID_LENGTH = 8;
export function formatOrderId(id: string): string {
  return `#${id.slice(0, ORDER_ID_LENGTH).toUpperCase()}`;
}
