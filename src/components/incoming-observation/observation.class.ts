export class Observation {
  public id?: string;
  public madeBySensor?: string;
  public hasResult?: Result;
  public resultTime?: string | Date;
  public observedProperty?: string;
  public unit?: string;
  public usedProcedures?: string[];
}

class Result {
  value: any;
}