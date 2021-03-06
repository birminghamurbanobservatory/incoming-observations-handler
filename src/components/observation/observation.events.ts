import {logCensorAndRethrow} from '../../events/handle-event-handler-error';
import * as logger from 'node-logger';
import * as Promise from 'bluebird';
import {BadRequest} from '../../errors/BadRequest';
import {processIncomingObservation, processObservationWithContext, processObservationSaved} from './observation.controller';
import * as event from 'event-stream';
import * as joi from '@hapi/joi';



export async function subscribeToIncomingObservationEvents(): Promise<void> {

  const subscriptionFunctions = [
    subscribeToObservationIncomingEvents,
    subscribeToObservationWithContextEvents,
    subscribeToObservationSavedEvents
  ];

  // I don't want later subscriptions to be prevented, just because an earlier attempt failed, as I want my event-stream module to have all the event names and handler functions added to its list of subscriptions so it can add them again upon a reconnect.
  await Promise.mapSeries(subscriptionFunctions, async (subscriptionFunction): Promise<void> => {
    try {
      await subscriptionFunction();
    } catch (err) {
      if (err.name === 'NoEventStreamConnection') {
        // If it failed to subscribe because the event-stream connection isn't currently down, I still want it to continue adding the other subscriptions, so that the event-stream module has all the event names and handler functions added to its list of subscriptions so it can add them again upon a reconnect.
        logger.warn(`Failed to subscribe due to event-stream connection being down`);
      } else {
        throw err;
      }
    }
    return;
  });

  return;
}



//-------------------------------------------------
// New incoming observation
//-------------------------------------------------
async function subscribeToObservationIncomingEvents(): Promise<any> {
  
  const eventName = 'observation.incoming';

  const observationIncomingMessageSchema = joi.object({
    // We'll let the controller check the actual properties
  })
  .unknown()
  .required();

  await event.subscribe(eventName, async (message): Promise<void> => {

    logger.debug(`New ${eventName} message.`, message);

    try {
      const {error: err} = observationIncomingMessageSchema.validate(message);
      if (err) throw new BadRequest(`Invalid ${eventName} request: ${err.message}`);    
      await processIncomingObservation(message);
    } catch (err) {
      logCensorAndRethrow(eventName, err);
    }

    return;
  });

  logger.debug(`Subscribed to ${eventName} requests`);
  return;
}


//-------------------------------------------------
// Observation with context
//-------------------------------------------------
async function subscribeToObservationWithContextEvents(): Promise<any> {
  
  const eventName = 'observation.with-content';

  const observationWithContextMessageSchema = joi.object({
    // We'll let the controller check the actual properties
  })
  .unknown()
  .required();

  await event.subscribe(eventName, async (message): Promise<void> => {

    logger.debug(`New ${eventName} message.`, message);

    try {
      const {error: err} = observationWithContextMessageSchema.validate(message);
      if (err) throw new BadRequest(`Invalid ${eventName} request: ${err.message}`);    
      await processObservationWithContext(message);
    } catch (err) {
      logCensorAndRethrow(eventName, err);
    }

    return;
  });

  logger.debug(`Subscribed to ${eventName} requests`);
  return;
}


//-------------------------------------------------
// Observation with context
//-------------------------------------------------
async function subscribeToObservationSavedEvents(): Promise<any> {
  
  const eventName = 'observation.saved';

  const observationSavedMessageSchema = joi.object({
    // We'll let the controller check the actual properties
  })
  .unknown()
  .required();

  await event.subscribe(eventName, async (message): Promise<void> => {

    logger.debug(`New ${eventName} message.`, message);

    try {
      const {error: err} = observationSavedMessageSchema.validate(message);
      if (err) throw new BadRequest(`Invalid ${eventName} request: ${err.message}`);    
      await processObservationSaved(message);
    } catch (err) {
      logCensorAndRethrow(eventName, err);
    }

    return;
  });

  logger.debug(`Subscribed to ${eventName} requests`);
  return;
}