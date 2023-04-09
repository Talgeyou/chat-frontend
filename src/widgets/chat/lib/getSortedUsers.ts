import { User } from '@prisma/client';

export function getSortedUsers(users: User[]) {
  return users
    .reduce(
      (result, user) =>
        result.some((item) => item.id === user.id) ? result : [...result, user],
      [] as User[],
    )
    .sort((a, b) => {
      if (!a.name || !b.name || a.name === b.name) {
        return 0;
      }

      if (a.name > b.name) {
        return 1;
      }

      return -1;
    });
}
