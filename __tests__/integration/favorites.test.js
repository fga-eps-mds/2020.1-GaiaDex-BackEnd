const supertest = require('supertest');
const app = require('../../src/app');
const UserModel = require('../../src/models/User');
const PlantModel = require('../../src/models/Plant');
const { defaultUser2, defaultPlant1 } = require('../defaultModels');

const request = supertest(app);

let user;
let plant;

describe('favorite/', () => {
  beforeEach(async (done) => {
    user = new UserModel(defaultUser2);
    await user.save();

    plant = new PlantModel(defaultPlant1);
    await plant.save();
    done();
  });

  // addition
  it('It should be possible to add a new favored plant.', async () => {
    const response = await request.post(
      `/favorites/add/${user.id}/${plant.id}/`
    );

    expect(response.status).toBe(200);
  });

  it('It not should be possible to add a new favored plant.', async () => {
    const response = await request.post(
      `/favorites/add/${plant.id}/${user.id}/`
    );

    expect(response.status).toBe(400);
  });

  it('It not should be possible to add a new favored plant.', async () => {
    const response = await request.post(`/favorites/add/`);
    expect(response.status).toBe(404);
  });

  it('It not should be possible to add a new favored plant.', async () => {
    const response = await request.post(`/favorites/add/${user.id}/`);
    expect(response.status).toBe(404);
  });

  it('It not should be possible to add a new favored plant.', async () => {
    const response = await request.post(`/favorites/add/${plant.id}/`);
    expect(response.status).toBe(404);
  });

  // listing
  it('It should be possible to see a list of favorite plants.', async () => {
    const response = await request.get(`/favorites/list/${user.id}/`);
    expect(response.status).toBe(200);
  });

  it('It not should be possible to see a list of favorite plants.', async () => {
    const response = await request.get(`/favorites/list/${plant.id}/`);
    expect(response.status).toBe(400);
  });

  it('It not should be possible to see a list of favorite plants.', async () => {
    const response = await request.get(`/favorites/list/`);
    expect(response.status).toBe(404);
  });

  // deletion
  it('Must be able to delete a favorite plant.', async () => {
    const response = await request.delete(
      `/favorites/delete/${user.id}/${plant.id}/`
    );

    expect(response.status).toBe(200);
  });

  it('Must be able to delete a favorite plant.', async () => {
    const response = await request.delete(
      `/favorites/delete/${plant.id}/${user.id}/`
    );

    expect(response.status).toBe(400);
  });

  it('Must be able to delete a favorite plant.', async () => {
    const response = await request.delete(`/favorites/delete/`);
    expect(response.status).toBe(404);
  });

  it('Must be able to delete a favorite plant.', async () => {
    const response = await request.delete(`/favorites/delete/${user.id}/`);

    expect(response.status).toBe(404);
  });

  it('Must be able to delete a favorite plant.', async () => {
    const response = await request.delete(`/favorites/delete/${plant.id}/`);

    expect(response.status).toBe(404);
  });
});
