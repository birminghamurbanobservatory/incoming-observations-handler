import {subscribeToIncomingObservationEvents} from '../components/observation/observation.events';

export async function invokeAllSubscriptions(): Promise<void> {

  await subscribeToIncomingObservationEvents();

}


