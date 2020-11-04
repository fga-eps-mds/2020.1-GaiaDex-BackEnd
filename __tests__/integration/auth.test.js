const supertest = require('supertest');
const app = require('../../src/app');
const UserModel = require('../../src/models/User');

const request = supertest(app);

describe('Auth/User', () => {
  // SignUp
  it('should be able to create user', async () => {
    const response = await request.post('/auth/signup').send({
      username: 'joaozinho22',
      password: 'porta_azul',
      passwordConfirmation: 'porta_azul',
      email: 'joaozinho22@gmail.com',
    });

    expect(response.status).toBe(200);
  });

  it('should give error because trying to signup USERNAME that already exists', async () => {
    const user = new UserModel({
      username: 'joaozin',
      password: 'porta_amarela',
      passwordConfirmation: 'porta_amarela',
      email: 'astro@email.com',
    });
    await user.save();

    const response = await request.post('/auth/signup').send({
      username: 'joaozin',
      password: 'porta_amarela',
      passwordConfirmation: 'porta_amarela',
      email: 'jo22@email.com',
    });

    expect(response.status).toBe(400);
  });

  it('should give error because trying to signup EMAIL that already exists', async () => {
    const user = await UserModel.create({
      username: 'Nemozin',
      password: 'porta_amarela',
      passwordConfirmation: 'porta_amarela',
      email: 'jo22@email.com',
    });
    await user.save();

    const response = await request.post('/auth/signup').send({
      username: 'joaozin',
      password: 'porta_amarela',
      passwordConfirmation: 'porta_amarela',
      email: 'jo22@email.com',
    });

    expect(response.status).toBe(400);
  });

  it('should give error 400 because the signup of USERNAME with less of 4 characters', async () => {
    const response = await request.post('/auth/signup').send({
      username: 'me',
      password: 'porta_vermelha',
      passwordConfirmation: 'porta_vermelha',
      email: 'joaozao11@gmail.com',
    });
    expect(response.text).toEqual(
      expect.stringContaining('length must be at least 4 characters long')
    );
  });

  it('should give error 400 because PASSWORD not valid (less than 8 char)', async () => {
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
  // LOGIN
  it('should be able to login in account with correct data', async () => {
    const user = new UserModel({
      username: 'lucia',
      password: 'lua_azul',
      email: 'lu2000@email.com',
    });
    await user.save();

    const response = await request.post('/auth/login').send({
      username: 'lucia',
      password: 'lua_azul',
      email: 'lu2000@email.com',
    });
    expect(response.status).toBe(200);
  });

  it('should not be able to login if user does not exists', async () => {
    const response = await request.post('/auth/login').send({
      username: 'lucia',
      password: 'lua_azul',
      email: 'lu2000@email.com',
    });
    expect(response.status).toBe(400);
  });

  it('should not be able to login with wrong password', async () => {
    const user = new UserModel({
      username: 'UserMan007',
      password: 'JamesBond',
      passwordConfirmation: 'JamesBond',
      email: 'Bond007@email.com',
    });
    await user.save();
    const response = await request.post('/auth/login').send({
      username: 'UserMan007',
      password: 'BondJames',
      email: 'Bond007@email.com',
    });
    expect(response.status).toBe(400);
  });

  it('should not be able to login if wrong email', async () => {
    const user = new UserModel({
      username: 'UserMan007',
      password: 'JamesBond',
      passwordConfirmation: 'JamesBond',
      email: 'Bond007@email.com',
    });
    await user.save();
    const response = await request.post('/auth/login').send({
      username: 'UserMan007',
      password: 'BondJames',
      email: 'James700@email.com',
    });
    expect(response.status).toBe(400);
  });
  // UPDATE
  it('should be able to update User', async () => {
    const user = new UserModel({
      username: 'MeUpdate',
      password: 'meu_pass',
      passwordConfirmation: 'meu_pass',
      email: 'updateme@email.com',
    });
    await user.save();

    const login = await request.post('/auth/login').send({
      username: 'MeUpdate',
      password: 'meu_pass',
      passwordConfirmation: 'meu_pass',
      email: 'updateme@email.com',
    });

    const { authtoken } = login.headers;

    const response = await request
      .put(`/auth/update/${user._id}`)
      .send({
        username: 'UpdateMe',
        password: 'novo_pass',
        passwordConfirmation: 'novo_pass',
        email: 'novoemail@email.com',
      })
      .set('authtoken', `${authtoken}`);
    expect(response.text).toEqual(
      expect.stringContaining('User updated successfully.')
    );
  });

  it('should not be able to update if new username has less tha 4 characters', async () => {
    const user = new UserModel({
      username: 'OldUser',
      password: 'senhaVelha',
      passwordConfirmation: 'senha',
      email: 'este@email.com',
    });
    await user.save();

    const login = await request.post('/auth/login').send({
      username: 'OldUser',
      password: 'senhaVelha',
      email: 'este@email.com',
    });

    const { authtoken } = login.headers;

    const response = await request
      .put(`/auth/update/${user._id}`)
      .send({
        username: 'oi',
        password: 'novo_pass',
        email: 'novoemail@email.com',
      })
      .set('authtoken', `${authtoken}`);
    expect(response.text).not.toEqual(
      expect.stringContaining('User updated successfully.')
    );
  });

  it('should not be able to update if new password has less than 8 characters', async () => {
    const user = new UserModel({
      username: 'OldUser',
      password: 'senhaVelha',
      passwordConfirmation: 'senha',
      email: 'este@email.com',
    });
    await user.save();

    const login = await request.post('/auth/login').send({
      username: 'OldUser',
      password: 'senhaVelha',
      email: 'este@email.com',
    });

    const { authtoken } = login.headers;

    const response = await request
      .put(`/auth/update/${user._id}`)
      .send({
        username: 'oitenta',
        password: 'novo',
        email: 'novoemail@email.com',
      })
      .set('authtoken', `${authtoken}`);
    expect(response.text).not.toEqual(
      expect.stringContaining('User updated successfully.')
    );
  });

  // DELETE
  it('should be able to delete user', async () => {
    const user = new UserModel({
      username: 'existsUserName',
      password: '123123',
      email: 'existsUseremail@email.com',
    });
    user.save();

    const login = await request.post('/auth/login').send({
      username: 'existsUserName',
      password: '123123',
      email: 'existsUseremail@email.com',
    });
    const { authtoken } = login.headers;

    await user.save();
    const response = await request
      .delete(`/auth/delete/${user._id}`)
      .set('authtoken', `${authtoken}`);
    expect(response.status).toBe(200);
  });
});
