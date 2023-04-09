export const BASE_API_URL = process.env.NEXT_PUBLIC_API_URL;

if (!BASE_API_URL) {
  throw new Error('You should specify NEXT_PUBLIC_API_URL in env variables');
}
