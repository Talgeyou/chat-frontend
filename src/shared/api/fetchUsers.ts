import { BASE_API_URL } from './constants';

export async function fetchUsers() {
  return await fetch(`${BASE_API_URL}users`).then((res) => res.json());
}
