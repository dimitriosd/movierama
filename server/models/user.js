const mongoose = require('mongoose')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const Movie = require('./movie')

const userSchema = new mongoose.Schema({
	name: {
		type: String,
		unique: true,
		required: true,
		trim: true
	},
	password: {
		type: String,
		required: true,
		trim: true,
		minlength: 7,
	},
	tokens: [{
		token: {
			type: String,
			required: true
		}
	}]
}, {
	timestamps: true
});

userSchema.virtual('movies', {
	ref: 'Movie',
	localField: '_id',
	foreignField: 'owner'
})

userSchema.virtual('reviews', {
	ref: 'Review',
	localField: '_id',
	foreignField: 'owner'
})

userSchema.methods.toJSON = function () {
	const user = this
	const userObject = user.toObject()

	delete userObject.password
	delete userObject.tokens

	return userObject
}

userSchema.methods.generateAuthToken = async function () {
	const user = this
	const token = jwt.sign({ _id: user._id.toString() }, process.env.JWT_SECRET)

	user.tokens = user.tokens.concat({ token })
	await user.save()

	return token
}

userSchema.statics.findByCredentials = async (name, password) => {
	const user = await User.findOne({ name })

	if (!user) {
		throw new Error('Unable to login');
	}

	const isMatch = await bcrypt.compare(password, user.password)
	if (!isMatch) {
		throw new Error('Unable to login');
	}

	return user
}

userSchema.pre('save', async function (next) {
	const user = this

	if (user.isModified('password')) {
		user.password = await bcrypt.hash(user.password, 8)
	}
	next()
})

userSchema.pre('remove', async function (next) {
	const user = this
	await Movie.deleteMany( { owner: user._id})
	next()
})

const User = mongoose.model('User', userSchema)

module.exports = User
