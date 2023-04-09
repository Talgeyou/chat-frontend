import { User } from '@prisma/client';

export function getSortedUsers(users: User[]) {
  return users.sort((a, b) => {
    if (!a.name || !b.name || a.name === b.name) {
      return 0;
    }

    if (a.name > b.name) {
      return 1;
    }

    return -1;
  });
}
