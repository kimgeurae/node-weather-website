const path = require('path')

const express = require('express')
const hbs = require('hbs')

const geocode = require('./utils/geocode.js')
const forecast = require('./utils/forecast.js')

const app = express()
const port = process.env.PORT || 3000

// Define paths for Express config
const publicPath = path.join(__dirname, '../public')
const viewsPath = path.join(__dirname, '../templates/views')
const partialsPath = path.join(__dirname, '../templates/partials')

// Setup Handlebars and views location
app.set('view engine', 'hbs')
app.set('views', viewsPath)
hbs.registerPartials(partialsPath)

// Setup static directory to serve
app.use(express.static(publicPath))

app.get('', (req, res) => {
    res.render('index', {
        title: 'Weather App',
        name: 'Kim'
    })
})

app.get('/about', (req, res) => {
    res.render('about', {
        title: 'About',
        name: 'Kim'
    })
})

app.get('/help', (req, res) => {
    res.render('help', {
        title: 'Get help here!',
        name: 'Kim',
        description: 'If some error occurred, send us an email at help@bug.com'
    })
})

app.get('/weather', (req, res) => {
    if(!req.query.address) {
        return res.send({
            error: 'An address must be provided in order to make the forecast works. Please provide an address and try again.'
        })
    }
    geocode(req.query.address, (error, { latitude, longitude, location } = {}) => {
        if(error) return res.send({
            error: error
        })
        forecast(latitude, longitude, (error, { temperature, feels_like, alerts  } = {}) => {
            if(error) return res.send({
                error: error
            })
            const printableData = alerts.sender_name !== undefined ?
                `${location} - It's currently ${Math.round(temperature)}ºc and it feels like ${Math.round(feels_like)}ºc outside. There is an alert sent by ${alerts.sender_name} about '${alerts.event}'. It says: "${alerts.description}"` :
                `${location} - It's currently ${Math.round(temperature)}ºc and it feels like ${Math.round(feels_like)}ºc outside.`
            res.send({
                address: req.query.address,
                location: location,
                temperature: Math.round(temperature),
                feels_like: Math.round(feels_like),
                forecast: printableData
            })
        })
    })    
})

app.get('/products', (req, res) => {
    if(!req.query.search) {
        return res.send({
            error: 'You must provide a search term'
        })
    }

    console.log(req.query.search)
    res.send({
        products: []
    })
})

app.get('/help/*', (req, res) => {
    res.render('404', {
        title: 'Error 404.',
        errorMessage: 'Help article not found.',
        name: 'Kim'
    })
})

app.get('*', (req, res) => {
    res.render('404', {
        title: 'Error 404.',
        errorMessage: 'Page not found.',
        name: 'Kim'
    })
})

app.listen(port, () => {
    console.log(`Server is up on port ${port}.`)
})