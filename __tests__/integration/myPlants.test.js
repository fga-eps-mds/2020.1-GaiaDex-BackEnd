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

    
    // listing for id
    it('It must be possible to search for a plant by id.', async () => {
        const response = await request.get(`/myPlants/${user.id}/${plant._id}`);
        expect(response.status).toBe(200);
    });

    it('It not must be possible to search for a plant by id.', async () => {
        const response = await request.get(`/myPlants/${plant.id}/${user.id}`);
        expect(response.status).toBe(400);
    });

    it('It not must be possible to search for a plant by id.', async () => {
        const response = await request.get(`/myPlants/${user.id}`);
        expect(response.status).toBe(404);
    });

    it('It not must be possible to search for a plant by id.', async () => {
        const response = await request.get(`/myPlants/${plant.id}`);
        expect(response.status).toBe(404);
    });

});