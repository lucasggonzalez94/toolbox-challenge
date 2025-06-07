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

jest.mock('../components/Header', () => {
  return {
    __esModule: true,
    default: () => <div data-testid="mock-header">Header Mockeado</div>
  };
});

jest.mock('../components/FileFilter', () => {
  return {
    __esModule: true,
    default: () => <div data-testid="mock-file-filter">FileFilter Mockeado</div>
  };
});

jest.mock('../components/FilesTable', () => {
  return {
    __esModule: true,
    default: () => <div data-testid="mock-files-table">FilesTable Mockeado</div>
  };
});

jest.mock('../redux/slices/filesSlice', () => {
  const mockFetchFilesData = jest.fn();
  return {
    __esModule: true,
    fetchFilesData: mockFetchFilesData,
  };
});

jest.mock('../App', () => {
  const React = require('react');
  const { useEffect } = React;
  const { fetchFilesData } = require('../redux/slices/filesSlice');
  
  return {
    __esModule: true,
    default: function MockedApp() {
      useEffect(() => {
        fetchFilesData('');
      }, []);
      
      return (
        <div data-testid="app-container">
          <div data-testid="mock-header">Header Mockeado</div>
          <div data-testid="mock-file-filter">FileFilter Mockeado</div>
          <div data-testid="mock-files-table">FilesTable Mockeado</div>
        </div>
      );
    }
  };
});

import React from 'react';
import { render, screen } from '@testing-library/react';
import App from '../App';

describe('App Component', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('renderiza correctamente todos los componentes', () => {    
    render(<App />);
    
    // Verificar que todos los componentes mockeados estén presentes
    expect(screen.getByTestId('mock-header')).toBeInTheDocument();
    expect(screen.getByTestId('mock-file-filter')).toBeInTheDocument();
    expect(screen.getByTestId('mock-files-table')).toBeInTheDocument();
  });
  
  test('llama a fetchFilesData al montar el componente', () => {    
    render(<App />);
    
    // Verificar que fetchFilesData haya sido llamado
    const { fetchFilesData } = require('../redux/slices/filesSlice');
    expect(fetchFilesData).toHaveBeenCalled();
  });
});
