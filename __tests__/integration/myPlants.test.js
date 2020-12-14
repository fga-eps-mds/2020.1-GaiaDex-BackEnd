const supertest = require('supertest');
const app = require('../../src/app');
const UserModel = require('../../src/models/User');
const PlantModel = require('../../src/models/Plant');
const { defaultUser2, defaultPlant1 } = require('../defaultModels');
const myPlantSchema = require('../../src/schemas/myPlantSchema');

const request = supertest(app);

let user;
let plant;

describe('collection ->', () => {
  beforeEach(async (done) => {
    user = new UserModel(defaultUser2);
    await user.save();

    plant = new PlantModel(defaultPlant1);
    await plant.save();
    done();
  });

  it('It should be possible to add a plant to the collection.', async () => {
    const login = await request.post('/auth/login').send(defaultUser2);

    const { authtoken } = login.headers;

    const response = await request
      .post(`/myPlants/add/${plant.id}`)
      .set('authtoken', `${authtoken}`)
      .send({
        nickname: 'newName',
      });
    expect(response.status).toBe(200);
  });

  it('It should not be possible to add a plant to the collection.', async () => {
    const login = await request.post('/auth/login').send(defaultUser2);

    const { authtoken } = login.headers;

    const response = await request
      .post(`/myPlants/add/${plant.id}`)
      .set('authtoken', `${authtoken}`)
      .send({
        nickname: 'A',
      });
    const result = myPlantSchema.validate({ nickname: response.nickname });
    if (result.error) expect(response.status).toBe(400);
  });

  it('It should not be possible to add a plant to the collection.', async () => {
    const login = await request.post('/auth/login').send(defaultUser2);

    const { authtoken } = login.headers;

    const response = await request
      .post(`/myPlants/add/${!plant.id}`)
      .set('authtoken', `${authtoken}`)
      .send({
        nickname: 'newName',
      });
    const result = myPlantSchema.validate({ nickname: response.nickname });
    if (!result.error) expect(response.status).toBe(400);
  });

  it('It should not be possible to add a plant to the collection.', async () => {
    const login = await request.post('/auth/login').send(defaultUser2);

    const { authtoken } = login.headers;

    const response = await request
      .post(`/myPlants/add/${plant.id}`)
      .set('authtoken', `${authtoken}`);
    expect(response.status).toBe(400);
  });

  it('found no plants of my own', async () => {
    const invalidGenericId = user.id;
    const response = await request.get(
      `/myPlants/${user.id}/${invalidGenericId}`
    );
    expect(response.status).toBe(200);
    expect(response.body.message).toBe('Backyard plant not found.');
  });

  it('found my plant', async () => {
    const login = await request.post('/auth/login').send(defaultUser2);

    const { authtoken } = login.headers;

    const {
      body: { myPlant },
    } = await request
      .post(`/myPlants/add/${plant.id}`)
      .set('authtoken', `${authtoken}`)
      .send({
        nickname: 'gisele',
      });
    const response = await request.get(`/myPlants/${user.id}/${myPlant._id}`);
    expect(response.status).toBe(200);
    expect(response.body.message).not.toBe('Backyard plant not found.');
  });

  it('invalid search for my plant', async () => {
    const response = await request.get(`/myPlants/hehehe/hahahah`);
    expect(response.status).toBe(400);
    expect(response.body.message).not.toBe('Backyard plant not found.');
  });

  it('It must be possible to search for a plant by id.', async () => {
    const response = await request.get(`/myPlants/${user.id}/${!plant._id}`);
    expect(response.status).toBe(200);
  });

  // editing
  it('It must be possible to edit the nickname of a particular plant.', async () => {
    const response = await request.put(`/myPlants/edit/${plant.id}`).send({
      nickname: 'newName',
    });
    const result = myPlantSchema.validate({ nickname: response.nickname });
    if (!result.error) expect(response.status).toBe(200);
  });

  it('It must not be possible to edit the nickname of a particular plant.', async () => {
    const response = await request.put(`/myPlants/edit/${plant.id}`).send({
      nickname: 'A',
    });
    const result = myPlantSchema.validate({ nickname: response.nickname });
    if (result.error) expect(response.status).toBe(400);
  });

  it('It must not be possible to edit the nickname of a particular plant.', async () => {
    const response = await request.put(`/myPlants/edit/${plant.id}`);
    expect(response.status).toBe(400);
  });

  it('It must not be possible to edit the nickname of a particular plant.', async () => {
    const response = await request.put(`/myPlants/edit/${!plant.id}`).send({
      nickname: 'newName',
    });
    const result = myPlantSchema.validate({ nickname: response.nickname });
    if (!result.error) expect(response.status).toBe(400);
  });

  it('It must be possible to delete a plant from the collection.', async () => {
    const login = await request.post('/auth/login').send(defaultUser2);

    const { authtoken } = login.headers;

    const responseCreate = await request
      .post(`/myPlants/add/${plant.id}`)
      .set('authtoken', `${authtoken}`)
      .send({ nickname: 'newName' });

    const response = await request.delete(
      `/myPlants/delete/${responseCreate.body.myPlant._id}`
    );
    expect(response.status).toBe(200);
  });

  it('It must not be possible to delete a plant from the collection.', async () => {
    const response = await request.delete(`/myPlants/delete/${plant.id}`);
    expect(response.status).toBe(400);
  });

  it('It must not be possible to delete a plant from the collection.', async () => {
    const response = await request.delete(`/myPlants/delete/`);
    expect(response.status).toBe(404);
  });

  it('list zero plants', async () => {
    const login = await request.post('/auth/login').send(defaultUser2);

    const { authtoken } = login.headers;

    const response = await request
      .get(`/myPlants/`)
      .set('authtoken', `${authtoken}`);
    expect(response.status).toBe(400);
  });

  it('list two plants', async () => {
    const login = await request.post('/auth/login').send(defaultUser2);

    const { authtoken } = login.headers;

    await request
      .post(`/myPlants/add/${plant.id}`)
      .send({
        nickname: 'gisele',
      })
      .set('authtoken', `${authtoken}`);

    await request
      .post(`/myPlants/add/${plant.id}`)
      .send({
        nickname: 'irmaehehe',
      })
      .set('authtoken', `${authtoken}`);

    const response = await request.get(`/myPlants/`);
    expect(response.status).toBe(400);
  });

  it('no list since no user', async () => {
    const response = await request.get(`/myPlants/`);
    expect(response.status).toBe(400);
  });
});
