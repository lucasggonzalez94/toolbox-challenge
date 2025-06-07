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
import { render, screen, fireEvent } from '@testing-library/react';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import filesReducer, { setFilterName } from '../redux/slices/filesSlice';
import FileFilter from '../components/FileFilter';

const createTestStore = (preloadedState) => {
  return configureStore({
    reducer: {
      files: filesReducer
    },
    preloadedState
  });
};

describe('FileFilter Component', () => {
  test('renderiza correctamente el campo de filtro', () => {
    const store = createTestStore({
      files: { filterName: '', files: [], loading: false, error: null }
    });
    
    render(
      <Provider store={store}>
        <FileFilter />
      </Provider>
    );
    
    // Verificar que el campo de entrada esté presente
    const inputElement = screen.getByPlaceholderText('Filtrar por nombre de archivo');
    expect(inputElement).toBeInTheDocument();
    
    // Verificar que el texto de ayuda esté presente
    const helpText = screen.getByText('Ingresa el nombre del archivo para filtrar (ej: test1)');
    expect(helpText).toBeInTheDocument();
    
    // El botón de limpiar no debería estar visible inicialmente
    const clearButton = screen.queryByTitle('Limpiar filtro');
    expect(clearButton).not.toBeInTheDocument();
  });
  
  test('actualiza el filtro cuando se escribe en el campo', () => {
    const store = createTestStore({
      files: { filterName: '', files: [], loading: false, error: null }
    });

    const dispatchSpy = jest.spyOn(store, 'dispatch');
    
    render(
      <Provider store={store}>
        <FileFilter />
      </Provider>
    );

    const inputElement = screen.getByPlaceholderText('Filtrar por nombre de archivo');
    fireEvent.change(inputElement, { target: { value: 'test' } });
    
    expect(dispatchSpy).toHaveBeenCalledWith(setFilterName('test'));
  });
  
  test('muestra y funciona el botón de limpiar cuando hay texto', () => {
    const store = createTestStore({
      files: { filterName: 'test', files: [], loading: false, error: null }
    });
    
    const dispatchSpy = jest.spyOn(store, 'dispatch');
    
    render(
      <Provider store={store}>
        <FileFilter />
      </Provider>
    );
    
    // El botón de limpiar debería estar visible
    const clearButton = screen.getByTitle('Limpiar filtro');
    expect(clearButton).toBeInTheDocument();
    
    // Hacer clic en el botón de limpiar
    fireEvent.click(clearButton);

    expect(dispatchSpy).toHaveBeenCalledWith(setFilterName(''));
  });
});
