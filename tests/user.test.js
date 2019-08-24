const request = require('supertest');
const app = require('../server/app');
const User = require('../server/models/user');
const { userOneId, userOne, setupDatabase } = require('./fixtures/db');

beforeEach(setupDatabase);

test('Should signup a new user', async () => {
	const response = await request(app).post('/api/users').send({
		name: 'Tim',
		password: 'test123',
	}).expect(201)

	// Assert that the database was changed correctly
	const user = await User.findById(response.body.user._id)
	expect(user).not.toBeNull()

	// Assertions about the response
	expect(response.body).toMatchObject({
		user: {
			name: 'Tim',
		},
		token: user.tokens[0].token
	})
	expect(user.password).not.toBe('test123')
});

test('Should login existing user', async () => {
	const response = await request(app).post('/api/users/login').send({
		name: userOne.name,
		password: userOne.password
	}).expect(200)
	const user = await User.findById(userOneId)
	expect(response.body.token).toBe(user.tokens[1].token)
});

test('Should not login nonexistent user', async () => {
	await request(app).post('/users/login').send({
		email: userOne.email,
		password: 'aaaaaaa'
	}).expect(404)
});
