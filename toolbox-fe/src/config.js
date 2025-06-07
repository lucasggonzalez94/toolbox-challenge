// Determinar la URL de la API según el entorno
const API_URL = import.meta.env.PROD 
  ? 'http://backend:3000' 
  : 'http://localhost:3000';

export default {
  API_URL,
  endpoints: {
    files: {
      data: `${API_URL}/files/data`,
      list: `${API_URL}/files/list`
    }
  }
};
