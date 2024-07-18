import { Router } from 'express';
import logger from '../config/logger.js';

const router = Router();

router.get('/loggerTest', (req, res) => {
  logger.debug('Debug log');
  logger.info('Info log');
  logger.warn('Warning log');
  logger.error('Error log');
  logger.error('Fatal log - este é um erro crítico');

  res.send('Logs gerados. Verifique o console e o arquivo errors.log.');
});

export default router;