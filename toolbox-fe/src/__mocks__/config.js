const API_URL = 'http://localhost:3000';

export default {
  API_URL,
  endpoints: {
    files: {
      data: `${API_URL}/files/data`,
      list: `${API_URL}/files/list`
    }
  }
};
