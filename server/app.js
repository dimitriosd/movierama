const express = require('express')
require('./db/mongoose')
const userRouter = require('./routers/user')
const taskRouter = require('./routers/movie')
const reviewsRouter = require('./routers/review')

const app = express()

app.use(express.json())
app.use(userRouter)
app.use(taskRouter)
app.use(reviewsRouter)

module.exports = app