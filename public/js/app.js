
console.log('Client side javascript file is loaded!')


const weatherForm = document.querySelector('form') //Utilizaremos este codido para captar el texto introducido en la pagina web
const search = document.querySelector('input') //input es la etiqueta encargada de recoger el texto de la casilla del lugar donde queremos saber el tiempo
const messageOne = document.querySelector('#message-1') //para tomar trozos de HTML por id en lugar de elementos, se emplea la #. podriamos poner 'p', pero eso tomaria el primer parrafo, y nosotros aqui queremos tomar la variable textONe
const messageTwo = document.querySelector('#message-2')


weatherForm.addEventListener('submit', (event) => {
    event.preventDefault() //previene que cada vez que le demos al boton la pagina se recargue enteramente

    const location = search.value

    messageOne.textContent = ''
    messageTwo.textContent = ''

    fetch('http://localhost:3000/weather?address=' + location).then((response) => {
        response.json().then((data) => {
           if (data.GeoError){
               //console.log(data.GeoError)
               messageTwo.textContent = data.GeoError
           } 
           //console.log(data.forecast)
           messageOne.textContent = data.forecast
           messageTwo.textContent = data.location
       })
   })

})