const fs = require('fs'); // File System | Node.js
const axios = require('axios'); // HTTP client
const FormData = require('form-data'); // Readable "multipart/form-data" streams
const path = require('path');
require('dotenv').config();

function openFileReadStream(filePath) {
  return new Promise((resolve, reject) => {
    const readStream = fs.createReadStream(filePath);
    readStream.on('open', () => resolve(readStream));
    readStream.on('error', (err) => reject(err));
  });
}

class ScannerController {
  static async validateBody(requiredFields) {
    const errors = [];
    Object.entries(requiredFields).forEach(([key, value]) => {
      if (!value) errors.push(`${key} is required`);
    });
    if (errors.length) throw errors;
  }

  static async savePhoto({ data, filename, mime }) {
    const fileFormat = mime.split('/').pop();
    const filePath = path.join(__dirname, '..', `${filename}.${fileFormat}`);
    fs.writeFileSync(filePath, data, { encoding: 'base64' });

    return filePath;
  }

  static async fetchPredictions(filePath, plantType, apiKey) {
    const form = new FormData();
    form.append('organs', plantType);
    const stream = await openFileReadStream(filePath);

    form.append('images', stream);

    const response = await axios.post(
      `https://my-api.plantnet.org/v2/identify/all?api-key=${apiKey}`,
      form,
      {
        headers: form.getHeaders(),
      }
    );

    return response.data;
  }

  static async scanner(req, res, next) {
    try {
      const apiKey = process.env.PLANT_NET_API_KEY;

      const { data, filename, mime, plantType } = req.body;
      const requiredFields = { data, filename, mime, plantType };

      await ScannerController.validateBody(requiredFields);
      const filePath = await ScannerController.savePhoto(requiredFields);
      const predictionResults = await ScannerController.fetchPredictions(
        filePath,
        plantType,
        apiKey
      );

      fs.unlinkSync(filePath);
      res.send(predictionResults);
    } catch (err) {
      if (Array.isArray(err)) res.status(400).send({ errors: err });
      next(err);
    }
  }
}

module.exports = ScannerController;
