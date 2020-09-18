//-------------------------------------------------
// Dependencies
//-------------------------------------------------
import {config} from './config';
import * as logger from 'node-logger';
const appName = require('../package.json').name; // Annoyingly if i use import here, the built app doesn't update.
import {getCorrelationId} from './utils/correlator';
import './utils/handle-uncaught-errors';
import {initialiseEvents} from './events/initialise-events';


//-------------------------------------------------
// Logging
//-------------------------------------------------
logger.configure(Object.assign({}, config.logger, {getCorrelationId})); 
logger.warn(`${appName} restarted`);



(async(): Promise<void> => {

  //-------------------------------------------------
  // Events
  //-------------------------------------------------
  try {
    await initialiseEvents({
      url: config.events.url,
      appName,
      logLevel: config.events.logLevel,
      maxMessagesAtOnce: config.events.maxMessagesAtOnce
    });
  } catch (err) {
    logger.error('There was an issue whilst initialising events.', err);
  }
  return;


})();
