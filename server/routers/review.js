const express = require('express')
const Review = require('../models/review')
const auth = require('../middleware/auth')
const router = new express.Router();
const Movie = require('../models/movie');

router.post('/api/reviews/:movieId', auth, async (req, res) => {

	const userId = req.user._id;
	const movieId = req.params.movieId;
	const movie = await Movie.findOne({ _id: movieId });
	if (!movie) {
		return res.status(404).send();
	}
	if (userId === movie.owner) {
		return res.status(400).send({ error: 'You cannot vote for your own movie post'});
	}

	const review = new Review({
		...req.body,
		movie: movieId,
		owner: userId
	});
	try {
		await review.save().then(async (review) => {
			if (review.status === 1) {
				await incrementLikes(review);
			} else {
				await incrementDislikes(review);
			}
		})
		res.status(201).send(review);
	} catch (e) {
		res.status(400).send(e);
	}
});

router.patch('/api/reviews/:reviewId', auth, async (req, res) => {
	const updates = Object.keys(req.body);
	const allowedUpdates = ['status'];

	const isValidOperation = updates.every((update) => allowedUpdates.includes(update));
	if (!isValidOperation) {
		res.status(400).send({ error: 'Invalid updates'});
	}

	try {
		const review = await Review.findOne({ _id: req.params.reviewId });
		if (!review) {
			return res.status(404).send();
		}
		if (review.status === req.body.status) {
			return res.status(400).send({ error: 'Invalid updates'});
		}

		if (review.owner === req.user._id) {
			return res.status(400).send({ error: 'You cannot vote for your own movie post'});
		}

		updates.forEach((update) => review[update] = req.body[update]);
		await review.save().then(async (review) => {
			if (review.status === 1) {
				await changeFromDislikeToLike(review);
			} else {
				await changeFromLikeToDislike(review);
			}
		});

		res.send(review)
	} catch (e) {
		res.status(400).send(e)
	}
});

router.delete('/reviews/:reviewId', auth, async (req, res) => {
	try {
		let reviewToDelete = null;
		await Review.findOneAndDelete({ _id: req.params.reviewId, owner: req.user._id })
			.then(async (review) => {
				reviewToDelete = review;
				if (review.status === 1) {
					await decrementLikes(review);
				} else {
					await decrementDislikes(review);
				}
		})
		if (!reviewToDelete) {
			return res.status(404).send()
		}
		res.send(reviewToDelete)
	} catch (e) {
		res.status(500).send(e)
	}
})

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
};

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

const changeFromLikeToDislike = async (review) => {
	await Movie.findOneAndUpdate(
		{ _id: review.movie, likes: { $gte: 0 }},
		{ $inc: { dislikes: 1, likes: -1 } }
	);
};

const changeFromDislikeToLike = async (review) => {
	await Movie.findOneAndUpdate(
		{ _id: review.movie, dislikes: { $gte: 0 } },
		{ $inc: { likes: 1, dislikes: -1 } }
	)
}

module.exports = router