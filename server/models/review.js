const mongoose = require('mongoose');
const Movie = require('./movie');

const reviewSchema = new mongoose.Schema({
	status: {
		type: Number,
		required: true,
		min: -1,
		max: 1,
		validate : {
			validator : Number.isInteger,
			message   : '{VALUE} is not an integer value'
		},
		set(status) {
			this.prevStatus = this.status || 0;
			return status;
		}
	},
	owner: {
		type: mongoose.Schema.Types.ObjectId,
		required: true,
		unique: true,
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

// reviewSchema.pre('save',  async function (next) {
// 	const review = this;
//
// 	if (review.isNew) {
// 		if (review.status === 1) {
// 			console.log('inc likes');
// 			 incrementLikes(review);
// 		} else {
// 			console.log('inc dislikes');
// 			 incrementDislikes(review)
// 		}
// 	}
//
// 	next()
// });

// reviewSchema.post('save', function (next) {
// 	const review = this;
// 	if (review.status === -1) {
// 		this.prevStatus === 0 ? incrementLikes(review): ;
// 	}
//
// 	next()
// });

const incrementLikes = async (review) => {
	return await Movie.findOneAndUpdate(
		{ _id: review.movie},
		{ $inc: { likes: 1 } }
	);
};

const decrementLikes = async (review) => {
	return await Movie.findOneAndUpdate(
		{ _id: review.movie, likes: { $gte: 0 } },
		{ $inc: { likes: -1 } }
	)
}

const incrementDislikes = async (review) => {
	await Movie.findOneAndUpdate(
		{ _id: review.movie},
		{ $inc: { dislikes: 1 } }
	);
};

const decrementDislikes = async (review) => {
	await Movie.findOneAndUpdate(
		{ _id: review.movie, dislikes: { $gte: 0 } },
		{ $inc: { dislikes: -1 } }
	)
}



const Review = mongoose.model('Review', reviewSchema)

module.exports = Review