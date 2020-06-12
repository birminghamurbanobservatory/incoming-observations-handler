import * as joi from '@hapi/joi';
import {InvalidIncomingObservation} from './errors/InvalidIncomingObservation';
import {ObservationIncoming} from './observation-incoming';
import {validateGeometry} from '../../utils/geojson.validator';


//-------------------------------------------------
// Incoming observation
//-------------------------------------------------
const incomingObservationSchema = joi.object({
  madeBySensor: joi.string().required(),
  // N.B. at this point the sensor should NOT yet have any concept of which deployment it is in or which platform it is on.
  hasResult: joi.object({
    value: joi.any().required(),
    unit: joi.string(),
    flags: joi.array().items(joi.string())
  }).required(),
  resultTime: joi.string()
    .isoDate()
    .required(),
  phenomenonTime: joi.object({
    hasBeginning: joi.string().isoDate(),
    hasEnd: joi.string().isoDate()
  }),
  observedProperty: joi.string(),
  aggregation: joi.string(),
  usedProcedures: joi.array().items(joi.string()),
  // N.B. at this stage the observation shouldn't have disciplines or hasFeatureOfInterest applied, this is the responsibility of the sensor-deployment-manager.
  location: joi.object({
    id: joi.string().guid(), // this is the client_id, a uuid,
    validAt: joi.string().isoDate(),
    height: joi.number(), // height above ground in metres
    geometry: joi.object({
      type: joi.string().required(),
      coordinates: joi.array().required()
    })
    .custom((value) => {
      validateGeometry(value); // throws an error if invalid
      return value;
    })
    .required()
  })
});


export function validateIncomingObservation(observation): ObservationIncoming {

  const {error: err, value: validatedObservation} = incomingObservationSchema.validate(observation);

  if (err) {
    throw new InvalidIncomingObservation(err.message);
  } 

  return validatedObservation;

}

