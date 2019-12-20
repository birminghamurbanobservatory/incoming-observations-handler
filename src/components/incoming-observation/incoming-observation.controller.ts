import {Observation} from './observation.class';
import {validateIncomingObservation} from './observation-validator';
import * as event from 'event-stream';
import * as logger from 'node-logger';


export async function processIncomingObservation(observation: Observation): Promise<Observation> {

  // TODO: If any of these phases fail I should really store the observation in a database for later processing, the database will need to keep a record of where we got up to to avoid repeating any steps.

  logger.debug('Processing incoming observation', observation);

  // First up check the observation is valid
  const validObs = validateIncomingObservation(observation);
  logger.debug('Incoming observation is valid');

  // Add some context to the observation
  const obsWithContext = await event.publishExpectingResponse('observation.add-context.request', {
    observation: validObs
  });
  logger.debug('Context (if available) as been added to observation', obsWithContext);
  // TODO: Apply some QC

  // Save the observation (the obs will now have an ID based upon the timeseries it was allocated to).
  const savedObs = await event.publishExpectingResponse('observation.create.request', {
    new: obsWithContext
  });
  logger.debug('Observation has been saved.', savedObs);

  // Publish the finished observation so subscribed microservices can do something with it
  await event.publish('observation.outgoing', savedObs);
  logger.debug('Observation has been published as outgoing.');

  return savedObs;

}