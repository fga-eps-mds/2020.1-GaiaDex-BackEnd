const supertest = require('supertest');
const app = require('../../src/app');
const { Topic: TopicModel } = require('../../src/models/Topic');
const UserModel = require('../../src/models/User');
const PlantModel = require('../../src/models/Plant');
const { defaultPlant1, defaultUser1 } = require('../defaultModels');

const request = supertest(app);

let user;
let plant;
let topic;

describe('topic/', () => {
  beforeEach(async (done) => {
    user = new UserModel(defaultUser1);
    await user.save();

    plant = new PlantModel(defaultPlant1);
    await plant.save();

    topic = new TopicModel({
      title: 'test',
      description: 'test',
      user: user.id,
      plant: plant.id,
    });
    await topic.save();
    done();
  });

  // Creation
  it('Should be able to create a new topic.', async () => {
    const response = await request
      .post(`/topic/create/${plant.id}/${user.id}/`)
      .send({
        title: 'Titulo Tópico',
        description: 'Dúvidas sobre planta',
      });

    expect(response.status).toBe(200);
  });

  it('Should not be able to create a new topic because there is no topic title.', async () => {
    const response = await request
      .post(`/topic/create/${plant.id}/${user.id}/`)
      .send({
        description: 'Dúvidas sobre planta',
      });

    expect(response.status).toBe(400);
  });

  it('Should not be able to create a new topic because topic title is too short.', async () => {
    const response = await request
      .post(`/topic/create/${plant.id}/${user.id}/`)
      .send({
        title: '',
        description: 'Dúvidas sobre planta',
      });

    expect(response.status).toBe(400);
  });

  it('Should not be able to create a new topic because user is not valid.', async () => {
    const response = await request
      .post(`/topic/create/${plant.id}/notValidUserId`)
      .send({
        title: 'Título Tópico',
        description: 'Dúvidas sobre planta',
      });

    expect(response.status).toBe(400);
  });

  it('Should not be able to create a new topic because plant is not valid.', async () => {
    const response = await request
      .post(`/topic/create/notValidPlantId/${user.id}`)
      .send({
        title: 'Título Tópico',
        description: 'Dúvidas sobre planta',
      });

    expect(response.status).toBe(400);
  });

  // Update
  it('Should be able to update a topic.', async () => {
    const response = await request.put(`/topic/update/${topic.id}/`).send({
      title: 'Titulo Novo',
      description: 'Nova descrição.',
    });

    expect(response.status).toBe(200);
  });

  it('Should be able to update, even tho title isnt being passed', async () => {
    const response = await request.put(`/topic/update/${topic.id}/`).send({
      description: 'Descrição aleatória',
    });

    expect(response.status).toBe(200);
  });

  it('Should not be able to update a topic because new title is too short.', async () => {
    const response = await request.put(`/topic/update/${topic.id}/`).send({
      title: '',
      description: 'Descrição aleatória',
    });

    expect(response.status).toBe(400);
  });

  it('Should not be able to update a topic because topic does not have a body.', async () => {
    const response = await request.put(`/topic/update/${topic.id}/`).send({});

    expect(response.status).toBe(400);
  });

  it('Should not be able to update a topic because topic id does not exist', async () => {
    const response = await request.put(`/topic/update/dahkaaççhjkadsha/`).send({
      title: 'Titulo Novo',
      description: 'Nova descrição.',
    });

    expect(response.status).toBe(400);
  });

  // Find
  it('Should be able to find a topic.', async () => {
    const response = await request.get(`/topic/find/${topic.id}/`);

    expect(response.status).toBe(200);
  });

  it('Should not be able to find a topic because topic id does not exist.', async () => {
    const response = await request.get(
      `/topic/find/93293034sdjajsdajkdawdjjawkja/`
    );

    expect(response.status).toBe(400);
  });

  // Like
  it('Should be able to like a topic.', async () => {
    const login = await request.post('/auth/login').send(defaultUser1);

    const { authtoken } = login.headers;

    const response = await request
      .post(`/topic/like/${topic.id}/`)
      .set('authtoken', `${authtoken}`);
    expect(response.status).toBe(200);
  });

  // Dislike
  it('Should be able to dislike a topic.', async () => {
    const login = await request.post('/auth/login').send(defaultUser1);

    const { authtoken } = login.headers;
    await request
      .post(`/topic/like/${topic.id}/`)
      .set('authtoken', `${authtoken}`);

    const response = await request
      .post(`/topic/dislike/${topic.id}/`)
      .set('authtoken', `${authtoken}`);

    expect(response.status).toBe(200);
  });

  // Delete

  it('Should be able to delete a topic.', async () => {
    const response = await request.delete(`/topic/delete/${topic.id}/`);

    expect(response.status).toBe(200);
  });

  it('Should not be able to delete a topic because topic id does not exist.', async () => {
    const response = await request.delete(`/topic/delete/ççsajaKSiiidajad/`);
    expect(response.status).toBe(400);
  });

  // List
  it('Should be able to list all topics.', async () => {
    const response = await request.get(`/topic/list/`);

    expect(response.status).toBe(200);
  });
});
