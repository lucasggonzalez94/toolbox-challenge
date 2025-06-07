jest.mock('../config', () => ({
  __esModule: true,
  default: {
    API_URL: 'http://localhost:3000',
    endpoints: {
      files: {
        data: 'http://localhost:3000/files/data',
        list: 'http://localhost:3000/files/list'
      }
    }
  }
}));

global.fetch = jest.fn();

import apiService from '../services/apiService';
import config from '../config';

describe('API Service', () => {
  beforeEach(() => {
    // Limpiar todos los mocks antes de cada prueba
    jest.clearAllMocks();
  });

  describe('getFilesData', () => {
    test('debería obtener datos correctamente sin filtro', async () => {
      // Datos de prueba
      const mockData = [
        {
          file: 'test1.csv',
          lines: [
            { text: 'Texto 1', number: 123, hex: 'ABC123' }
          ]
        }
      ];
      
      // Configurar el mock de fetch para devolver datos
      global.fetch.mockResolvedValueOnce({
        ok: true,
        json: async () => mockData
      });
      
      // Llamar al método
      const result = await apiService.getFilesData();
      
      // Verificar que fetch fue llamado con los parámetros correctos
      expect(fetch).toHaveBeenCalledWith(
        config.endpoints.files.data,
        expect.objectContaining({
          method: 'GET',
          headers: expect.objectContaining({
            'Accept': 'application/json'
          })
        })
      );
      
      // Verificar el resultado
      expect(result).toEqual(mockData);
    });
    
    test('debería obtener datos correctamente con filtro', async () => {
      const mockData = [
        {
          file: 'test1.csv',
          lines: [
            { text: 'Texto 1', number: 123, hex: 'ABC123' }
          ]
        }
      ];
      
      const fileName = 'test1';
      
      // Configurar el mock de fetch para devolver datos
      global.fetch.mockResolvedValueOnce({
        ok: true,
        json: async () => mockData
      });
      
      // Llamar al método
      const result = await apiService.getFilesData(fileName);
      
      // Verificar que fetch fue llamado con los parámetros correctos
      expect(fetch).toHaveBeenCalledWith(
        `${config.endpoints.files.data}?fileName=${fileName}`,
        expect.objectContaining({
          method: 'GET',
          headers: expect.objectContaining({
            'Accept': 'application/json'
          })
        })
      );
      
      // Verificar el resultado
      expect(result).toEqual(mockData);
    });
    
    test('debería manejar errores de respuesta', async () => {
      global.fetch.mockResolvedValueOnce({
        ok: false,
        status: 404,
        statusText: 'Not Found'
      });
      
      // Verificar que se lanza un error
      await expect(apiService.getFilesData()).rejects.toThrow('Error: 404 Not Found');
    });
    
    test('debería manejar errores de red', async () => {
      const networkError = new Error('Network Error');
      global.fetch.mockRejectedValueOnce(networkError);
      
      // Verificar que se lanza un error
      await expect(apiService.getFilesData()).rejects.toThrow(networkError);
    });
  });
  
  describe('getFilesList', () => {
    test('debería obtener la lista de archivos correctamente', async () => {
      const mockData = {
        files: ['test1.csv', 'test2.csv']
      };

      global.fetch.mockResolvedValueOnce({
        ok: true,
        json: async () => mockData
      });
      
      // Llamar al método
      const result = await apiService.getFilesList();
      
      // Verificar que fetch fue llamado con los parámetros correctos
      expect(fetch).toHaveBeenCalledWith(
        config.endpoints.files.list,
        expect.objectContaining({
          method: 'GET',
          headers: expect.objectContaining({
            'Accept': 'application/json'
          })
        })
      );
      
      // Verificar el resultado
      expect(result).toEqual(mockData.files);
    });
    
    test('debería manejar respuesta sin archivos', async () => {
      const mockData = {};
      
      global.fetch.mockResolvedValueOnce({
        ok: true,
        json: async () => mockData
      });
      
      // Llamar al método
      const result = await apiService.getFilesList();
      
      // Verificar el resultado
      expect(result).toEqual([]);
    });
    
    test('debería manejar errores de respuesta', async () => {
      // Configurar el mock de fetch para devolver un error
      global.fetch.mockResolvedValueOnce({
        ok: false,
        status: 500,
        statusText: 'Internal Server Error'
      });
      
      // Verificar que se lanza un error
      await expect(apiService.getFilesList()).rejects.toThrow('Error: 500 Internal Server Error');
    });
  });
});
