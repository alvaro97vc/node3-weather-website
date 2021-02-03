const request = require('request')
const { ADDRGETNETWORKPARAMS } = require('dns')

const geocode = (adress, callback) => {
    const url_geo = 'https://api.mapbox.com/geocoding/v5/mapbox.places/'+ encodeURIComponent(adress) +'.json?access_token=pk.eyJ1IjoiYWx2YXJvOTd2YyIsImEiOiJja2tsaW9uYWwwYmI1MnFsb3k1a25tM3hhIn0.ynhrhU630qcGfVM9ka7DOQ&limit=1'
    //La funcion encodeURIComponent sirve para pasar una cadena de String a lenguaje URL haciendo que, por ejemplo, un espacio se convierta a %20
    request({url: url_geo, json: true}, (error, response) => {
        if (error){
            callback('Unable to connect to geo service', undefined) //Callback requiere de dos inputs. Dado que sabemos que en esta casuistica va a dar error, mandamos un string y una variable vacia al callback que se encargara de proporcionarlo a geocode
        } else if (response.body.features.length === 0){
            callback('La busqueda introducida no produjo resultados')
        } else{
            callback(undefined, {
                latitude: response.body.features[0].center[1],
                longitude: response.body.features[0].center[0],
                place_name: response.body.features[0].place_name,
                output: 'La latitud en '+ response.body.features[0].place_name + ' es ' + response.body.features[0].center[1] + ' y la longitud ' + response.body.features[0].center[0]
            })
        }
    })
}

module.exports = geocode


