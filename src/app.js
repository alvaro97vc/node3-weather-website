const path = require('path')
const express = require('express')
const hbs = require('hbs')

//Introduciendo geocode y weather en la carpeta src podemos requerirlos para usarlos en el web server
const geocode = require('./utils/geocode')
const forecast = require('./utils/forecast')


const app = express()

// Define paths for Express config
const publicDirectoryPath = path.join(__dirname, '../public')
const viewsPath = path.join(__dirname, '../templates/views')
const partialsPath = path.join(__dirname, '../templates/partials')

// Setup handlebars engine and views location
app.set('view engine', 'hbs')
app.set('views', viewsPath)
hbs.registerPartials(partialsPath)

// Setup static directory to serve
app.use(express.static(publicDirectoryPath))

app.get('', (req, res) => {
    res.render('index', {
        title: 'Weather',
        name: 'Alvaro L'
    })
})

app.get('/about', (req, res) => {
    res.render('about', {
        title: 'About Me',
        name: 'Alvaro L'
    })
})

app.get('/help', (req, res) => {
    res.render('help', {
        helpText: 'This is some helpful text.',
        title: 'Help',
        name: 'Alvaro L'
    })
})

app.get('/weather', (req, res) => {
    if (!req.query.address) { //si no hay termino de busqueda, imprimiremos un error
        return res.send({ //Es importante saber que NO SE PUEDEN enviar dos veces res.send. Introduciendo el termino return corregimos el error
        error: 'Por favor introduzca una direccion'
        }) 
    }
    geocode(req.query.address, (GeoError, GeoData) => { //Si desestructurasemos GeoData {latitude, longitude, location} seria importante asignarles valores por defecto, ya que de lo contrario los trataria de buscar pero no estarian
        if (GeoError) {
            return res.send({ 
                GeoError})
        }
        forecast(GeoData.latitude, GeoData.longitude, (ForeError, ForeData) => {
            if (ForeError) {
                return res.send({
                    ForeError})
            }
            res.send({
                forecast: ForeData.response, //Recuerda: forecast ofrece como resultado callback que puede dar un error o los datos. Para acceder a los datos pones datos.atributo_de_interes
                location: GeoData.place_name,
                adress: req.query.address
            })
        })
    })
})

//En este caso vamos a trabajar con request
app.get('/products', (req, res) => {
    if (!req.query.search) { //si no hay termino de busqueda, imprimiremos un error
        return res.send({ //Es importante saber que NO SE PUEDEN enviar dos veces res.send. Introduciendo el termino return corregimos el error
        error: 'Por favor introduzca un termino de busqueda'
        }) 
    }
    
    console.log(req.query.search) // localhost:3000/products?search=games&rating=4     // introduciendo esta url req.query.search nos devolvera el string games
    res.send({
        products: []
        
    })
})




app.get('/help/*', (req, res) => {
    res.render('404', {
        title: '404',
        name: 'Alvaro L',
        errorMessage: 'Help article not found.'
    })
})

app.get('*', (req, res) => {
    res.render('404', {
        title: '404',
        name: 'Alvaro L',
        errorMessage: 'Page not found.'
    })
})

app.listen(3000, () => {
    console.log('Server is up on port 3000.')
})