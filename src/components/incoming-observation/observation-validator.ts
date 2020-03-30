import * as joi from '@hapi/joi';
import {InvalidIncomingObservation} from './errors/InvalidIncomingObservation';
import {Observation} from './observation.class';
import {validateGeometry} from '../../utils/geojson.validator';

const schema = joi.object({
  madeBySensor: joi.string().required(),
  // N.B. at this point the sensor should NOT yet have any concept of which deployment it is in or which platform it is on.
  hasResult: joi.object({
    value: joi.any().required(),
    flags: joi.array().items(joi.string())
  }).required(),
  resultTime: joi.string()
    .isoDate()
    .required(),
  phenomenonTime: joi.object({
    hasBeginning: joi.string().isoDate(),
    hasEnd: joi.string().isoDate()
  }),
  observedProperty: joi.string(), // TODO: Add a PascalCase regex checker here?
  unit: joi.string(),
  usedProcedures: joi.array().items(joi.string()),
  // N.B. at this stage the observation shouldn't have disciplines or hasFeatureOfInterest applied, this is the responsibility of the sensor-deployment-manager.
  location: joi.object({
    id: joi.string().guid(), // this is the client_id, a uuid,
    validAt: joi.string().isoDate(),
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


export function validateIncomingObservation(observation): Observation {

  const {error: err, value: validatedObservation} = schema.validate(observation);

  if (err) {
    throw new InvalidIncomingObservation(err.message);
  } 

  return validatedObservation;

}