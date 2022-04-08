const fetch = require('node-fetch')

const positionStackAPI_KEY = '38f05d89ab2361c1c8e3532886b03e08'
const positionStackURL = `http://api.positionstack.com/v1/forward?access_key=${positionStackAPI_KEY}&limit=1&query=`

const geocode = (address, callback) => {
    fetch(positionStackURL+encodeURIComponent(address)).then(res => res.json()).then(json => {
        if (json.error) {
            callback('Input value is invalid, check your input and try again.', undefined)
        } else if(json.data.length === 0) {
            callback('Unable to find geolocation, check your input and try again.', undefined)
        } else {
            const fetchedData = Array.isArray(json.data) ? json.data.shift() : json.data
            const { latitude, longitude, label: location } = fetchedData
            console.log(latitude + ' ' + longitude + ' ' + location)
            callback(undefined, {
                location,
                latitude,
                longitude
            })
        }
    }).catch(err => {
        console.log(err)
        callback('Unable to connect to geolocation services.', undefined)
    })
}

module.exports = geocode