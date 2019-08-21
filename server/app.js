const express = require('express')
const bodyParser = require('body-parser');
const morgan = require('morgan');
require('./db/mongoose')

const userRouter = require('./routers/user')
const taskRouter = require('./routers/movie')
const reviewsRouter = require('./routers/review')

const app = express()

app.use(express.json());
app.use(userRouter);
app.use(taskRouter);
app.use(reviewsRouter);
app.use(bodyParser.json({ type: '*/*' }));
app.use(morgan('combined'));


module.exports = app