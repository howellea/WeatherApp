import dotenv from 'dotenv'; //The dotenv package is a great way to keep passwords, API keys, and other sensitive data out of your code. 

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
type Weather = {
  id: number;
  main: string;
  description: string;
  icon: string; // Changed from Symbol to string
};


// TODO: Complete the WeatherService class
class WeatherService {
  apiKey: string | undefined;
  baseURL: string | undefined;
  city: string | null;
  locationData: Coordinates | null; 

  // TODO: Define the baseURL, API key, and city name properties

  constructor(apiKey: string | undefined , baseURL: string , locationData: Coordinates | null , city: string | null) {
    this.apiKey = process.env.API_KEY ;//  API key in the environment variables
    this.baseURL = process.env.API_BASE_URL ; //  OPENWEATHER  URL in the environment variables
    this.locationData = null;
    this.city= city;

    if (!this.apiKey || !this.baseURL) {
      throw new Error('API key or base URL is not defined.');
    }
  }
  

  // TODO: Create fetchLocationData method
 

  private async fetchLocationData(city: string ): Promise<Coordinates | null > {

    const query = `${this.baseURL}/geo/1.0/direct?q=${encodeURIComponent(city)}&limit=10&appid=${this.apiKey}`;
    try {
      const response = await fetch(query);
      // Check if the response is OK (status code 200)
      if (!response.ok) {
        throw new Error(`Error fetching location data: ${response.statusText}`)
      };
      const data= await response.json()
   // Process and return the relevant locatiion data
   if (!data || data.length === 0) {
    throw new Error('No location data found for the provided city.');
  }

  // Assign and return the first matched location
  const [location] = data;
  return {
    lon: location.lon,
    lat: location.lat,
  };
} catch (error) {
  console.error(error);
  throw new Error('Failed to retrieve location data.');
}
  }

  // TODO: Create destructureLocationData method
  private destructureLocationData(locationData: Coordinates[]): Coordinates {
    
    try {
      const [location] = locationData; // Extract the first element of the array
      return {
        lon: location.lon,
        lat: location.lat,
      };
    } catch (error) {
      console.error(error);
      throw new Error('Failed to retrieve location data.');
    }
  }

  // TODO: Create buildGeocodeQuery method
  private async buildGeocodeQuery(): Promise<string> {
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
      return data;
    } catch (error) {
      console.error(error);
      throw new Error('Failed to retrieve reverse location data');
    }
  }
  // TODO: Create buildWeatherQuery method
  private buildWeatherQuery(coordinates: Coordinates): string {
  return `${this.baseURL}/data/2.5/weather?lat=${coordinates.lat}&lon=${coordinates.lon}&appid=${this.apiKey}`
    
  }

  // TODO: Create fetchAndDestructureLocationData method
  private async fetchAndDestructureLocationData(city: string): Promise<Coordinates> {
    const locationData = await this.fetchLocationData(city);
    if (!locationData) {
      throw new Error('Location data not available.');
    }
    return this.destructureLocationData([locationData]);
  }

  // TODO: Create fetchWeatherData method 
  // This method should be updated to accept coordinates and fetch the weather data using those coordinates.
  private async fetchWeatherData(coordinates: Coordinates): Promise<any> {
    const query = this.buildWeatherQuery(coordinates);
    try {
      const response = await fetch(query);

      if (!response.ok) {
        throw new Error(`Error fetching weather data: ${response.statusText}`);
      }

      return await response.json();
    } catch (error) {
      console.error(error);
      throw new Error('Failed to retrieve weather data.');
    }
  }
 
  // TODO: Build parseCurrentWeather method
  // This method should extract relevant information from the current weather response.
  private parseCurrentWeather(response: any): Weather {
    return {
      id: response.weather[0].id,
      main: response.weather[0].main,
      description: response.weather[0].description,
      icon: response.weather[0].icon,
  };
}

    // TODO: Complete buildForecastArray method
// This method should create an array of forecast data from the weather data.
private buildForecastArray(weatherData: any[]): any[] {
  // Implement logic to structure forecast data
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
  async getWeatherForCity(city: string): Promise<any> {
    try {
      const coordinates = await this.fetchAndDestructureLocationData(city);

      const currentWeatherData = await this.fetchWeatherData(coordinates);

      const parsedWeather = this.parseCurrentWeather(currentWeatherData);

      return {
        city,
        currentWeather: parsedWeather,
        // Assuming forecast endpoint is integrated later
        forecast: [], // Populate with buildForecastArray when data is ready
      };
    } catch (error) {
      console.error(error);
      throw new Error(`Failed to fetch weather for city: ${city}`);
    } 
  }
}


export default new WeatherService();
