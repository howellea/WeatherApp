import { Router } from 'express';
const router = Router();

import HistoryService from '../../service/historyService.js';
import historyService from '../../service/historyService.js';

router.get('/', async (_req, res) => {
  try {
    const savedcities = await HistoryService.getCities();
    res.json(savedcities);
  } catch (err) {
    console.log(err);
    res.status(500).json(err);
  }
});

router.delete('/:id', async (req, res) => {
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
