import * as joi from '@hapi/joi';
import {InvalidIncomingObservation} from './errors/InvalidIncomingObservation';
import {Observation} from './observation.class';
import {validateGeometry} from '../../utils/geojson.validator';

const schema = joi.object({
  madeBySensor: joi.string().required(),
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
  hasFeatureOfInterest: joi.string(),
  observedProperty: joi.string(),
  usedProcedures: joi.array().items(joi.string()),
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