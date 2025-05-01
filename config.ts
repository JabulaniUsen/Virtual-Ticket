if (!process.env.NEXT_PUBLIC_BASE_URL) {
  throw new Error('NEXT_PUBLIC_BASE_URL environment variable is not defined');
}

if (!process.env.NEXT_PUBLIC_API_URL) {
  throw new Error('NEXT_PUBLIC_API_URL environment variable is not defined');
}

export const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL;
export const API_URL = process.env.NEXT_PUBLIC_API_URL;
