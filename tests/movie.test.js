const request = require('supertest');
const app = require('../server/app');
const Movie = require('../server/models/movie');
const {
	userOne,
	setupDatabase
} = require('./fixtures/db');

beforeEach(setupDatabase);

test('Should create story for user', async () => {
	const response = await request(app)
		.post('/api/movies')
		.set('Authorization', `Bearer ${userOne.tokens[0].token}`)
		.send({
			title: 'new movie',
			description: 'From my test'
		})
		.expect(201)
	const movie = await Movie.findById(response.body._id)
	expect(movie).not.toBeNull()
	expect(movie.title).toEqual('new movie')
});

test('Should fetch all stories', async () => {
	const response = await request(app)
		.get('/api/movies')
		.set('Authorization', `Bearer ${userOne.tokens[0].token}`)
		.send()
		.expect(200)
	expect(response.body.content.length).toEqual(3)
});