const express = require('express')
require('dotenv').config()
const userRoute = require('./routes/userRoutes')


const {testConnection} = require('./config/db')
testConnection()


const app = express()
const port = process.env.PORT || 7000

app.use(express.json())



app.use('/api/user', userRoute)



app.get('/', (req, res) => res.send('hello World'))
app.listen(port, ()=> console.log(`Example app listining on port ${port}`))


