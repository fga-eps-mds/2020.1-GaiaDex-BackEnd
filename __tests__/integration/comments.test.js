const supertest = require('supertest');
const app = require('../../src/app');
const { Topic: TopicModel } = require('../../src/models/Topic');
const UserModel = require('../../src/models/User');
const PlantModel = require('../../src/models/Plant');
const { defaultPlant1, defaultUser1 } = require('../defaultModels');

const request = supertest(app);

let user;
let commentId;
let topic;
let plant;
let authtoken;

describe('Testing Comments routes', () => {
  beforeEach(async (done) => {
    user = new UserModel(defaultUser1);
    await user.save();
    const login = await request.post('/auth/login').send(defaultUser1);
    authtoken = login.headers.authtoken;

    plant = new PlantModel(defaultPlant1);
    await plant.save();

    topic = new TopicModel({
      title: 'test',
      description: 'test',
      user: user.id,
      plant: plant.id,
    });
    await topic.save();

    const response = await request
      .post(`/comment/create/${topic.id}`)
      .send({
        text: 'Comentario',
      })
      .set('authtoken', `${authtoken}`);

    const responseComment = response.body.comments[0];
    commentId = responseComment._id;
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
      .put(`/comment/update/${commentId}`)
      .send({
        text: 'Comentario atualizado',
      })
      .set('authtoken', `${authtoken}`);
    expect(response.status).toBe(200);
  });

  it('Should not be able to update the comment because there is no text', async () => {
    const response = await request
      .put(`/comment/update/${commentId}`)
      .send({
        text: '',
      })
      .set('authtoken', `${authtoken}`);
    expect(response.status).toBe(400);
  });

  it('Should be able to delete the comment', async () => {
    const response = await request
      .delete(`/comment/delete/${commentId}`)
      .set('authtoken', `${authtoken}`);
    expect(response.status).toBe(200);
  });

  it('like', async () => {
    const response = await request
      .post(`/comment/like/${commentId}`)
      .set('authtoken', `${authtoken}`);

    expect(response.status).toBe(200);
  });

  it('second like shouldnt count', async () => {
    await request
      .post(`/comment/like/${commentId}`)
      .set('authtoken', `${authtoken}`);

    const response = await request
      .post(`/comment/like/${commentId}`)
      .set('authtoken', `${authtoken}`);

    expect(response.status).toBe(200);
    expect(response.body.comments[0].likes.length).toBe(1);
  });

  it('dislike', async () => {
    const response = await request
      .post(`/comment/dislike/${commentId}`)
      .set('authtoken', `${authtoken}`);

    console.log(response.body);
    expect(response.status).toBe(200);
  });

  it('second dislike shouldnt have any effect', async () => {
    await request
      .post(`/comment/dislike/${commentId}`)
      .set('authtoken', `${authtoken}`);

    const response = await request
      .post(`/comment/dislike/${commentId}`)
      .set('authtoken', `${authtoken}`);

    expect(response.status).toBe(200);
  });

  it('dislike should remove like', async () => {
    await request
      .post(`/comment/like/${commentId}`)
      .set('authtoken', `${authtoken}`);

    const response = await request
      .post(`/comment/dislike/${commentId}`)
      .set('authtoken', `${authtoken}`);

    expect(response.status).toBe(200);
    expect(response.body.comments[0].likes.length).toBe(0);
  });
});
