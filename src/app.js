const path = require('path')
const express = require('express')
const hbs = require('hbs')
const geocode = require('./utils/geocode')
const forecast = require('./utils/forecast')

const app = express()
const publicDirectoryPath = path.join(__dirname, '../public')
const viewPath = path.join(__dirname, '../templates/views')
const partialsPath = path.join(__dirname, '../templates/partials')

app.set('view engine', 'hbs')
app.set('views', viewPath)
hbs.registerPartials(partialsPath)

app.use(express.static(publicDirectoryPath))

app.get('', (req, res) => {
    res.render('index', {
        title: 'Weather',
        name: 'Daniel Meresz'
    })
})

app.get('/about', (req, res) => {
    res.render('about', {
        title: 'About me',
        name: 'Daniel Meresz'
    })
})

app.get('/help', (req, res) => {
    res.render('help', {
        message: "If you need help, tough luck",
        title: 'Help',
        name: 'Daniel Meresz'
    })
})

app.get('/weather', (req, res) => {
    if (!req.query.address){
        return res.send({
            error: "You have to provide an address!"
        })
    }
    geocode(req.query.address, (error, {latitude, longitude, location} = {}) => {
        if (error){
            return res.send({error})
        }
        forecast(latitude, longitude, (error, forecastData) => {
            if (error) {
                return res.send({error})
            }
            res.send({
                location: location,
                weather: forecastData
            })
          })
    })
})

app.get('/products', (req, res) => {
    if (!req.query.search){
        return res.send({
            error: 'You must provide a search term'
        })
    }
    console.log(req.query)
    res.send({
        products: []
    })
})

app.get('/help/*', (req, res) => {
    res.render('404', {
        title: '404',
        error_message: "Help article not found",
        name: 'Daniel Meresz'
    })
})

app.get('*', (req, res) => {
    res.render('404', {
        title: "404",
        error_message: 'Page not found',
        name: 'Daniel Meresz'
    })
})


app.listen(3000, () => {
    console.log('Server is up on port 3000.')
})