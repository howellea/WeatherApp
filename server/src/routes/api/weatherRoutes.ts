import { Router, type Request, type Response } from 'express';
const router = Router();

// Middleware to parse JSON bodies
router.use(express.json());


import historyService from '../../service/historyService.js';
import weatherService from '../../service/weatherService.js';

// TODO: POST Request with city name to retrieve weather data
router.post('/', (req: Request, res: Response) => {
  // TODO: GET weather data from city name
 try {
  const City = req.body.city; // Assuming the city name is sent in the request body
  const location = await weatherService.fetchLocationData(City)
}
  catch {
    if (!cityName) {
      return res.status(400).json({ error: 'City name is required' });
  }
 }
  

});

  // TODO: save city to search history
});

// TODO: GET search history
router.get('/history', async (req: Request, res: Response) => {});

// * BONUS TODO: DELETE city from search history
router.delete('/history/:id', async (req: Request, res: Response) => {});

export default router;
