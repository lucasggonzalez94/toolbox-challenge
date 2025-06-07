const externalApiService = require('./externalApiService');

class FileProcessorService {
  processLine(line, fileName) {
    const parts = line.split(',');
    
    if (parts.length !== 4) {
      return null;
    }
    
    const [file, text, numberStr, hex] = parts;
    
    if (file !== fileName) {
      return null;
    }
    
    const number = parseInt(numberStr, 10);
    if (isNaN(number)) {
      return null;
    }
    
    if (!/^[0-9a-f]{32}$/i.test(hex)) {
      return null;
    }
    
    return {
      text,
      number,
      hex
    };
  }

  processFileContent(content, fileName) {
    if (!content) {
      return [];
    }
    
    const lines = content.split('\n');
    const processedLines = [];

    for (let i = 1; i < lines.length; i++) {
      const line = lines[i].trim();
      if (!line) {
        continue;
      }
      
      const processedLine = this.processLine(line, fileName);
      if (processedLine) {
        processedLines.push(processedLine);
      }
    }
    
    return processedLines;
  }

  async processFiles(fileNameFilter = null) {
    try {
      let filesList = await externalApiService.getFilesList();

      if (fileNameFilter) {
        const filterLowerCase = fileNameFilter.toLowerCase();
        filesList = filesList.filter(fileName => fileName.toLowerCase().includes(filterLowerCase));
      }
      
      const result = [];
      const promises = filesList.map(async (fileName) => {
        try {
          const fileContent = await externalApiService.getFileContent(fileName);
          const processedLines = this.processFileContent(fileContent, fileName);

          if (processedLines && processedLines.length > 0) {
            result.push({
              file: fileName,
              lines: processedLines
            });
          }
        } catch (error) {
          console.error(`Error procesando el archivo ${fileName}:`, error.message);
        }
      });

      await Promise.allSettled(promises);
      
      return result;
    } catch (error) {
      console.error('Error al procesar los archivos:', error.message);
      return [];
    }
  }
}

module.exports = new FileProcessorService();
