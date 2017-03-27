import faker from 'faker';
import uuid from 'uuid';

faker.locale = 'en';
const posts = new Array(100).fill({}).map(() => ({
  id: uuid.v4(),
  title: faker.random.words(),
  subtitle: faker.random.words(),
  image: faker.image.image(),
  author: faker.name.findName(),
  created_at: faker.date.recent(10),
  updated_at: faker.date.recent(10),
}));

const indexedPosts = posts.reduce((result, value, index) => ({
  ...result,
  [value.id]: {
    index,
    value,
  },
}), []);

const typeResolvers = {
  Post: {
    id: data => data.id,
    author: data => data.author,
    title: data => data.title,
    subtitle: data => data.subtitle,
    image: data => data.image,
    createdAt: data => data.created_at,
    updatedAt: data => data.updated_at,
  },
};

const queryResolvers = {
  async post(root, { id }) {
    return indexedPosts[id].value;
  },
  async posts(root, { cursor }) {
    let index = indexedPosts[cursor] ? indexedPosts[cursor].index : 0;
    index = Math.min(index + 1, posts.length - 1);
    const entries = posts.slice(index, Math.min(index + 20, posts.length));
    return {
      cursor: entries[entries.length - 1].id,
      posts: entries,
    };
  },
};

export { typeResolvers, queryResolvers };
