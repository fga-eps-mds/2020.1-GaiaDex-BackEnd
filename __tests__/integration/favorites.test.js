const supertest = require ('supertest');
const app = require ('../../src/app');
const UserModel = require ('../../src/models/User');
const PlantModel = require ('../../src/models/Plant');
const User = require('../../src/models/User');

const request = supertest (app);

// Hypotetical variables

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
plant.save();

describe('favorite/', () => {

    // addition
    it('It should be possible to add a new favored plant.', async () => {
        const response = await request
        .post (`/favorites/add/${user.id}/${plant.id}/`)
        .send ({
            // no argument is needed
        });
        expect(response.status).toBe(200);
    });

    it('It not should be possible to add a new favored plant.', async () => {
        const response = await request
        .post (`/favorites/add/${plant.id}/${user.id}/`)
        .send ({
            // no argument is needed
        });
        expect(response.status).toBe(400);
    });

    it('It not should be possible to add a new favored plant.', async () => {
        const response = await request
        .post (`/favorites/add/`)
        .send ({
            // no argument is needed
        });
        expect(response.status).toBe(404);
    });

    it('It not should be possible to add a new favored plant.', async () => {
        const response = await request
        .post (`/favorites/add/${user.id}/`)
        .send ({
            // no argument is needed
        });
        expect(response.status).toBe(404);
    });

    it('It not should be possible to add a new favored plant.', async () => {
        const response = await request
        .post (`/favorites/add/${plant.id}/`)
        .send ({
            // no argument is needed
        });
        expect(response.status).toBe(404);
    });

    // listing
    it('It should be possible to see a list of favorite plants.', async () => {
        const response = await request
        .get (`/favorites/list/${user.id}/`)
        .send ({
            // no argument is needed
        });
        expect(response.status).toBe(200);
    });

    it('It not should be possible to see a list of favorite plants.', async () => {
        const response = await request
        .get (`/favorites/list/${plant.id}/`)
        .send ({
            // no argument is needed
        });
        expect(response.status).toBe(400);
    });

    it('It not should be possible to see a list of favorite plants.', async () => {
        const response = await request
        .get (`/favorites/list/`)
        .send ({
            // no argument is needed
        });
        expect(response.status).toBe(404);
    });

    // deletion
    it('Must be able to delete a favorite plant.', async () => {
        const response = await request
        .delete (`/favorites/delete/${user.id}/${plant.id}/`)
        .send ({
            // no argument is needed
        });
        expect(response.status).toBe(200);
    });

    it('Must be able to delete a favorite plant.', async () => {
        const response = await request
        .delete (`/favorites/delete/${plant.id}/${user.id}/`)
        .send ({
            // no argument is needed
        });
        expect(response.status).toBe(400);
    });

    it('Must be able to delete a favorite plant.', async () => {
        const response = await request
        .delete (`/favorites/delete/`)
        .send ({
            // no argument is needed
        });
        expect(response.status).toBe(404);
    });

    it('Must be able to delete a favorite plant.', async () => {
        const response = await request
        .delete (`/favorites/delete/${user.id}/`)
        .send ({
            // no argument is needed
        });
        expect(response.status).toBe(404);
    });

    it('Must be able to delete a favorite plant.', async () => {
        const response = await request
        .delete (`/favorites/delete/${plant.id}/`)
        .send ({
            // no argument is needed
        });
        expect(response.status).toBe(404);
    });

});