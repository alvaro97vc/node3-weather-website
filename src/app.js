//El programa se inicializa mediante
// nodemon src/app.js -e, hbs
//con el path situado en final-files

const path = require('path')
const express = require('express')
const hbs = require('hbs')

//Introduciendo geocode y weather en la carpeta src podemos requerirlos para usarlos en el web server
const geocode = require('./utils/geocode')
const forecast = require('./utils/forecast')


const app = express() //express es una funcion necesaria para acceder al path public y definir los distintos metodos de la web

// Define paths for Express config
const publicDirectoryPath = path.join(__dirname, '../public') //Con esta linea podremos acceder al fichero que da estilo a los HTML (el CSS)
const viewsPath = path.join(__dirname, '../templates/views')
const partialsPath = path.join(__dirname, '../templates/partials')

// Setup handlebars engine and views location
app.set('view engine', 'hbs') //solo debemos proporcionarle la view engine y la engine que vamos a utilizar, en este caso hbs
app.set('views', viewsPath)
hbs.registerPartials(partialsPath) //Para cargar los partials (header y footer), necesitaremos ejecutar en la CW node src/app.js -e js,hbs

// Setup static directory to serve
app.use(express.static(publicDirectoryPath)) //Si express encuentra una coincidencia de archivo en path_public ignorara el resto de codigo

app.get('', (req, res) => {
    res.render('index', {//En este caso, en lugar de emplear send, emplearemos render para utilizar nuestros handlebars
        //El primer objeto que emplearemos sera el titulo de nuestro hbs, y como segundo, todos los objetos que queramos que mande a la pagina web
        title: 'Weather',
        name: 'Alvaro L'
    })
})

app.get('/about', (req, res) => {
    res.render('about', { //Usamos about para referenciar a los handlebars
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

//Este metodo es importante no porque vayamos a ver directamente localhost:3000/weather, si no por el hecho de que la crea de manera escondida
//El enlace localhost:3000/weather lo utilizara la app.js localizada en la carpeta js usando fetch. En el momento en que se usa fetch, se ejecuta el metodo de abajo y podemos obtener la informacion que sera representada
app.get('/weather', (req, res) => { // app.get requiere de dos inputs: la direccion parcial de la URL (/weather) y un objeto compuesto de una request (por ejemplo, la adress) y la response (el json final)
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
/*
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
*/


// ***TRATAMIENTO DE ERRORES ***

app.get('/help/*', (req, res) => { //Este get se encarga de manejar URL que no han sido prevista, como por ejemplo /help/something
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


//Metodo final necesario para crear el local server
app.listen(3000, () => {
    console.log('Server is up on port 3000.')
})