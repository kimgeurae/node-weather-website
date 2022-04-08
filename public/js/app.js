// const fetch = require('node-fetch')

console.log('Client side javascript file is loaded!')

const weatherForm = document.querySelector('form')
const search = document.querySelector('input')
const forecastResponse = document.querySelector('#forecast-response')

// forecastParagraph.textContent = "From JS"

weatherForm.addEventListener('submit', (e) => {
    e.preventDefault()

    const location = search.value

    forecastResponse.textContent = 'Loading...'

    fetch('/weather?address='+location).then(res => res.json()).then(json => {
        if(json.error) {
            forecastResponse.textContent = json.error
            console.log(json.error)
        } else {
            forecastResponse.textContent = json.forecast
            console.log(json)
        }
    }).catch(err => {
        forecastResponse.textContent = json.error
        console.log(err)
    })

    console.log(location)
})