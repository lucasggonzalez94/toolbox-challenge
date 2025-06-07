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

jest.mock('../services/apiService', () => ({
  __esModule: true,
  default: {
    getFilesData: jest.fn(),
    getFilesList: jest.fn()
  }
}));

import React from 'react';
import { render, screen } from '@testing-library/react';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import filesReducer from '../redux/slices/filesSlice';
import FilesTable from '../components/FilesTable';

const createTestStore = (preloadedState) => {
  return configureStore({
    reducer: {
      files: filesReducer
    },
    preloadedState
  });
};

describe('FilesTable Component', () => {
  test('muestra el spinner de carga cuando loading es true', () => {
    const store = createTestStore({
      files: { 
        filterName: '', 
        data: [], 
        loading: true, 
        error: null 
      }
    });
    
    render(
      <Provider store={store}>
        <FilesTable />
      </Provider>
    );
    
    // Verificar que el spinner esté presente
    const spinner = screen.getByRole('status');
    expect(spinner).toBeInTheDocument();
    
    // Verificar que el texto de carga esté presente
    const loadingText = screen.getByText('Cargando...');
    expect(loadingText).toBeInTheDocument();
  });
  
  test('muestra un mensaje de error cuando hay un error', () => {
    const errorMessage = 'Error al cargar los datos';
    const store = createTestStore({
      files: { 
        filterName: '', 
        data: [], 
        loading: false, 
        error: errorMessage 
      }
    });
    
    render(
      <Provider store={store}>
        <FilesTable />
      </Provider>
    );
    
    // Verificar que el mensaje de error esté presente
    const errorAlert = screen.getByText(errorMessage);
    expect(errorAlert).toBeInTheDocument();
  });
  
  test('muestra un mensaje cuando no hay datos', () => {
    const store = createTestStore({
      files: { 
        filterName: '', 
        data: [], 
        loading: false, 
        error: null 
      }
    });
    
    render(
      <Provider store={store}>
        <FilesTable />
      </Provider>
    );
    
    // Verificar que el mensaje de "no hay datos" esté presente
    const noDataMessage = screen.getByText(/No se encontraron datos/i);
    expect(noDataMessage).toBeInTheDocument();
  });
  
  test('renderiza correctamente la tabla con datos', () => {
    const mockData = [
      {
        file: 'test1.csv',
        lines: [
          { text: 'Texto 1', number: 123, hex: 'ABC123' },
          { text: 'Texto 2', number: 456, hex: 'DEF456' }
        ]
      },
      {
        file: 'test2.csv',
        lines: [
          { text: 'Texto 3', number: 789, hex: 'GHI789' }
        ]
      }
    ];
    
    const store = createTestStore({
      files: { 
        filterName: '', 
        data: mockData, 
        loading: false, 
        error: null 
      }
    });
    
    render(
      <Provider store={store}>
        <FilesTable />
      </Provider>
    );
    
    // Verificar que la tabla esté presente
    const table = screen.getByRole('table');
    expect(table).toBeInTheDocument();
    
    // Verificar que los encabezados de la tabla estén presentes
    expect(screen.getByText('File Name')).toBeInTheDocument();
    expect(screen.getByText('Text')).toBeInTheDocument();
    expect(screen.getByText('Number')).toBeInTheDocument();
    expect(screen.getByText('Hex')).toBeInTheDocument();
    
    // Verificar que los datos estén presentes en la tabla
    expect(screen.getAllByText('test1.csv').length).toBe(2);
    expect(screen.getByText('test2.csv')).toBeInTheDocument();
    expect(screen.getByText('Texto 1')).toBeInTheDocument();
    expect(screen.getByText('Texto 2')).toBeInTheDocument();
    expect(screen.getByText('Texto 3')).toBeInTheDocument();
    expect(screen.getByText('123')).toBeInTheDocument();
    expect(screen.getByText('456')).toBeInTheDocument();
    expect(screen.getByText('789')).toBeInTheDocument();
    expect(screen.getByText('ABC123')).toBeInTheDocument();
    expect(screen.getByText('DEF456')).toBeInTheDocument();
    expect(screen.getByText('GHI789')).toBeInTheDocument();
    
    // Verificar que el contador de registros esté presente
    expect(screen.getByText('Total de registros:')).toBeInTheDocument();
    expect(screen.getByText('3')).toBeInTheDocument();
  });
});
