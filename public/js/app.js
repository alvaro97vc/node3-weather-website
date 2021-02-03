
console.log('Client side javascript file is loaded!')


const weatherForm = document.querySelector('form') //Utilizaremos este codigo para dotar de un eventListener a la etiqueta que engloba la casilla de texto y el boton
const search = document.querySelector('input') //input es la etiqueta encargada de recoger el texto de la casilla del lugar donde queremos saber el tiempo
const messageOne = document.querySelector('#message-1') //para tomar trozos de HTML por id en lugar de elementos, se emplea la #. podriamos poner 'p', pero eso tomaria el primer parrafo, y nosotros aqui queremos tomar la variable textONe
const messageTwo = document.querySelector('#message-2')


weatherForm.addEventListener('submit', (event) => {
    event.preventDefault() //previene que cada vez que le demos al boton la pagina se recargue enteramente

    const location = search.value

    messageOne.textContent = ''
    messageTwo.textContent = ''

    fetch('http://localhost:3000/weather?address=' + location).then((response) => { //De aqui fetch busca en la direccion provista un json, que guarda como response
        response.json().then((data) => {  //Del json saca data, que son tres objetos (si todo sale bien): forecast, location y adress.
           if (data.GeoError){
               //console.log(data.GeoError)
               messageTwo.textContent = data.GeoError //si hay algun error, la data recibida solo tendra un objeto que sera GeoError
           } 
           //console.log(data.forecast)
           messageOne.textContent = data.forecast //si todo ha ido bien, se enviara al index el contenido de forecast y location
           messageTwo.textContent = data.location
       })
   })

})