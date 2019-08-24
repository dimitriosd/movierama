const mongoose = require('mongoose');

const reviewSchema = new mongoose.Schema({
	status: {
		type: Number,
		required: true,
		min: -1,
		max: 1,
		validate : {
			validator : Number.isInteger,
			message   : '{VALUE} is not an integer value'
		}
	},
	owner: {
		type: mongoose.Schema.Types.ObjectId,
		required: true,
		ref: 'User'
	},
	movie: {
		type: mongoose.Schema.Types.ObjectId,
		required: true,
		ref: 'Movie'
	}
}, {
	timestamps: true
});

reviewSchema.index({ owner: 1, movie: 1 }, { unique: true });

const Review = mongoose.model('Review', reviewSchema);

module.exports = Review;