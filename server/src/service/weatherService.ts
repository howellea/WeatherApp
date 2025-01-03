import dotenv from 'dotenv'; //The dotenv package is a great way to keep passwords, API keys, and other sensitive data out of your code. 

// It allows you to create environment variables in a . env file instead of putting them in your code.
dotenv.config();
// Config. config will read your .env file, parse the contents, assign it to process.env , and return an Object with a parsed key containing the loaded content or an error key if it failed

// TODO: Define an interface for the Coordinates object
interface Coordinates {
  // declare the properties
   name: string;
   lat: number;
  lon: number;
  country : string;
  state?: string | undefined;
}


// TODO: Define a class for the Weather object
type Weather = {
      city: string,
      date: number, 
      icon: string,
      iconDescription: string, 
      tempF: number, 
      windSpeed: number, 
      humidity: number, 
};



// TODO: Complete the WeatherService class
class WeatherService {
  private apiKey: string;
  private baseURL: string;
  city:string | null;
  // private locationData: Coordinates | null; 

  // TODO: Define the baseURL, API key, and city name properties

  constructor() {
    this.apiKey = process.env.API_KEY || '';//  API key in the environment variables
    this.baseURL = process.env.API_BASE_URL || ''; //  OPENWEATHER  URL in the environment variables
    // this.locationData = null;
    this.city = null;

    if (!this.apiKey || !this.baseURL) {
      throw new Error('API key or base URL is not defined.');
    }
  }
  

  // TODO: Create fetchLocationData method
  private async fetchLocationData(query: string, requestId: string) {
  console.log(requestId,"fetchLocationData")
   const ReqQuery =`${this.baseURL}/geo/1.0/direct?q=${query}&limit=10&appid=${this.apiKey}`;
    try {
      const response = await fetch(ReqQuery);
      // Check if the response is OK (status code 200)
      if (!response.ok) {
        throw new Error(`Error fetching location data: ${response.statusText}`)
      };
      const data= await response.json()
   // Process and return the relevant locatiion data
   if (!data || data.length === 0) {
    throw new Error('No location data found for the provided city.');
  }
return data 
  // Assign and return the first matched location
} catch (error) {
  console.error(error);
  throw new Error('Failed to retrieve location data.');
}
  }

  // TODO: Create destructureLocationData method
  private destructureLocationData(locationData: Coordinates, requestId: string): Coordinates {
      console.log(requestId,'destructureLocationData')
      const {  name,lat, lon,country, state } = locationData; 
      return { name, lat, lon,country, state};
  }

  // TODO: Create buildGeocodeQuery method
  private async buildGeocodeQuery(requestId: string): Promise<string> {
    console.log(requestId,"buildGeoQuery", this.city);
    return `${this.city}&limit=10&appid=${this.apiKey}`;
  }
  // TODO: Create buildWeatherQuery method
  private buildWeatherQuery(requestId: string, coordinates: Coordinates): string {
    console.log(requestId,"buildWeatherQuery",coordinates)
    const {lat, lon} = coordinates;
  return `lat=${lat}&lon=${lon}&appid=${this.apiKey}&units=imperial`
  }

  // TODO: Create fetchAndDestructureLocationData method
  private async fetchAndDestructureLocationData(requestId: string) {
    const locationQuery =this.buildGeocodeQuery(requestId);
    const locationData = await this.fetchLocationData(await locationQuery, requestId);
    const coordinates = this.destructureLocationData(locationData[0], requestId);
   return coordinates;
  }

  // TODO: Create fetchWeatherData method 
  // This method should be updated to accept coordinates and fetch the weather data using those coordinates.
  private async fetchWeatherData(requestId: string, coordinates: Coordinates): Promise<any> {
    const weatherQuery = this.buildWeatherQuery(requestId, coordinates);

    try {
      const response = await fetch(`${this.baseURL}/data/2.5/weather?${weatherQuery}`);

      if (!response.ok) {
        throw new Error(`Error fetching weather data: ${response.statusText}`);
       }
       const data = await response.json();
       return data;
    }catch (error) {
      console.error(error);
      throw new Error('Failed to retrieve weather data.');
    }
    }
  // TODO: Build parseCurrentWeather method
  // This method should extract relevant information from the current weather response.
  private async parseCurrentWeather(requestId: string, response: any){
  console.log(requestId,"parseCurrentWeather");
    // display needs for current weather 
      // city:, 
      // date: , 
      // icon, 
      // iconDescription, 
      // tempF, 
      // windSpeed, 
      // humidity 

const city = response.name;
const date = new Date( response.dt*1000).toLocaleDateString;
const icon = response.weather[0].icon;
const iconDescription =response.weather[0].description;
const tempF = response.main.temp;
const windSpeed = response.wind.speed
const  humidity =response.main.humidity


return  { city, date, icon, iconDescription, tempF, windSpeed, humidity }
  }

    // TODO: Complete buildForecastArray method
// This method should create an array of forecast data from the weather data.
  private buildForecastArray(requestId: string, currentWeather: Weather, weatherData: any[]): any[] {
    // Implement logic to structure forecast data
console.log (requestId, "this is buildForecastArray" )
  //const { date, icon, iconDescription, tempF, windSpeed, humidity } = forecast;

  // const { col, cardTitle, weatherIcon, tempEl, windEl, humidityEl } = createForecastCard();

  return weatherData.map((forecast: any) => ({
      date: forecast.dt_txt.split(' ')[0],
      temp: forecast.main.temp,
      wind: forecast.wind.speed,
      humidity: forecast.main.humidity,
      icon: forecast.weather[0].icon,
    }));
  }
  // TODO: Complete getWeatherForCity method
  // You already have a good start on this method. You can integrate the other methods to complete it.
async getWeatherForCity(city: string, requestId: string): Promise<any> {
  try{
  console.log (requestId, 'getWeatherForCity',city);
    this.city = city;
    const coordinates = await  this.fetchAndDestructureLocationData(requestId);
    const weatherdata = await this.fetchWeatherData(requestId,coordinates);
    console.log(requestId,"weatherData", weatherdata );
    const  currentWeather = this.parseCurrentWeather(requestId,weatherdata);
    const forecast = this.buildForecastArray( requestId, currentWeather, weatherdata)
    return {currentWeather, forecast};
  } 
   
   catch (error) {
          console.error(error);
          throw new Error(`Failed to fetch weather for city: ${city}`);
        }
      }
    }
// Export an instance of WeatherService
export default new WeatherService();