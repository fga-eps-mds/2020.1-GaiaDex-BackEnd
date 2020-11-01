const supertest = require('supertest');
const app = require('../../src/app');
const UserModel = require('../../src/models/User');

const request = supertest(app);

describe('Auth/User', () => {
  it('should be able to create user', async () => {
    // expect.assertions(1);
    const response = await request.post('/auth/signup').send({
      username: 'joaozinho22',
      password: 'porta_azul',
      passwordConfirmation: 'porta_azul',
      email: 'joaozinho22@gmail.com',
    });

    expect(response.status).toBe(200);
  });
  // nao ta funcionando
  it('should give error because trying to signup user that already exists', async () => {
    const user = new UserModel({
      username: 'joca',
      password: 'azul_porta',
      passwordConfirmation: 'azul_porta',
      email: 'jocaEdoido@gmail.com',
    });
    await user.save();

    const response = await request.post('/auth/signup').send({
      username: 'joca',
      password: 'azul_porta',
      passwordConfirmation: 'azul_porta',
      email: 'jocaEdoido@gmail.com',
    });

    expect(response.request).toBe(400);
  });

  it('should give error 400 because the signup of username with less of 4 characters', async () => {
    const response = await request.post('/auth/signup').send({
      username: 'me',
      password: 'porta_vermelha',
      passwordConfirmation: 'porta_vermelha',
      email: 'joaozao11@gmail.com',
    });
    expect(response.status).toBe(400);
  });

  it('should give error 400 because password not valid (less than 8 char)', async () => {
    const response = await request.post('/auth/signup').send({
      username: 'joazin',
      password: 'oi',
      passwordConfirmation: 'porta_vermelha',
      email: 'joaozao11@gmail.com',
    });
    expect(response.status).toBe(400);
  });

  it('should give error 400 because passwordConfirmation wrong', async () => {
    const response = await request.post('/auth/signup').send({
      username: 'joazin',
      password: 'porta_verde',
      passwordConfirmation: 'porta_azul',
      email: 'joaozao11@gmail.com',
    });
    expect(response.status).toBe(400);
  });

  it('should be able to delete user', async () => {
    const user = new UserModel({
      username: 'existsUserName',
      password: '123123',
      email: 'existsUseremail@email.com',
    });

    await user.save();

    const response = await request.delete('/auth/delete/').send({
      id: user._id.toString(),
    });

    expect(response.status).toBe(200);
  });
});
