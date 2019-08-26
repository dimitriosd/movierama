const express = require('express');
const Movie = require('../models/movie');
const auth = require('../middleware/auth');

const router = new express.Router();

const MAX_RESULTS_PER_PAGE = 50;

router.post('/api/movies', auth, async (req, res) => {
  const movie = new Movie({
    ...req.body,
    owner: req.user._id,
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
    sort[parts[0]] = parts[1] === 'desc' ? -1 : 1;
  } else {
    sort = { createdAt: -1 };
  }

  const count = await Movie.countDocuments();

  try {
    await Movie.find(match)
      .populate('owner', 'name')
      .lean()
      .sort(sort)
      .limit(MAX_RESULTS_PER_PAGE)
      .skip(skip)
      .exec((err, movies) => {
        res.send({
          content: movies,
          totalCount: count,
          pages: Math.ceil(count / MAX_RESULTS_PER_PAGE),
        });
      });
  } catch (e) {
    res.status(500).send();
  }
});

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
    sort[parts[0]] = parts[1] === 'desc' ? -1 : 1;
  } else {
    sort = { createdAt: -1 };
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
      .exec((err, movies) => {
        res.send({
          content: movies,
          totalCount: count,
          pages: Math.ceil(count / MAX_RESULTS_PER_PAGE),
        });
      });
  } catch (e) {
    res.status(500).send();
  }
});


module.exports = router;
