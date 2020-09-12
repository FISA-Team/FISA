export default {
  get: jest.fn(() => Promise.resolve({ data: null })),
  put: jest.fn(() => Promise.resolve()),
  post: jest.fn(() => Promise.resolve()),
  delete: jest.fn(() => Promise.resolve()),
};
