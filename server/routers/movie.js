const express = require('express');
const Movie = require('../models/movie');
const auth = require('../middleware/auth');
const router = new express.Router();

const MAX_RESULTS_PER_PAGE = 50;

router.post('/api/movies', auth, async (req, res) => {
	const movie = new Movie({
		...req.body,
		owner: req.user._id
	});
	try {
		await movie.save();
		res.status(201).send(movie);
	} catch (e) {
		res.status(400).send(e);
	}
});

router.get('/api/movies', async (req, res) => {
	let sort = {};
	const match = {};
	const pageNo = parseInt(req.query.page);
	const skip = MAX_RESULTS_PER_PAGE * (pageNo - 1);

	if (req.query.owner) {
		match.owner = req.query.owner;
	}

	if (req.query.sortBy) {
		const parts = req.query.sortBy.split(':');
		sort[parts[0]] = parts[1] === 'desc' ? -1 : 1
	} else {
		sort = { createdAt: -1 }
	}

	const count = await Movie.countDocuments();

	try {
		await Movie.find(match)
			.populate('owner', 'name')
			.lean()
			.sort(sort)
			.limit(MAX_RESULTS_PER_PAGE)
			.skip(skip)
			.exec(function (err, movies) {
				res.send({
					content: movies,
					totalCount: count,
					pages: Math.ceil(count / MAX_RESULTS_PER_PAGE)
				})
			});
	} catch (e) {
		res.status(500).send()
	}
})

router.get('/api/movies/:userId', auth, async (req, res) => {
	const _userId = req.params.userId;

	let sort = {};
	const match = {};
	const pageNo = parseInt(req.query.page);
	const skip = MAX_RESULTS_PER_PAGE * (pageNo - 1);

	if (req.query.owner) {
		match.owner = req.query.owner;
	}

	if (req.query.sortBy) {
		const parts = req.query.sortBy.split(':');
		sort[parts[0]] = parts[1] === 'desc' ? -1 : 1
	} else {
		sort = { createdAt: -1 }
	}

	const count = await Movie.countDocuments();

	try {
		await Movie.find(match)
			.populate('owner', 'name')
			.populate('reviews', 'status owner', { owner: _userId })
			.lean()
			.sort(sort)
			.limit(MAX_RESULTS_PER_PAGE)
			.skip(skip)
			.exec(function (err, movies) {
				res.send({
					content: movies,
					totalCount: count,
					pages: Math.ceil(count / MAX_RESULTS_PER_PAGE)
				})
			});
	} catch (e) {
		res.status(500).send()
	}
})

router.get('/api/movie/:id', auth, async (req, res) => {
	const _id = req.params.id;
	try {
		const movie = await Movie.findOne({ _id, owner: req.user._id })
		if (!movie) {
			res.status(404).send();
		}
		res.send(movie)
	} catch (e) {
		res.status(500).send()
	}
});

router.patch('/api/movies/:id', auth, async (req, res) => {
	const updates = Object.keys(req.body);
	const allowedUpdates = ['description', 'completed'];

	const isValidOperation = updates.every((update) => allowedUpdates.includes(update));
	if (!isValidOperation) {
		res.status(400).send({ error: 'Invalid updates' })
	}

	try {
		const movie = await Movie.findOne({ _id: req.params.id, owner: req.user._id });
		if (!movie) {
			return res.status(404).send()
		}

		updates.forEach((update) => movie[update] = req.body[update])
		await movie.save();

		res.send(movie)
	} catch (e) {
		res.status(400).send(e)
	}
});


module.exports = router;