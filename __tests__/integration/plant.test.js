const supertest = require('supertest');
const app = require('../../src/app');
const PlantModel = require('../../src/models/Plant');
const { defaultPlant1, defaultPlant2 } = require('../defaultModels');

const request = supertest(app);
let plant;

describe('/Plant sucess', () => {
  beforeEach(async (done) => {
    plant = new PlantModel(defaultPlant1);
    await plant.save();
    done();
  });

  // REGISTER
  it('should register a plant', async () => {
    const response = await request.post('/plant/register').send(defaultPlant2);
    expect(response.status).toBe(401);
  });

  // SEARCH
  it('should be able to find a plant by her ID', async () => {
    const response = await request.get(`/plant/${plant._id}`);
    expect(response.status).toBe(200);
  });

  // UPDATE
  it('should be able to update plant', async () => {
    const response = await request.put(`/plant/${plant._id}`).send({
      scientificName: 'PlantaNova',
      familyName: 'FamiliaNova',
      genderName: 'Female',
      specieName: 'EspeciesNovass',
      commonName: 'Novissima',
      usage: 'Esta planta e muito moderna e nova',
      firstUser: 'AqueleJovem',
      collectionCount: 1,
      extinction: false,
      profilePicture:
        'https://cdn.pixabay.com/photo/2017/08/18/20/44/flower-2656484_960_720.jpg',
      gbifID: '987643356',
      stateProvince: 'nova_provincia',
      topics: [123452],
    });
    expect(response.status).toBe(400);
  });

  // DELETE
  it('should be able to delete plant', async () => {
    const response = await request.delete(`/plant/${plant._id}`);
    expect(response.status).toBe(200);
  });
});

describe('/Plant fail', () => {
  beforeEach(async (done) => {
    plant = new PlantModel(defaultPlant1);
    await plant.save();
    done();
  });

  // SEARCH
  it('wont find a plant by her ID', async () => {
    const response = await request.get(`/plant/hehehe`);
    expect(response.status).toBe(400);
  });

  // UPDATE
  it('wont update plant', async () => {
    const response = await request.put(`/plant/${plant._id}`).send({});
    expect(response.status).toBe(400);
  });

  // DELETE
  it('wont delete plant', async () => {
    const response = await request.delete(`/plant/hehehe`);
    expect(response.status).toBe(400);
  });
});
