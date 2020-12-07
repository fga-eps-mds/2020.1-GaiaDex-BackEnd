const supertest = require('supertest');
const app = require('../../src/app');
const { Topic: TopicModel } = require('../../src/models/Topic');
const UserModel = require('../../src/models/User');
const PlantModel = require('../../src/models/Plant');
const CommentModel = require('../../src/models/Comment');
const { defaultPlant1, defaultUser1 } = require('../defaultModels');

const request = supertest(app);

let user;
let comment;
let topic;
let plant;
let authtoken;
describe('comment/', () => {
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

    comment = new CommentModel({
      text: 'test',
      user: user.id,
      topic: topic.id,
    });
    await comment.save();

    const login = await request.post('/auth/login').send(defaultUser1);

    authtoken = login.headers.authtoken;

    done();
  });

  it('Should be able to comment because there is text', async () => {
    const response = await request
      .post(`/comment/create/${topic.id}`)
      .send({
        text: 'Comentario',
      })
      .set('authtoken', `${authtoken}`);

    expect(response.status).toBe(200);
  });

  it('Should not be able to comment because there is no text', async () => {
    const response = await request
      .post(`/comment/create/${topic.id}`)
      .send({
        text: '',
      })
      .set('authtoken', `${authtoken}`);

    expect(response.status).toBe(400);
  });

  it('Should be able to update the comment because there is text', async () => {
    const response = await request
      .put(`/comment/update/${comment.id}`)
      .send({
        text: 'Comentario atualizado',
      })
      .set('authtoken', `${authtoken}`);
    expect(response.status).toBe(200);
  });

  it('Should not be able to update the comment because there is no text', async () => {
    const response = await request
      .put(`/comment/update/${comment.id}`)
      .send({
        text: '',
      })
      .set('authtoken', `${authtoken}`);
    expect(response.status).toBe(400);
  });

  it('Should be able to delete the comment', async () => {
    const response = await request
      .delete(`/comment/delete/${comment.id}`)
      .set('authtoken', `${authtoken}`);
    expect(response.status).toBe(200);
  });

  it('Should be able to like the comment', async () => {
    const response = await request
      .post(`/comment/like/${comment.id}`)
      .set('authtoken', `${authtoken}`);
    expect(response.status).toBe(200);
  });

  it('Should be able to dislike the comment', async () => {
    const response = await request
      .post(`/comment/dislike/${comment.id}`)
      .set('authtoken', `${authtoken}`);

    expect(response.status).toBe(200);
  });
});
