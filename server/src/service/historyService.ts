import path from 'node:path';
import { fileURLToPath } from 'node:url';
import fs from 'node:fs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// TODO: Define a City class with name and id properties

interface City { 
name: string;
id: number;
}

// // TODO: Complete the HistoryService class
class HistoryService {
private fileHistoryPath: string =path.resolve(__dirname, '../../db/db.json');

//   // TODO: Define a read method that reads from the searchHistory.json file
  private async read(): Promise<City[]> {
    try {
      const storedData = await fs.promises.readFile(this.fileHistoryPath, 'utf-8');
      return JSON.parse(storedData);
    } catch (err) {
      console.error('Error reading file:', err);
      return []; // Return an empty array if there is an error
    }
  }
  
 
 
  // TODO: Define a write method that writes the updated cities array to the searchHistory.json file
  private async write(cities: City[]): Promise<void> {
    try {
      await fs.promises. writeFile(this.fileHistoryPath, JSON.stringify(cities, null, 2));
    
    } catch (err) {
      console.error('Error writing file:', err);
    }
  }
  
  // TODO: Define a getCities method that reads the cities from the searchHistory.json file and returns them as an array of City objects
  async getCities() {
    const cities = await this.read();
    return cities;
  }
  
  // TODO Define an addCity method that adds a city to the searchHistory.json file
  async addCity(city: string): Promise<void> {

    const cities = await this.read();

    const id = cities.length + 1;
    const newCity = { id, name: city}
   
    cities.push(newCity); 
    await this.write(cities);
  }


//   // * BONUS TODO: Define a removeCity method that removes a city from the searchHistory.json file
// //   async removeCity(id: string) {
// //     let cities: any = await this.getCities();
// //     cities = cities.filter((city: City)=> city.id !==id)
// //     await this.write(cities);
// //   }
}

export default new HistoryService();
