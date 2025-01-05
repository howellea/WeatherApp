import { Router, type Request, type Response } from 'express';
import { randomUUID } from 'crypto';
const router = Router();



import historyService from '../../service/historyService.js';
import weatherService from '../../service/weatherService.js';

// TODO: GET weather data from city name


router.post('/',async (req: Request, res: Response) => {
  const requestId =randomUUID();
  console.log(requestId,"POST/api/weather",req.ip)
  console.log(requestId,req.body); 
 

  try {
    const { cityName } = req.body;
    console.log(requestId, cityName);

// POST Request with city name to retrieve weather data from the history service 
    await historyService.addCity(cityName)

// POST Request with city name to retrieve weather data from the weather service
    const weather = await weatherService.getWeatherForCity(cityName, requestId);  
    // return  res.status(200).json([weather, "weather"]);
    return  res.status(200).json(weather);
} catch (error: any) {
  console.log(requestId, error)
console.error(error);
if (error instanceof TypeError){
  return res.status(400).send("Bad Request")
};
return res.status(500).json({ error: 'Failed to retrieve weather data' });
}
});

// TODO: save city to search history
// TODO: GET search history
router.get('/history', async (req: Request, res: Response) => {

  const requestId = randomUUID();
  console.log(requestId,"GET/api/weather/history",req.ip);
 try{
  const cities = await historyService.getCities();
  res.status(200).json(cities);
  
  // if (!req.params.id) {
  // res.status(400).json({ msg: 'City id is required' });
} catch (error) {
  console.log(requestId, "error");
  console.error(error);
res.status(500).send({ error: 'Failed to retrieve search history' });
}

});



// * BONUS TODO: DELETE city from search history
router.delete('/history/:id', async (req: Request, res: Response) => {
  const requestId = randomUUID();
  res.status(200).send("City successfully removed from search history");
  const { id }=req.params;
  console.log(requestId, id)
  try {
    if (!req.params.id) {
      res.status(400).json({ msg: 'City id is required' });
    }
    await historyService.removeCity(req.params.id); 
    res.json({ success: 'City successfully removed from search history' });
   } catch (err) {
    console.log(err);
    res.status(500).json(err);
  }
});

export default router;
