const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');
const User = require('../../server/models/user');
const Movie = require('../../server/models/movie');

const userOneId = new mongoose.Types.ObjectId()
const userOne = {
	_id: userOneId,
	name: 'Mike',
	password: 'test123',
	tokens: [{
		token: jwt.sign({ _id: userOneId }, process.env.JWT_SECRET)
	}]
};

const userTwoId = new mongoose.Types.ObjectId()
const userTwo = {
	_id: userTwoId,
	name: 'Jess',
	email: 'jess@example.com',
	password: 'test123',
	tokens: [{
		token: jwt.sign({ _id: userTwoId }, process.env.JWT_SECRET)
	}]
};

const movieOne = {
	_id: new mongoose.Types.ObjectId(),
	title: 'Movie1',
	description: 'First movie',
	owner: userOne._id
};

const movieTwo = {
	_id: new mongoose.Types.ObjectId(),
	title: 'Movie2',
	description: 'Second movie',
	owner: userOne._id
};

const movieThree = {
	_id: new mongoose.Types.ObjectId(),
	title: 'Movie3',
	description: 'Third movie',
	owner: userTwo._id
};


const setupDatabase = async () => {
	await User.deleteMany()
	await Movie.deleteMany()
	await new User(userOne).save()
	await new User(userTwo).save()
	await new Movie(movieOne).save()
	await new Movie(movieTwo).save()
	await new Movie(movieThree).save()
};

module.exports = {
	userOneId,
	userOne,
	userTwoId,
	userTwo,
	movieOne,
	movieTwo,
	movieThree,
	setupDatabase
};