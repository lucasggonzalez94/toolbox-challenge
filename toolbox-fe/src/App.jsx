import { useEffect } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { Container, Row, Col } from 'react-bootstrap'
import './App.css'
import Header from './components/Header'
import FileFilter from './components/FileFilter'
import FilesTable from './components/FilesTable'
import { fetchFilesData } from './redux/slices/filesSlice'

function App() {
  const dispatch = useDispatch()
  const { filterName } = useSelector(state => state.files)

  useEffect(() => {
    dispatch(fetchFilesData(filterName))
  }, [dispatch, filterName])

  // Manejador para el cambio en el filtro

  return (
    <Container fluid className="p-3">
      <Header />

      <Row className="mb-3">
        <Col>
          <FileFilter />
        </Col>
      </Row>

      <Row>
        <Col>
          <FilesTable />
        </Col>
      </Row>
    </Container>
  )
}

export default App
