const supertest = require('supertest');
const app = require('../../src/app');
const UserModel = require('../../src/models/User');
const PlantModel = require('../../src/models/Plant');
const { defaultUser2, defaultPlant1 } = require('../defaultModels');

const request = supertest(app);

let user;
let plant;

describe ('collection/', () => {
    beforeEach(async (done) => {
        user = new UserModel(defaultUser2);
        await user.save();
    
        plant = new PlantModel(defaultPlant1);
        await plant.save();
        done();
    });

    // listing 
    it('It should be possible to list a user collection.', async () => {
        const response = await request.get(`/collection/${user.id}/`);
        expect(response.status).toBe(200);
    });

    it('It not should be possible to list a user collection.', async () => {
        const response = await request.get(`/collection/${plant.id}/`);
        expect(response.status).toBe(400);
    });

    it('It not should be possible to list a user collection.', async () => {
        const response = await request.get(`/collection/`);
        expect(response.status).toBe(404);
    });

});