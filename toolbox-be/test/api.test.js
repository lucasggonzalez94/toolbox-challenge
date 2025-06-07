const chai = require('chai');
const chaiHttp = require('chai-http');
const sinon = require('sinon');
const { expect } = chai;
const app = require('../src/app');
const externalApiService = require('../src/services/externalApiService');

chai.use(chaiHttp);

describe('API Tests', () => {
  describe('GET /files/data', () => {
    beforeEach(() => {
      // Restaurar todos los stubs antes de cada prueba
      sinon.restore();
    });

    it('debería devolver un array vacío cuando no hay archivos disponibles', async () => {
      // Mock del servicio externo para que devuelva una lista vacía de archivos
      sinon.stub(externalApiService, 'getFilesList').resolves([]);

      const res = await chai.request(app).get('/files/data');
      
      expect(res).to.have.status(200);
      expect(res).to.be.json;
      expect(res.body).to.be.an('array').that.is.empty;
    });

    it('debería devolver datos formateados correctamente cuando hay archivos válidos', async () => {
      // Mock del servicio externo para que devuelva una lista de archivos
      sinon.stub(externalApiService, 'getFilesList').resolves(['file1.csv']);
      
      // Mock del contenido del archivo
      const mockFileContent = 
        'file,text,number,hex\n' +
        'file1.csv,RgTya,64075909,70ad29aacf0b690b0467fe2b2767f765\n' +
        'file1.csv,AtjW,6,d33a8ca5d36d3106219f66f939774cf5\n';
      
      sinon.stub(externalApiService, 'getFileContent').resolves(mockFileContent);

      const res = await chai.request(app).get('/files/data');
      
      expect(res).to.have.status(200);
      expect(res).to.be.json;
      expect(res.body).to.be.an('array');
      expect(res.body).to.have.lengthOf(1);
      expect(res.body[0]).to.have.property('file', 'file1.csv');
      expect(res.body[0]).to.have.property('lines').that.is.an('array');
      expect(res.body[0].lines).to.have.lengthOf(2);
      expect(res.body[0].lines[0]).to.have.property('text', 'RgTya');
      expect(res.body[0].lines[0]).to.have.property('number', 64075909);
      expect(res.body[0].lines[0]).to.have.property('hex', '70ad29aacf0b690b0467fe2b2767f765');
    });

    it('debería filtrar líneas inválidas en los archivos', async () => {
      // Mock del servicio externo para que devuelva una lista de archivos
      sinon.stub(externalApiService, 'getFilesList').resolves(['file1.csv']);
      
      // Mock del contenido del archivo con una línea inválida
      const mockFileContent = 
        'file,text,number,hex\n' +
        'file1.csv,RgTya,64075909,70ad29aacf0b690b0467fe2b2767f765\n' +
        'file1.csv,InvalidLine\n'; // Línea inválida
      
      sinon.stub(externalApiService, 'getFileContent').resolves(mockFileContent);

      const res = await chai.request(app).get('/files/data');
      
      expect(res).to.have.status(200);
      expect(res.body[0].lines).to.have.lengthOf(1); // Solo debe incluir la línea válida
    });

    it('debería filtrar por nombre de archivo cuando se proporciona el parámetro fileName', async () => {
      // Mock del servicio externo para que devuelva una lista de archivos
      sinon.stub(externalApiService, 'getFilesList').resolves(['file1.csv', 'file2.csv']);
      
      // Mock del contenido del archivo
      const mockFileContent1 = 
        'file,text,number,hex\n' +
        'file1.csv,RgTya,64075909,70ad29aacf0b690b0467fe2b2767f765\n';
      
      sinon.stub(externalApiService, 'getFileContent')
        .withArgs('file1.csv').resolves(mockFileContent1);

      const res = await chai.request(app).get('/files/data?fileName=file1.csv');
      
      expect(res).to.have.status(200);
      expect(res.body).to.be.an('array');
      expect(res.body).to.have.lengthOf(1);
      expect(res.body[0]).to.have.property('file', 'file1.csv');
    });
  });

  describe('GET /files/list', () => {
    beforeEach(() => {
      sinon.restore();
    });

    it('debería devolver la lista de archivos disponibles', async () => {
      // Mock del servicio externo para que devuelva una lista de archivos
      const mockFiles = ['file1.csv', 'file2.csv'];
      sinon.stub(externalApiService, 'getFilesList').resolves(mockFiles);

      const res = await chai.request(app).get('/files/list');
      
      expect(res).to.have.status(200);
      expect(res).to.be.json;
      expect(res.body).to.have.property('files').that.is.an('array');
      expect(res.body.files).to.deep.equal(mockFiles);
    });
  });
});
