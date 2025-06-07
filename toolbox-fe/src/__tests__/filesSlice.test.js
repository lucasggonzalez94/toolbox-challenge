jest.mock('../services/apiService', () => ({
  __esModule: true,
  default: {
    getFilesData: jest.fn().mockResolvedValue([]),
    getFilesList: jest.fn().mockResolvedValue([])
  }
}));

import filesReducer, { 
  setFilterName, 
  clearError, 
  fetchFilesData 
} from '../redux/slices/filesSlice';

describe('Files Slice', () => {
  const initialState = {
    data: [],
    loading: false,
    error: null,
    filterName: ''
  };

  describe('Reducers', () => {
    test('debería manejar el estado inicial', () => {
      expect(filesReducer(undefined, { type: 'unknown' })).toEqual(initialState);
    });

    test('debería manejar setFilterName', () => {
      const actual = filesReducer(initialState, setFilterName('test'));
      expect(actual.filterName).toEqual('test');
    });

    test('debería manejar clearError', () => {
      const stateWithError = {
        ...initialState,
        error: 'Error de prueba'
      };
      const actual = filesReducer(stateWithError, clearError());
      expect(actual.error).toBeNull();
    });
  });

  describe('Thunks', () => {
    let dispatch;
    let getState;
    let apiService;

    beforeEach(() => {
      dispatch = jest.fn();
      getState = jest.fn();
      apiService = require('../services/apiService').default;
    });

    test('fetchFilesData debería manejar una respuesta exitosa', async () => {
      const mockData = [
        {
          file: 'test1.csv',
          lines: [
            { text: 'Texto 1', number: 123, hex: 'ABC123' }
          ]
        }
      ];
      
      apiService.getFilesData.mockResolvedValueOnce(mockData);
      
      const thunk = fetchFilesData('test');
      
      // Ejecutar el thunk
      await thunk(dispatch, getState);
      
      // Verificar que se llamó a la API con el parámetro correcto
      expect(apiService.getFilesData).toHaveBeenCalledWith('test');

      const [pendingAction, fulfilledAction] = dispatch.mock.calls.map(call => call[0]);
      
      expect(pendingAction.type).toBe('files/fetchFilesData/pending');
      expect(fulfilledAction.type).toBe('files/fetchFilesData/fulfilled');
      expect(fulfilledAction.payload).toEqual(mockData);
    });

    test('fetchFilesData debería manejar un error', async () => {
      // Configurar el mock para lanzar un error
      const errorMessage = 'Error de prueba';
      apiService.getFilesData.mockRejectedValueOnce(new Error(errorMessage));
      
      // Crear la acción thunk
      const thunk = fetchFilesData('test');
      
      // Ejecutar el thunk
      await thunk(dispatch, getState);

      const [pendingAction, rejectedAction] = dispatch.mock.calls.map(call => call[0]);
      
      expect(pendingAction.type).toBe('files/fetchFilesData/pending');
      expect(rejectedAction.type).toBe('files/fetchFilesData/rejected');
      expect(rejectedAction.payload).toContain(errorMessage);
    });
  });

  describe('Extra Reducers', () => {
    test('debería manejar fetchFilesData.pending', () => {
      const action = { type: fetchFilesData.pending.type };
      const state = filesReducer(initialState, action);
      expect(state.loading).toBe(true);
      expect(state.error).toBeNull();
    });

    test('debería manejar fetchFilesData.fulfilled', () => {
      const mockData = [{ file: 'test.csv', lines: [] }];
      const action = { 
        type: fetchFilesData.fulfilled.type,
        payload: mockData
      };
      const state = filesReducer(initialState, action);
      expect(state.loading).toBe(false);
      expect(state.data).toEqual(mockData);
    });

    test('debería manejar fetchFilesData.rejected', () => {
      const errorMessage = 'Error de prueba';
      const action = { 
        type: fetchFilesData.rejected.type,
        payload: errorMessage
      };
      const state = filesReducer(initialState, action);
      expect(state.loading).toBe(false);
      expect(state.error).toBe(errorMessage);
    });
  });
});
