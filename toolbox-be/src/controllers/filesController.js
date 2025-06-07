const fileProcessorService = require('../services/fileProcessorService');
const externalApiService = require('../services/externalApiService');

class FilesController {
  async getData(req, res, next) {
    try {
      const fileName = req.query.fileName || null;
      const data = await fileProcessorService.processFiles(fileName);
      res.json(data);
    } catch (error) {
      next(error);
    }
  }

  async getFilesList(req, res, next) {
    try {
      const files = await externalApiService.getFilesList();
      res.json({ files });
    } catch (error) {
      next(error);
    }
  }
}

module.exports = new FilesController();
