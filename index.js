const mongoose= require('mongoose')
const express = require('express')
const controller = require('./controllers/animal.controller')
const { Auth, isAuthenticated } = require('./controllers/auth.controller')
const app = express()
const port = 3000

mongoose.connect('<Atlas_Link>')

app.use(express.json())
app.use(express.static('app'))

app.get('/animal', isAuthenticated, controller.list)
app.post('/animal', isAuthenticated, controller.create)
app.put('/animal/:id', isAuthenticated, controller.update)
app.delete('/animal/:id', isAuthenticated, controller.destroy)

app.post('/login', Auth.login)
app.post('/register', Auth.register)

app.get('/', (req, res) => {
    res.sendFile(`${__dirname}/pages/index.html`)
})



app.listen(port, () => {
    console.log('server running in http://localhost:3000/')
})