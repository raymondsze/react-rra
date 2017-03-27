import { typeResolvers as userTypeRef, queryResolvers as userQueryRes } from './users/resolvers';
import { typeResolvers as postTypeRef, queryResolvers as postQueryRes } from './posts/resolvers';

export default {
  ...userTypeRef,
  ...postTypeRef,
  Query: {
    healthCheck: () => '200',
    ...userQueryRes,
    ...postQueryRes,
  },
  Mutation: {
    healthCheck: () => '200',
  },
};
