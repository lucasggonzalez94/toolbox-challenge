import config from '../config';

class ApiService {
  async getFilesData(fileName = null) {
    try {
      const url = fileName 
        ? `${config.endpoints.files.data}?fileName=${fileName}` 
        : config.endpoints.files.data;
      
      const response = await fetch(url, {
        method: 'GET',
        headers: {
          'Accept': 'application/json'
        },
      });
      
      if (!response.ok) {
        throw new Error(`Error: ${response.status} ${response.statusText}`);
      }
      
      return await response.json();
    } catch (error) {
      throw error;
    }
  }

  async getFilesList() {
    try {
      const response = await fetch(config.endpoints.files.list, {
        method: 'GET',
        headers: {
          'Accept': 'application/json'
        },
      });
      
      if (!response.ok) {
        throw new Error(`Error: ${response.status} ${response.statusText}`);
      }
      
      const data = await response.json();
      return data.files || [];
    } catch (error) {
      throw error;
    }
  }
}

export default new ApiService();
