export class Observation {
  public id?: string;
  public madeBySensor?: string;
  public hasResult?: Result;
  public resultTime?: string | Date;
  public phenomenonTime?: PhenomenonTime;
  public observedProperty?: string;
  public aggregation?: string;
  public usedProcedures?: string[];
}

class Result {
  value: any;
  unit?: string;
}

class PhenomenonTime {
  hasBeginning: string;
  hasEnd: string;
}