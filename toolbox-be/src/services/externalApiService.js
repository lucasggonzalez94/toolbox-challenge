const axios = require('axios');

const API_BASE_URL = 'https://echo-serv.tbxnet.com/v1/secret';
const API_KEY = 'Bearer aSuperSecretKey';

class ExternalApiService {
  constructor() {
    this.axiosInstance = axios.create({
      baseURL: API_BASE_URL,
      headers: {
        'authorization': API_KEY
      }
    });
    
    this.fileContentCache = {};
    this.filesListCache = null;
    this.errorCache = {};
  }

  async getFilesList() {
    if (this.filesListCache) {
      return this.filesListCache;
    }
    
    try {
      const response = await this.axiosInstance.get('/files');
      this.filesListCache = response.data.files || [];
      return this.filesListCache;
    } catch (error) {
      console.error('Error al obtener la lista de archivos:', error.message);
      return [];
    }
  }

  async getFileContent(fileName) {
    if (this.fileContentCache[fileName]) {
      return this.fileContentCache[fileName];
    }
    
    // Si ya sabemos que este archivo da error, evitamos hacer la solicitud
    if (this.errorCache[fileName]) {
      return '';
    }
    
    try {
      const response = await this.axiosInstance.get(`/file/${fileName}`, {
        responseType: 'text',
        timeout: 5000
      });
      
      this.fileContentCache[fileName] = response.data;
      return response.data;
    } catch (error) {
      this.errorCache[fileName] = true;
      
      console.error(`Error al descargar el archivo ${fileName}:`, error.message);
      return '';
    }
  }
}

module.exports = new ExternalApiService();
