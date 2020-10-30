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
