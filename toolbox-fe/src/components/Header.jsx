import React from 'react';
import { Row, Col } from 'react-bootstrap';

const Header = () => {
  return (
    <Row className="mb-3">
      <Col>
        <div className="bg-danger text-white p-2">
          <h1 className="mb-0">React Test App</h1>
        </div>
      </Col>
    </Row>
  );
};

export default Header;
