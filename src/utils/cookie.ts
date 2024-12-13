import { setCookie, parseCookies, destroyCookie } from 'nookies';

export const setAuthCookie = (
  key: string,
  value: Record<string, unknown>,
  options: Record<string, unknown> = {}
) => {
  setCookie(null, key, JSON.stringify(value), {
    maxAge: 30 * 24 * 60 * 60,
    path: '/',
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    httpOnly: true,
    ...options,
  });
};

export const getAuthCookie = (key: string): Record<string, unknown> | null => {
  const cookies = parseCookies();
  try {
    return cookies[key] ? JSON.parse(cookies[key]) : null;
  } catch (error) {
    console.error(`Error parsing cookie: ${key}`, error);
    return null;
  }
};

export const removeAuthCookie = (key: string): void => {
  destroyCookie(null, key, { path: '/' });
};
