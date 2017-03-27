const typeResolvers = {
  User: {
    id: data => data.id,
    firstName: data => data.first_name,
    lastName: data => data.last_name,
    profileImage: data => data.profile_image,
    createdAt: data => data.created_at,
    updatedAt: data => data.updated_at,
  },
};

const queryResolvers = {
  async user(root, { id }) {
    return { id, firstName: 'Raymond', lastName: 'Sze' };
  },
};

export { typeResolvers, queryResolvers };
