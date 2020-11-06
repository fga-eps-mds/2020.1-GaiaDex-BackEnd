const supertest = require('supertest');
const app = require('../../src/app');
const PlantModel = require('../../src/models/Plant');

const request = supertest(app);

describe('/Plant', () => {
  // REGISTER
  it('should register a plant', async () => {
    const response = await request.post('/plant/register').send({
      scientificName: 'PlantaCiencia',
      familyName: 'FamiliarePlantae',
      genderName: 'PlantMale',
      specieName: 'EspeciesPlantae',
      commonName: 'Planta',
      usage:
        'Esta planta e muito utilizada para fins medicinais, no preparo de chas e serve como tempero de varios alimentos',
      firstUser: 'Sou_eu',
      collectionCount: 1,
      extinction: false,
      profilePicture:
        'https://cdn.pixabay.com/photo/2017/08/18/20/44/flower-2656484_960_720.jpg',
      gbifID: '1234566767',
      stateProvince: 'alguma_provincia',
    });
    expect(response.status).toBe(200);
  });
  // SEARCH
  it('should be able to find a plant by her ID', async () => {
    const plant = new PlantModel({
      scientificName: 'PlantaCiencia',
      familyName: 'FamiliarePlantae',
      genderName: 'PlantMale',
      specieName: 'EspeciesPlantae',
      commonName: 'Planta',
      usage:
        'Esta planta e muito utilizada para fins medicinais, no preparo de chas e serve como tempero de varios alimentos',
      firstUser: 'Sou_eu',
      collectionCount: 1,
      extinction: false,
      profilePicture:
        'https://cdn.pixabay.com/photo/2017/08/18/20/44/flower-2656484_960_720.jpg',
      gbifID: '1234566767',
      stateProvince: 'alguma_provincia',
    });

    const response = await request.get(`/plant/${plant._id}`);
    expect(response.status).toBe(200);
  });
  // UPDATE
  it('should be able to update plant', async () => {
    const plant = new PlantModel({
      scientificName: 'PlantaVela',
      familyName: 'FamiliaVelha',
      genderName: 'Male',
      specieName: 'EspeciesAntigas',
      commonName: 'Velha',
      usage: 'Esta planta e muito antiga',
      firstUser: 'AqueleSenhor',
      collectionCount: 1,
      extinction: false,
      profilePicture:
        'https://cdn.pixabay.com/photo/2017/08/18/20/44/flower-2656484_960_720.jpg',
      gbifID: '1234566767',
      stateProvince: 'antiga_provincia',
    });
    await plant.save();

    const response = await request.put(`/plant/${plant._id}`).send({
      scientificName: 'PlantaNova',
      familyName: 'FamiliaNova',
      genderName: 'Female',
      specieName: 'EspeciesNovass',
      commonName: 'Novissima',
      usage: 'Esta planta e muito moderna e nova',
      firstUser: 'AqueleJovem',
      collectionCount: 1,
      extinction: false,
      profilePicture:
        'https://cdn.pixabay.com/photo/2017/08/18/20/44/flower-2656484_960_720.jpg',
      gbifID: '987643356',
      stateProvince: 'nova_provincia',
      topics: [123452],
    });
    expect(response.status).toBe(200);
  });
  // DELETE
  it('should be able to delete plant', async () => {
    const plant = new PlantModel({
      scientificName: 'PlantaFeia',
      familyName: 'NaoExiste',
      genderName: 'Sem',
      specieName: 'SemEspecie',
      commonName: 'NaoTem',
      usage: 'Nao tem como usar o que vai ser apagado',
      firstUser: 'AlguemQueNaoExiste',
      collectionCount: 1,
      extinction: false,
      profilePicture:
        'https://image.freepik.com/vetores-gratis/erro-com-efeito-de-falha-na-tela-erro-404-pagina-nao-encontrada_143407-1.jpg',
      gbifID: '000000',
      stateProvince: 'deleta_provincia',
    });
    await plant.save();

    const response = await request.delete(`/plant/${plant._id}`);
    expect(response.status).toBe(200);
  });
});
