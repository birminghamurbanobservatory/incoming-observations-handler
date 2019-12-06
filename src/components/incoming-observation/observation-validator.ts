import * as joi from '@hapi/joi';
import {InvalidIncomingObservation} from './errors/InvalidIncomingObservation';
import {Observation} from './observation.class';

const schema = joi.object({
  madeBySensor: joi.string().required(),
  hasResult: joi.object({
    value: joi.any().required()
  }).required(),
  resultTime: joi.string()
    .isoDate()
    .required(),
  hasFeatureOfInterest: joi.string(),
  observedProperty: joi.string(),
  usedProcedures: joi.array().items(joi.string())
});


export function validateIncomingObservation(observation): Observation {

  const {error: err, value: validatedObservation} = schema.validate(observation);

  if (err) {
    throw new InvalidIncomingObservation(err.message);
  } 

  return validatedObservation;

}