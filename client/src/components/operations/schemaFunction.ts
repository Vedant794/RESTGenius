export class schemaFunction {
  handleAddSchema(
    schemas: any,
    setSchemas: React.Dispatch<React.SetStateAction<any[]>>
  ) {
    setSchemas([
      ...schemas,
      {
        schema_name: "",
        schema_dbname: "",
        attributes: [],
        routes: [],
        relation: [],
      },
    ]);
  }

  handleRemoveSchema(
    schemas: any,
    setSchemas: React.Dispatch<React.SetStateAction<any[]>>,
    index: number
  ) {
    setSchemas(schemas.filter((_: any, idx: number) => idx !== index));
  }
}

export type Attribute = {
  var_name: string;
  db_name: string;
  var_dbname: string;
  isRequired: boolean;
  isSet: boolean;
  isList: boolean;
  isObject: boolean;
  isDate: boolean;
  isUUID: boolean;
  isIndexed: boolean;
  attributes: Attribute[];
};

export const schemaFunc = new schemaFunction();
