import { dataIdFromObject } from '~/app/redux/apolloClient';

describe('apolloClient', () => {
  describe('dataIdFromObject', () => {
    const value = {
      id: 'id',
      __typename: 'test',
    };
    it('should return {__typename}{id} if result is { id, __typename }', () => {
      /* eslint-disable no-underscore-dangle */
      expect(dataIdFromObject(value)).toEqual(`${value.__typename}${value.id}`);
      /* eslint-enable no-underscore-dangle */
    });
    it('should return null if result is empty', () => {
      expect(dataIdFromObject({})).toEqual(null);
    });
  });
});
