const supertest = require('supertest');
const app = require('../../src/app');
const TopicModel = require('../../src/models/Topic');
const UserModel = require('../../src/models/User');
const PlantModel = require('../../src/models/Plant');
const CommentModel = require('../../src/models/Comment');

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

const topic = new TopicModel({
	title: 'test',
	description: 'test',
	user: user.id,
	plant: plant.id,
});
topic.save();

const comment = new CommentModel({
	text: 'test',   
	user: user.id,
	topic: topic.id,
});
comment.save();

const request = supertest(app);

describe('comment/', () => {

	it('Should be able to comment because there is text', async() => {
		const response = await request
			.post(`/comment/create/${topic.id}/${user.id}`)
			.send({
				text: 'Comentario',
			});

		expect(response.status).toBe(200);
	});

	it('Should not be able to comment because there is no text', async() => {
		const response = await request
			.post(`/comment/create/${topic.id}/${user.id}`)
			.send({
				text: '',
			});

		expect(response.status).toBe(400);
	});

	it('Should be able to update the comment because there is text', async() => {
		const response = await request
			.put(`/comment/update/${comment.id}`)
			.send({
				text: 'Comentario atualizado',
			});

		expect(response.status).toBe(200);
	});

	it('Should not be able to update the comment because there is no text', async() => {
		const response = await request
			.put(`/comment/update/${comment.id}`)
			.send({
				text: '',
			});

		expect(response.status).toBe(400);
	});

	it('Should be able to delete the comment', async() => {
		const response = await request.delete(`/comment/delete/${comment.id}`);

		expect(response.status).toBe(200);
	});

	it('Should be able to like the comment', async() => {
		const response = await request.post(`/comment/like/${comment.id}`);

		expect(response.status).toBe(200);
	});

	it('Should be able to dislike the comment', async() => {
		const response = await request.post(`/comment/dislike/${comment.id}`);

		expect(response.status).toBe(200);
	});
});
