const supertest = require('supertest');
const app = require('../../src/app');
const TopicModel = require('../../src/models/Topic');
const UserModel = require('../../src/models/User');
const PlantModel = require('../../src/models/Plant');
const CommentModel = require('../../src/models/Comment');

const request = supertest(app);

let user;
let comment;
let topic;
let plant;
let authtoken;
describe('comment/', () => {
  beforeEach(async (done) => {
    user = new UserModel({
      username: 'username',
      password: 'password',
      email: 'email@email.com',
    });
    await user.save();

    plant = new PlantModel({
      scientificName: 'Butia archeri Glassman',
      family_name: 'Arecaceae',
      gender_name: 'Butia',
      specie_name: 'Butia archeri',
      common_name: 'butiazinho',
      usage:
        'A espécie é conhecida popularmente como butiazinho, coqueirinho-do-campo, butiá-do-campo, butiá-do-cerrado ou palmeira-butiá. Em alguns locais do Cerrado, as folhas desta palmeirinha são utilizadas para a confecção de vassouras, daí atribui-se também o nome popular de palmeira-de-vassoura.',
      first_User: ' julceia',
      collection_count: '108',
      extinction: '0',
      profile_picture:
        'https://static.inaturalist.org/photos/68945583/large.jpeg?1587849882',
      gbifID: '28601793778',
      stateProvince: 'Distrito Federal',
      topicos: [],
    });
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

    const login = await request.post('/auth/login').send({
      username: 'username',
      password: 'password',
      email: 'email@email.com',
    });

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
