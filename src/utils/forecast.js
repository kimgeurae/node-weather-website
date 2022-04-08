const fetch = require('node-fetch')
const openWeatherAPI_KEY = '0009c03f8cef994866e0872b246108c6'

function generateOpenWeatherMapUrl(latitude, longitude) {
    return `https://api.openweathermap.org/data/2.5/onecall?lat=${latitude}&lon=${longitude}&lang=pt_br&units=metric&exclude=minutely,hourly&appid=${openWeatherAPI_KEY}`
}

const forecast = (latitude, longitude, callback) => {
    fetch(generateOpenWeatherMapUrl(latitude, longitude)).then(res => res.json()).then(({cod, current, alerts}) => {
        if(cod) callback('Unable to find weather for the geolocation data.', undefined)
        else {
            const { temp: temperature, feels_like } = current
            let callback_alerts = {
                sender_name: undefined,
                event: undefined,
                description: undefined
            }
            if(alerts) {
                ({ sender_name : callback_alerts.sender_name, event : callback_alerts.event, description : callback_alerts.description } = alerts[0])
            }
            callback(undefined, {
                temperature,
                feels_like,
                alerts: callback_alerts
            })
        }
    }).catch(err => {
        console.log(err)
        callback('Unable to connect to weather service.', undefined)
    })
}

module.exports = forecast