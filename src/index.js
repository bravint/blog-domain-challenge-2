require('dotenv').config()

const express = require('express')
const cors = require('cors')
const morgan = require('morgan')

const userRouter = require('./routers/user');

const app = express()
const port = process.env.PORT

app.use(cors())
app.use(morgan('dev'))
app.use(express.json())

app.use('/user', userRouter);

app.get('*', (req, res) => {
  res.send('Server status: OK')
})

app.listen(port, () => console.log(`Server started on port ${port}`))