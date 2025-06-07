const express = require('express');
const filesController = require('../controllers/filesController');

const router = express.Router();

// Ruta para obtener los datos procesados de los archivos
router.get('/data', filesController.getData);

// Ruta para obtener la lista de archivos
router.get('/list', filesController.getFilesList);

module.exports = router;
