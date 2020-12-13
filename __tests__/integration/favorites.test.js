const supertest = require('supertest');
const app = require('../../src/app');
const UserModel = require('../../src/models/User');
const PlantModel = require('../../src/models/Plant');
const {
  defaultUser2,
  defaultPlant1,
  defaultPlant2,
} = require('../defaultModels');

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
  it('should add a new favored plant.', async () => {
    const response = await request.post(
      `/favorites/add/${user.id}/${plant.id}/`
    );

    expect(response.status).toBe(200);
  });

  it('should add two plants.', async () => {
    const plant2 = new PlantModel(defaultPlant2);
    await plant2.save();
    await request.post(`/favorites/add/${user.id}/${plant.id}/`);

    const response = await request.post(
      `/favorites/add/${user.id}/${plant2.id}/`
    );

    expect(response.status).toBe(200);
  });

  it("shouldn't add same plant for the second time.", async () => {
    await request.post(`/favorites/add/${user.id}/${plant.id}/`);

    const response = await request.post(
      `/favorites/add/${user.id}/${plant.id}/`
    );
    console.log(response.body);
    expect(response.status).toBe(400);
    expect(response.body.error).toBe(
      "Error while adding new favorite plant. Error: invalid plant/user or it's already been added"
    );
  });

  it('wont add favorite. invalid request 1.', async () => {
    const response = await request.post(`/favorites/add/`);

    expect(response.status).toBe(404);
  });

  it('wont add favorite. invalid request 2.', async () => {
    const response = await request.post(`/favorites/add/${user.id}/${user.id}`);
    console.log(response.body);
    expect(response.status).toBe(400);
  });

  // listing
  it('It should be possible to see a list of favorite plants.', async () => {
    const response = await request.get(`/favorites/list/${user.id}/`);
    expect(response.status).toBe(200);
  });

  it('wont see a list of favorite plants.', async () => {
    const response = await request.get(`/favorites/list/${plant.id}/`);
    expect(response.status).toBe(400);
  });

  it('wont see a list of favorite plants.', async () => {
    const response = await request.get(`/favorites/list/`);
    expect(response.status).toBe(404);
  });

  // deletion
  it('should delete a plant from favorites.', async () => {
    await request.post(`/favorites/add/${user.id}/${plant.id}/`);

    const response = await request.delete(
      `/favorites/delete/${user.id}/${plant.id}/`
    );

    expect(response.status).toBe(200);
    expect(response.body.message).toBe('Favorite deleted successfuly');
  });

  // deletion
  it("shouldn't delete a plant that wasn't added to favorites.", async () => {
    const response = await request.delete(
      `/favorites/delete/${user.id}/${plant.id}/`
    );

    expect(response.status).toBe(400);
    expect(response.body.error).toBe(
      `Could not delete Plant from favorites since it wasn't added first.`
    );
  });

  it('invalid delete request.', async () => {
    const response = await request.delete(
      `/favorites/delete/asdhausdh/asdasjkdah/`
    );

    expect(response.status).toBe(400);
    expect(response.body.error).not.toBe(
      `Could not delete Plant from favorites since it wasn't added first.`
    );
  });
});
