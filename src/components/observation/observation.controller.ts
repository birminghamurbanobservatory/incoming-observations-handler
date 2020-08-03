import {ObservationIncoming} from './observation-incoming';
import {ObservationWithContext} from './observation-with-context';
import {validateIncomingObservation} from './observation-validator';
import * as event from 'event-stream';
import * as logger from 'node-logger';
import {ObservationSaved} from './observation-saved';


export async function processIncomingObservation(observation: ObservationIncoming): Promise<void> {

  logger.debug('Processing incoming observation', observation);

  // First up check the observation is valid
  const validObs = validateIncomingObservation(observation);
  logger.debug('Incoming observation is valid');

  // Ask for context to be added to the observation
  await event.publish('observation.add-context', {
    observation: validObs
  }, {
    replyTo: 'observation.with-content' // this should match the eventname in observation.events.ts
  });

  logger.debug('Observation has been sent for context to be added');

  return;

}



export async function processObservationWithContext(observation: ObservationWithContext): Promise<void> {

  logger.debug('Processing observation that has context', observation);

  // There's not much point in validating the observations, because the observation-manager is about to validate the observation anyway.

  await event.publish('observation.create', {
    new: observation
  }, {
    replyTo: 'observation.saved'
  });
  logger.debug('Observation has been sent to be saved.');

  return;

}


export async function processObservationSaved(observation: ObservationSaved): Promise<void> {

  logger.debug('Processing observation that has just been saved', observation);

  // Now pass it to the quality-controller to check
  await event.publish('observation.quality-control', {
    observation
  });
  // TODO: Eventually you may wish to supply a replyTo property to the options object which will cause the quality controlled observation to be published to an event-stream that can be decided here. E.g. observation.checked. Then you can have other microservices subscribe to this.
  logger.debug('Observation has been sent to be quality controlled.');

  return;

}