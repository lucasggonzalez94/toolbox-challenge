class MockImportMeta {
  constructor() {
    this.env = {
      PROD: false,
      DEV: true,
      MODE: 'test',
      BASE_URL: '/',
      VITE_API_URL: 'http://localhost:3000'
    };
  }
}

global.import = { meta: new MockImportMeta() };

jest.mock('./src/config', () => {
  const API_URL = 'http://localhost:3000';
  
  return {
    __esModule: true,
    default: {
      API_URL,
      endpoints: {
        files: {
          data: `${API_URL}/files/data`,
          list: `${API_URL}/files/list`
        }
      }
    }
  };
}, { virtual: true });
