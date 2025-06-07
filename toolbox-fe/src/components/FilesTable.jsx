import React from 'react';
import { useSelector } from 'react-redux';
import { Table, Alert, Spinner } from 'react-bootstrap';

const FilesTable = () => {
  const { data, loading, error } = useSelector(state => state.files);
  
  const flattenedData = Array.isArray(data) ? data.flatMap(fileData => {
    if (!fileData || !Array.isArray(fileData.lines)) return [];
    return fileData.lines.map(line => ({
      file: fileData.file,
      text: line.text,
      number: line.number,
      hex: line.hex
    }));
  }) : [];

  if (loading) {
    return (
      <div className="text-center p-5">
        <Spinner animation="border" role="status">
          <span className="visually-hidden">Cargando...</span>
        </Spinner>
      </div>
    );
  }

  if (error) {
    return <Alert variant="danger">{error}</Alert>;
  }

  if (flattenedData.length === 0) {
    return (
      <Alert variant="info">
        <i className="bi bi-info-circle me-2"></i>
        No se encontraron datos. Intenta con otro filtro o verifica que el servidor esté funcionando correctamente.
      </Alert>
    );
  }

  return (
    <>
      <div className="d-flex justify-content-end mb-2">
        <small className="text-muted">
          <i className="bi bi-info-circle me-1"></i>
          Total de registros: <strong>{flattenedData.length}</strong>
        </small>
      </div>
      <Table striped bordered hover responsive>
        <thead>
          <tr>
            <th>File Name</th>
            <th>Text</th>
            <th>Number</th>
            <th>Hex</th>
          </tr>
        </thead>
      <tbody>
        {flattenedData.map((item, index) => (
          <tr key={index}>
            <td>{item.file}</td>
            <td>{item.text}</td>
            <td className="text-end">{item.number}</td>
            <td><code className="text-break">{item.hex}</code></td>
          </tr>
        ))}
      </tbody>
    </Table>
    </>
  );
};

export default FilesTable;
