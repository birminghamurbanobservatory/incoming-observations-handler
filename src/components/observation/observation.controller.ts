import {ObservationIncoming} from './observation-incoming';
import {ObservationWithContext} from './observation-with-context';
import {validateIncomingObservation} from './observation-validator';
import * as event from 'event-stream';
import * as logger from 'node-logger';


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

  // TODO: Eventually you might want to pass these observations on to a queue to be quality controlled rather than being saved. In which case you'll need another subscriber to listen for the observations once they have been quality controlled.

  // The observation now needs saving
  // TODO: Eventually you may wish to supply a replyTo property to the options object which will cause the saved observation to be published to an event-stream that can be decided here. E.g. observation.saved or observation.outgoing. Then you can have other microservices subscribe to this.
  await event.publish('observation.create', {
    new: observation
  });
  logger.debug('Observation has been sent to be saved.');

  return;

}