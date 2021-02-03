const request = require('request')
const { ADDRGETNETWORKPARAMS } = require('dns')

const forecast = (latitude, longitude, callback) => {
    const url_weather= 'http://api.weatherstack.com/current?access_key=cd38c6b28ae94a4dc960efbc626f9150&query='+latitude+','+longitude
    request({url: url_weather, json:true}, (error, response) => { //sabemos que response es un objeto del cual solo vamos a usar body, por lo que podriamos deconstruirlo usando (error, {body}, pero me parece que es mas lio)
        if (error){
            callback('Unable to connect to weather service', undefined) 
        } else if (response.body.error){ //si hubieramos deconstruido, aqui podriamos ahorrarnos response y poner unicamente body.error
            callback(response.body.error.info, undefined)
        } else{
            callback(undefined, {
                response: 'Its ' +response.body.current.weather_descriptions[0] +' in '+ response.body.location.region + '. It is currently ' + response.body.current.temperature + ' degrees out. It feels like ' + response.body.current.feelslike + ' degrees out'
            })
        }  
    })

}

module.exports = forecast