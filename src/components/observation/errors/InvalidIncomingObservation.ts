import {BadRequest} from '../../../errors/BadRequest';

export class InvalidIncomingObservation extends BadRequest {

  public constructor(message = 'Invalid incoming observation') {
    super(message); // 'Error' breaks prototype chain here
    Object.setPrototypeOf(this, new.target.prototype); // restore prototype chain
  }

}