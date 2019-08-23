const express = require('express')
const User = require('../models/user')
const router = new express.Router()

router.post('/api/users', async (req, res) => {
	const user = new User(req.body)
	try {
		await user.save()
		const token = await user.generateAuthToken()
		res.status(201).send({ user, token })
	} catch (e) {
		if (e.name === 'MongoError') {
			res.status(400).send({ message: 'User already exists!'});
		} else {
			res.status(400).send(e)
		}
	}
})

router.post('/api/users/login', async (req, res) => {
	try {
		const user = await User.findByCredentials(req.body.name, req.body.password);
		const token = await user.generateAuthToken()
		res.send({ user, token })
	} catch (e) {
		res.status(400).send(e)
	}
})

module.exports = router;