const mongoose = require('mongoose');

const movieSchema = new mongoose.Schema({
	title: {
		type: String,
		required: true,
		unique: true,
		trim: true
	},
	description: {
		type: String,
		required: true,
		trim: true
	},
	likes: {
		type: Number,
		required: true,
		default: 0,
		min: 0
	},
	dislikes: {
		type: Number,
		required: true,
		default: 0,
		min: 0
	},
	owner: {
		type: mongoose.Schema.Types.ObjectId,
		required: true,
		ref: 'User'
	}
}, {
	timestamps: true
});

movieSchema.virtual('reviews', {
	ref: 'Review',
	localField: '_id',
	foreignField: 'movie'
});

const Movie = mongoose.model('Movie', movieSchema);

module.exports = Movie;