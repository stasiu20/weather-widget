const APIKEY_GEOCODE = 'pk.eyJ1Ijoic3Rhc2l1IiwiYSI6ImNrMmE3eHVtdTJoNXozYm16NWpmZGc1Z2gifQ.wC1CrGozzrNaO4QifWzeUA'
const APIKEY_FORECAST = 'ef9ec5dc4a5a7660974931af3e996587'

class WeatherWidget extends HTMLElement {

    constructor() {
        super()
        let head = document.getElementsByTagName('HEAD')[0]
        let shadow = this.attachShadow({mode: 'open'})
//External Stylesheet
        const linkElem = document.createElement('link')
        linkElem.setAttribute('rel', 'stylesheet')
        linkElem.setAttribute('type', 'text/css')
        linkElem.setAttribute('href', 'widgets/weather-widget/style.css')
//Font Awsome
        const fontsAwesome = document.createElement('link')
        fontsAwesome.setAttribute('rel', 'stylesheet')
        fontsAwesome.setAttribute('href', 'widgets/weather-widget/fontawesome-free-5.12.1-web/css/all.css')
//Container Div
        let container = document.createElement('div')
        container.setAttribute('id', 'container')
//Current Card Container
        let currentCardCont = document.createElement('div')
        currentCardCont.setAttribute('class', 'current-weather-container')
//Current Header
        let currentHeader = document.createElement('div')
        currentHeader.setAttribute('class', 'current-weather-header')
//Current Card Div
        let currentCard = document.createElement('div')
        currentCard.setAttribute('class', 'current-weather')
///Current Info Div
        let info = document.createElement('div')
        info.setAttribute('class','current-weather-info')
//Current Weather Left Card
        let leftCardCont = document.createElement('div')
        leftCardCont.setAttribute('class', 'left-card-container')
//Current Canvas Icon
        let canvas = document.createElement('canvas')
        canvas.setAttribute('class', 'current-weather-icon')
//Current Weather Description
        let currentDesc = document.createElement('p')
        currentDesc.setAttribute('class', 'current-weather-description')

        head.insertAdjacentElement('afterbegin',fontsAwesome)
        shadow.appendChild(linkElem)
        shadow.appendChild(container)
        container.appendChild(currentCardCont)
        currentCardCont.appendChild(currentHeader)
        currentCardCont.appendChild(currentCard)
        currentCard.appendChild(leftCardCont)
        currentCard.appendChild(info)
        leftCardCont.appendChild(canvas)
        leftCardCont.appendChild(currentDesc)
        
    }
    
    connectedCallback() {
        const city = 'Płock'
        const shadow = this.shadowRoot
        
        getWeatherByCords(city).then(data => {
            console.log(data)

            currentWeather(data, shadow)
            
        }).catch(err => {
            console.log(err)
        })
        
      }
}

const currentWeather = (data, shadow) => {
        let header = shadow.querySelector('.current-weather-header')
        let canvas = shadow.querySelector('.current-weather-icon')
        let info = shadow.querySelector('.current-weather-info')
        let desc = shadow.querySelector('.current-weather-description')

        let temperatureIcon = document.createElement('i')
        temperatureIcon.setAttribute('class', "fas fa-thermometer-three-quarters")
        let temperatureSpan = document.createElement('span')
        temperatureSpan.setAttribute('class', 'info-span')

        info.innerHTML = '<i class="fas fa-thermometer-three-quarters"></i>'
        let skycons = new Skycons({"color": "dark-grey"})
        header.textContent = 'Current Conditions'
        desc.textContent = data.currently.summary
        temperatureSpan.innerHTML = `${data.currently.temperature} &#8451;`
        skycons.add(canvas, data.currently.icon)
        skycons.play()

        
        info.appendChild(temperatureIcon)
        info.appendChild(temperatureSpan)
}


// get country lat lon 

const getWeatherByCords = async (city = 'Płock') => {
    const cords = await getCityCordsWidget(city)
    
    let lon = cords.features[0].geometry.coordinates[0]
    let lat =  cords.features[0].geometry.coordinates[1]
    const weather = await getWeatherWidget(lon, lat)

    return weather
}

const getCityCordsWidget = async (city) => {
    const response = await fetch(`https://api.mapbox.com/geocoding/v5/mapbox.places/${city}.json?access_token=${APIKEY_GEOCODE}&limit=1`)
    if(response.status == 200 ) {
        return response.json()
    }else {
        throw new Error('Coś poszło nie tak z pobraniem koordynatów')
    }

}


const getWeatherWidget = async (lon, lat) => {
    const response = await fetch(`https://cors-anywhere.herokuapp.com/https://api.darksky.net/forecast/${APIKEY_FORECAST}/${lat},${lon}?lang=pl&units=si`)
    if (response.status === 200) {
        return response.json()
    } else {
        throw new Error('Coś poszło nie tak z pogodą')
    } 
}


customElements.define('weather-widget', WeatherWidget)
