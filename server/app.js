const express = require('express')
const bodyParser = require('body-parser');
const morgan = require('morgan');
require('./db/mongoose')
const path = require('path');

const userRouter = require('./routers/user');
const moviesRouter = require('./routers/movie');
const reviewsRouter = require('./routers/review');

const app = express();

app.use(express.json());
app.use(userRouter);
app.use(moviesRouter);
app.use(reviewsRouter);
app.use(bodyParser.json({ type: '*/*' }));
app.use(morgan('combined'));

// Serve static assets in production
if (process.env.NODE_ENV === 'production') {
	// Set static folder
	app.use(express.static('client/build'));

	app.get('*', (req, res) => {
		res.sendFile(path.resolve(__dirname.replace('/server', ''), 'client', 'build', 'index.html'));
	});
}

module.exports = app;