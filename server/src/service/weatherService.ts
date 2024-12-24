import dotenv from 'dotenv'; //The dotenv package is a great way to keep passwords, API keys, and other sensitive data out of your code. 
import { NonNullChain } from 'typescript';

// It allows you to create environment variables in a . env file instead of putting them in your code.
dotenv.config();
// Config. config will read your .env file, parse the contents, assign it to process.env , and return an Object with a parsed key containing the loaded content or an error key if it failed

// TODO: Define an interface for the Coordinates object
interface Coordinates {
  // declare the properties
  lon: number;
  lat: number;
}


// TODO: Define a class for the Weather object
interface Weather { 
  temperature: number
  description: string
  humidity: number,
  windSpeed: Number }

let city: null;

// TODO: Complete the WeatherService class
class WeatherService {
  apiKey: string | undefined;
  baseURL: string | undefined;
  city: string | null;
  locationData: Coordinates | null;
  

  // TODO: Define the baseURL, API key, and city name properties

  constructor(apiKey: string | undefined , baseURL: string, city: string | null , locationData: Coordinates | null) {
    this.apiKey = process.env.API_KEY ;//  API key in the environment variables
    this.baseURL = process.env.API_BASE_URL ; //  OPENWEATHER  URL in the environment variables
    this.locationData = null;
    this.city= null;
    


  // TODO: Create fetchLocationData method
  private async fetchLocationData(city: string | null) : Promise<string | null> {
    const query = `${this.baseURL}/geo/1.0/direct?q=${city}&limit=10&appid=${this.apiKey}`

    try {
      const response = await fetch(query);
      // Check if the response is OK (status code 200)
      if (!response.ok) {
        throw new Error(`Error fetching location data: ${response.statusText}`);
      }
      this.locationData = data [0];
   // Process and return the relevant locatiion data;
      return this.locationData 
    } catch (error) {
        console.error(error);
        throw new Error('Failed to retrieve location data');
    }
  }
  // TODO: Create destructureLocationData method
  private destructureLocationData(locationData: Coordinates): Coordinates {
    if (locationData) {
      return{
      lon: locationData.lon,
      lat: locationData.lat,
    };
  }
    else {
      console.log('No data fetched yet.');
      return { lon: 0, lat:0 }  // giving the coordinated a value if there wasnt one given
    }
  }

  // TODO: Create buildGeocodeQuery method
  private buildGeocodeQuery(): string {
      if (!this.locationData) {
        throw new Error('Location data not available.');
      }
      const rev_query = `${this.baseURL}/geo/1.0/reverse?lat=${this.locationData.lat}&lon=${this.locationData.lon}&limit=5&appid=${this.apiKey}`;
  
      try {
        const response = await fetch(rev_query);
        if (!response.ok) {
          throw new Error(`Error fetching reverse location data: ${response.statusText}`);
        }
        const data = await response.json();
        return data[0]; // Assuming the first result is the desired one
      } catch (error) {
        console.error(error);
        throw new Error('Failed to retrieve reverse location data');
      }
  }

  // TODO: Create buildWeatherQuery method
  private buildWeatherQuery(coordinates: Coordinates): string {
    
    return `${this.baseURL}/data/2.5/weather?lat=${coordinates.lat}&lon=${coordinates.lon}&appid=${this.apiKey}&units=metric`;
  }

  // TODO: Create fetchAndDestructureLocationData method
  private async fetchAndDestructureLocationData(city: null) {
      const locationUrl = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}`;
      const response = await fetch(locationUrl);
      if (!response.ok) {
          throw new Error(`Error fetching location data: ${response.statusText}`);
      }
      const data = await response.json();
      return {
          lat: data.coord.lat,
          lon: data.coord.lon,
      };
  }

  // TODO: Create fetchWeatherData method 
  // This method should be updated to accept coordinates and fetch the weather data using those coordinates.
  private async fetchWeatherData(coordinates: Coordinates): Promise<any> {

  const weatherUrl = `https://api.openweathermap.org/data/2.5/forecast?lat=${coordinates.lat}&lon=${coordinates.lon}&appid=${apiKey}&units=metric`;
  const response = await fetch(weatherUrl);
  if (!response.ok) {
      throw new Error(`Error fetching weather data: ${response.statusText}`);
  }
  return await response.json();

  // TODO: Build parseCurrentWeather method
  // This method should extract relevant information from the current weather response.
  private parseCurrentWeather(response: any) {
    return {
      temperature: response.main.temp,
      description: response.weather[0].description,
      humidity: response.main.humidity,
      windSpeed: response.wind.speed,
  };
  }


  // TODO: Complete buildForecastArray method
// This method should create an array of forecast data from the weather data.

  private buildForecastArray(currentWeather: Weather, weatherData: any[]) {

    return weatherData.map(item => ({
      date: item.dt_txt,
      temperature: item.main.temp,
      weather: item.weather[0].description,
      humidity: item.main.humidity,
      windSpeed: item.wind.speed,}));

  }
  
  

  // TODO: Complete getWeatherForCity method
  // You already have a good start on this method. You can integrate the other methods to complete it.
  async getWeatherForCity(city: string) {
    try {
      const coordinates = await this.fetchAndDestructureLocationData(city);
      const weatherData = await this.fetchWeatherData(coordinates);
      const currentWeather = this.parseCurrentWeather(weatherData);
      const forecast = this.buildForecastArray(currentWeather, weatherData.list);
      const weatherQuery = this.buildWeatherQuery(coordinates);
      const locationData = await this.fetchLocationData(city);
      
      return {
          city: city,
          country: weatherData.city.country,
          currentWeather, 
          forecast,
          weatherQuery,
          locationData,
      };
  } catch (error) {
      console.error(error);
      throw new Error('Failed to retrieve weather data');
  }
}

export default new WeatherService();
