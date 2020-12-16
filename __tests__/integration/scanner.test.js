const supertest = require('supertest');
const fs = require('fs');
const path = require('path');
const app = require('../../src/app');

const request = supertest(app);

describe('scanner', () => {
  it('should be able to detect plant', async () => {
    const filePath = path.join(__dirname, '../assets/plant.jpg');
    const data = fs.readFileSync(filePath, { encoding: 'base64' });
    const response = await request.post('/scanner').send({
      filename: 'OutputImage',
      mime: 'jpeg',
      plantType: 'leaf',
      data,
    });

    expect(response.status).toBe(200);
  });

  it('should not be able to detect plant since required fields wasnt filled', async () => {
    const response = await request.post('/scanner').send({});
    expect(response.status).toBe(400);
  });
});
