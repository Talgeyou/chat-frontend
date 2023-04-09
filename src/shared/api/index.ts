import { fetchUsers } from './fetchUsers';
import { Queries } from './types';

const queries = {
  [Queries.Users]: fetchUsers,
};

export default queries;
