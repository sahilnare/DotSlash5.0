import axios from 'axios';

const weatherUrl = 'https://api.openweathermap.org/data/2.5/onecall?lat=19.07&lon=72.87&exclude=current,minutely,alerts&units=metric&appid=e2fefc411ec798d7b1aa2b11e166858a';

const currentWeatherUrl = 'https://api.openweathermap.org/data/2.5/onecall?lat=19.07&lon=72.87&exclude=daily,hourly,minutely,alerts&units=metric&appid=e2fefc411ec798d7b1aa2b11e166858a';

const rainfallUrl = 'https://api.weatherbit.io/v2.0/forecast/daily?lat=19.07&lon=72.87&key=d0b261110ccd4192b531b6b6c387018c&days=7'

const airQuality = 'http://api.airvisual.com/v2/nearest_city?key=c4777a3e-379f-40e1-af12-1a3a5bf9d4ab';

export class WeatherService {

    getWeather(locationData) {
        return axios.get(`https://api.openweathermap.org/data/2.5/onecall?lat=${locationData.lat}&lon=${locationData.lon}&exclude=current,minutely,alerts&units=metric&appid=e2fefc411ec798d7b1aa2b11e166858a`)
        .then(res => res.data);
    }

    getCurrentWeather(locationData) {
        return axios.get(`https://api.openweathermap.org/data/2.5/onecall?lat=${locationData.lat}&lon=${locationData.lon}&exclude=daily,hourly,minutely,alerts&units=metric&appid=e2fefc411ec798d7b1aa2b11e166858a`)
        .then(res => res.data);
    }

    getCurrentRainfall(locationData) {
        return axios.get(`https://api.weatherbit.io/v2.0/forecast/daily?lat=${locationData.lat}&lon=${locationData.lon}&key=d0b261110ccd4192b531b6b6c387018c&days=7`)
        .then(res => res.data);
    }

    getAirQuality() {
        return axios.get(airQuality).then(res => res.data);
    }
}