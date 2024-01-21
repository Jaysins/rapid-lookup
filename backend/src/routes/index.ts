import express from 'express';
import * as CountryController from '../controllers/country';
import * as CatalogueController from '../controllers/catalogue';

const router = express.Router();

router.get('/', (_req, res) => {
  return res.status(200).json({ success: true });
});

router.get('/countries', CountryController.getCountries);
router.get('/catalogues', CatalogueController.getCatalogues);

export default router;
