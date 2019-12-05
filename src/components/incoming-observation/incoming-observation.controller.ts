import {Observation} from './observation.class';
import {validateIncomingObservation} from './observation-validator';
import * as event from 'event-stream';



export async function processIncomingObservation(observation: Observation): Promise<void> {

  // TODO: If any of these phases fail I should really store the observation in a database for later processing, the database will need to keep a record of where we got up to to avoid repeating any steps.

  // First up check the observation is valid
  const validObs = validateIncomingObservation(observation);

  // Add some context to the observation
  const obsWithContext = await event.publishExpectingResponse('observation.add-context.request', {
    observation: validObs
  });

  // TODO: Apply some QC

  // Save the observation (the obs will now have an ID based upon the timeseries it was allocated to).
  const savedObs = await event.publishExpectingResponse('observation.create.request', {
    new: obsWithContext
  });

  // Publish the finished observation so subscribed microservices can do something with it
  await event.publish('observation.outgoing', savedObs);

}