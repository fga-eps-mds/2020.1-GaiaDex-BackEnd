const supertest = require('supertest');
const app = require('../../src/app');
const TopicModel = require('../../src/models/Topic');
const UserModel = require('../../src/models/User');
const PlantModel = require('../../src/models/Plant');

// Hypotetical variables
const topic = new TopicModel({
  title: 'test',
  description: 'test'
});
topic.save()

const user = new UserModel({
  username: 'username',
  password: 'password',
  passwordConfirmation: 'password',
  email: 'email@email.com',
});
user.save();

const plant = new PlantModel({
  scientificName: 'Butia archeri Glassman',
  family_name: 'Arecaceae',
  gender_name: 'Butia',
  specie_name: 'Butia archeri',
  common_name : 'butiazinho',
  usage: 'A espécie é conhecida popularmente como butiazinho, coqueirinho-do-campo, butiá-do-campo, butiá-do-cerrado ou palmeira-butiá. Em alguns locais do Cerrado, as folhas desta palmeirinha são utilizadas para a confecção de vassouras, daí atribui-se também o nome popular de palmeira-de-vassoura.',
  first_User: ' julceia',
  collection_count: '108',
  extinction: '0',
  profile_picture: 'https://static.inaturalist.org/photos/68945583/large.jpeg?1587849882',
  gbifID: '28601793778',
  stateProvince: 'Distrito Federal',
  topicos: []
});
plant.save();

const request = supertest(app);

describe('topic/', () => {

  // Creation
  it('Should be able to create a new topic.', async () => {

    const response = await request.post(`/topic/create/${plant.id}/${user.id}/`).send({
      title: 'Titulo Tópico',
      description: 'Dúvidas sobre planta',
    });

    expect(response.status).toBe(200);
  });

  it('Should not be able to create a new topic because there is no topic title.', async () => {

    const response = await request.post(`/topic/create/${plant.id}/${user.id}/`).send({
      description: 'Dúvidas sobre planta',
    });

    expect(response.status).toBe(400);
  });

  it('Should be able to create a new topic because topic title is too short.', async () => {

    const response = await request.post(`/topic/create/${plant.id}/${user.id}/`).send({
      title: '',
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

  it('Should not be able to update a topic because new title is too short.', async () => {

    const response = await request.put(`/topic/update/${topic.id}/`).send({
      title: '',
      description: 'Descrição aleatória'
    });

    expect(response.status).toBe(400);
  });
});
