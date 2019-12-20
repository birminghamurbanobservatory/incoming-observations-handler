import {OperationalError} from '../errors/OperationalError';
import {UnexpectedError} from '../errors/UnexpectedError';
import * as logger from 'node-logger';

export function logCensorAndRethrow(eventName, err): any {
  

  //------------------------
  // Operational Errors (local)
  //------------------------
  if (err instanceof OperationalError) {
    logger.warn(`Operational error whilst handling ${eventName} event.`, err);
    throw err;

  //------------------------
  // Operational Errors (event-stream)
  //------------------------
  // Operational errors that occurred in other microservices which returned an error via the event-stream won't be an intance of OperationalError, instead we'll use the presense of a statusCode to detect these.
  } else if (err.statusCode) {
    // May wish to handle 5xx errors separately, but in theory the other microservice has already censored this for us.
    logger.warn(`Operational error whilst handling ${eventName} event.`, err);
    throw err;

  //------------------------
  // Programmer Errors
  //------------------------
  } else {
    logger.error(`Unexpected error whilst handling ${eventName} event.`, err);
    // We don't want the event stream to return programmer errors.
    throw new UnexpectedError();

  }

}