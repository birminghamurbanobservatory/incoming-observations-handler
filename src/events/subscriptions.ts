import {subscribeToIncomingObservationEvents} from '../components/incoming-observation/incoming-observation.events';

export async function invokeAllSubscriptions(): Promise<void> {

  await subscribeToIncomingObservationEvents();

}


