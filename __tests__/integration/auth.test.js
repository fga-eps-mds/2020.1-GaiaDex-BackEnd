const supertest = require('supertest');
const mongoose = require('mongoose');
const app = require('../../src/app');
const UserModel = require('../../src/models/User');
const { defaultUser1, defaultUser2 } = require('../defaultModels');

const request = supertest(app);

let user;

describe('Auth/User', () => {
  beforeEach(async (done) => {
    user = new UserModel(defaultUser1);
    await user.save();
    done();
  });

  // SignUp
  it('should be able to create user', async () => {
    const response = await request.post('/auth/signup').send(defaultUser2);

    expect(response.status).toBe(200);
  });

  it('should give error because trying to signup USERNAME that already exists', async () => {
    const response = await request.post('/auth/signup').send({
      ...defaultUser1,
      email: 'jo22@email.com',
    });

    expect(response.status).toBe(400);
  });

  it('should give error because trying to signup EMAIL that already exists', async () => {
    const response = await request.post('/auth/signup').send({
      ...defaultUser1,
      username: 'Nemo',
    });

    expect(response.status).toBe(400);
  });

  it('should give error 400 because the signup of USERNAME with less of 4 characters', async () => {
    const response = await request.post('/auth/signup').send({
      ...defaultUser1,
      username: 'me',
    });
    expect(response.text).toEqual(
      expect.stringContaining('length must be at least 4 characters long')
    );
  });

  it('should give error 400 because PASSWORD not valid (less than 8 char)', async () => {
    const response = await request.post('/auth/signup').send({
      ...defaultUser1,
      password: 'oi',
    });
    expect(response.status).toBe(400);
  });

  it('should give error 400 because passwordConfirmation wrong', async () => {
    const response = await request.post('/auth/signup').send({
      ...defaultUser1,
      passwordConfirmation: 'porta_azul',
    });
    expect(response.status).toBe(400);
  });
  // LOGIN
  it('should be able to login in account with correct data', async () => {
    const response = await request.post('/auth/login').send(defaultUser1);
    expect(response.status).toBe(200);
  });

  it('should not be able to login with wrong password', async () => {
    const passwordChanged = {
      ...defaultUser1,
      password: 'porta_verde',
    };
    const response = await request.post('/auth/login').send(passwordChanged);
    expect(response.status).toBe(400);
    expect(response.body.Error).toBe('Wrong email or password.');
  });

  it('should not be able to login if wrong email', async () => {
    const response = await request.post('/auth/login').send({
      ...defaultUser1,
      email: 'estrela@email.com',
    });
    expect(response.status).toBe(400);
  });
  // UPDATE
  it('should be able to update User', async () => {
    const login = await request.post('/auth/login').send(defaultUser1);

    const { authtoken } = login.headers;

    const response = await request
      .put(`/auth/update/${user._id}`)
      .send({
        username: 'joaozindaora',
        password: 'porta_cinza',
        passwordConfirmation: 'porta_cinza',
        email: 'estrela@email.com',
      })
      .set('authtoken', `${authtoken}`);

    expect(response.text).toEqual(
      expect.stringContaining('User updated successfully.')
    );
  });

  // UPDATE
  it('should keep user infos', async () => {
    const login = await request.post('/auth/login').send(defaultUser1);

    const { authtoken } = login.headers;

    const response = await request
      .put(`/auth/update/${user._id}`)
      .send({})
      .set('authtoken', `${authtoken}`);

    expect(response.text).toEqual(
      expect.stringContaining('User updated successfully.')
    );
  });

  it('should not be able to update if new username has less tha 4 characters', async () => {
    const login = await request.post('/auth/login').send(defaultUser1);

    const { authtoken } = login.headers;

    const response = await request
      .put(`/auth/update/${user._id}`)
      .send({
        username: 'oi',
        password: 'porta_cinza',
        passwordConfirmation: 'porta_cinza',
        email: 'estrela@email.com',
      })
      .set('authtoken', `${authtoken}`);
    expect(response.text).not.toEqual(
      expect.stringContaining('User updated successfully.')
    );
  });

  it('should not be able to update if new password has less than 8 characters', async () => {
    const login = await request.post('/auth/login').send(defaultUser1);

    const { authtoken } = login.headers;

    const response = await request
      .put(`/auth/update/${user._id}`)
      .send({
        username: 'joaozindaora',
        password: 'porta',
        passwordConfirmation: 'porta',
        email: 'estrela@email.com',
      })
      .set('authtoken', `${authtoken}`);

    expect(response.text).not.toEqual(
      expect.stringContaining('User updated successfully.')
    );
  });

  // DELETE
  it('should be able to delete user', async () => {
    const login = await request.post('/auth/login').send(defaultUser1);

    const { authtoken } = login.headers;
    const response = await request
      .delete(`/auth/delete/${user._id}`)
      .set('authtoken', `${authtoken}`);

    expect(response.status).toBe(200);
  });

  // DELETE
  it('should not be able to delete another user', async () => {
    const secondUser = await request.post('/auth/signup').send(defaultUser2);
    console.log(secondUser.body);
    const login = await request.post('/auth/login').send(defaultUser1);

    const { authtoken } = login.headers;
    const response = await request
      .delete(`/auth/delete/${secondUser.body._id}`)
      .set('authtoken', `${authtoken}`);

    expect(response.status).toBe(400);
  });

  it('will find user by id', async () => {
    const response = await request.get(`/auth/user/${user._id}`);
    expect(response.status).toBe(200);
  });

  it('wont find user by random id', async () => {
    const dummyId = mongoose.Types.ObjectId();
    const response = await request.get(`/auth/user/${dummyId}`);
    expect(response.status).toBe(400);
    expect(response.body.error).toBe(
      "Error while finding user.\nError: User doesn't exist."
    );
  });

  it('wont find user invalid url', async () => {
    const response = await request.get(`/auth/user/blabla`);
    expect(response.status).toBe(400);
    expect(response.body.error).toBe(
      'Error while finding user.\n' +
        'CastError: Cast to ObjectId failed for value "blabla" at path "_id" for model "User"'
    );
  });
});
