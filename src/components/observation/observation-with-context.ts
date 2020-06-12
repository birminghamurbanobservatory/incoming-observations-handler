export interface ObservationWithContext {
  id?: string;
  madeBySensor?: string;
  hasResult?: Result;
  resultTime?: string | Date;
  phenomenonTime?: PhenomenonTime;
  observedProperty?: string;
  aggregation?: string;
  usedProcedures?: string[];
  location?: any;
  hasDeployment?: string;
  hostedByPath?: string[];
  hasFeatureOfInterest?: string;
}

interface Result {
  value: any;
  unit?: string;
}

interface PhenomenonTime {
  hasBeginning: string;
  hasEnd: string;
}