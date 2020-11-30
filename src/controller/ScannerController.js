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

class ScannerController{
    static async scanner(req, res){
        try {
            const apiKey = process.env.PLANT_NET_API_KEY; // api key do plant net
            const { data, filename, mime, plantType } = req.body;
            const requireFields = { data, filename, mime, plantType };
            const erros = [];
            Object.entries(requireFields).forEach(([key, value]) => {
              if (!value) erros.push(`${key} is required`);
            });
            if (erros.length) throw erros;
            const fileFormat = mime.split('/').pop();
            const filePath = path.join(__dirname, '..', `${filename}.${fileFormat}`);
            fs.writeFileSync(filePath, data, { encoding: 'base64' });
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
            fs.unlinkSync(filePath);
            res.send(response.data);
        } catch (err) {
            if (Array.isArray(err)) res.status(400).send({ errors: err });
            next(err);
        }
    }
}

module.exports = ScannerController;
