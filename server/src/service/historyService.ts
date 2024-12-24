import fs from 'node:fs/promises';

// TODO: Define a City class with name and id properties


class City { 
  name: string;
  id_properties: string;

  constructor ( name:string, id_properties: string) {
this.name =name;
this.id_properties= id_properties;
  }

}

// TODO: Complete the HistoryService class
class HistoryService {
  city: string | null;

  constructor( city: string) { 

  }
  private filePath = 'searchHistory.json';

  // TODO: Define a read method that reads from the searchHistory.json file
  private async read(): Promise<any> {
    try {
      const data = await fs.readFile(this.filePath, 'utf-8');
      return JSON.parse(data);
    } catch (err) {
      console.error('Error reading file:', err);
      return []; // Return an empty array if there is an error
    }
  }
  }
 
 
  // TODO: Define a write method that writes the updated cities array to the searchHistory.json file
  private async write(cities: City[]):  {
    try {
      await fs.writeFile(this.filePath, JSON.stringify(cities, null, 2));
    } catch (err) {
      console.error('Error writing file:', err);
    }
  }
  
  // TODO: Define a getCities method that reads the cities from the searchHistory.json file and returns them as an array of City objects
  async getCities() {
    return await this.read();
  }
  
  // TODO Define an addCity method that adds a city to the searchHistory.json file
  async addCity(city: string) {

    const cities = await this.getCities();
    const newCity = new City(city);
    cities.push(newCity);
    await this.write(cities);
  }


  // * BONUS TODO: Define a removeCity method that removes a city from the searchHistory.json file
  async removeCity(id: string) {
    let cities: any = await this.getCities();
    cities = cities.filter((city: { id: any; }) => city.id !== id);
    await this.write(cities);
  }
}

export default new HistoryService();
