import React from 'react';
import { render, screen } from '@testing-library/react';
import Header from '../components/Header';

describe('Header Component', () => {
  test('renderiza correctamente el título de la aplicación', () => {
    render(<Header />);
    
    // Verificar que el título esté presente en el documento
    const titleElement = screen.getByText('React Test App');
    expect(titleElement).toBeInTheDocument();
    
    // Verificar que el título esté dentro de un h1
    expect(titleElement.tagName).toBe('H1');
    
    // Verificar que el contenedor tenga las clases correctas
    const containerDiv = titleElement.closest('div');
    expect(containerDiv).toHaveClass('bg-danger');
    expect(containerDiv).toHaveClass('text-white');
    expect(containerDiv).toHaveClass('p-2');
  });
});
