import mongoose from 'mongoose'

// Define the schema for individual attributes in each schema
const attributeSchema = new mongoose.Schema({
  var_name: { type: String, required: true },
  db_type: { type: String, required: true },
  var_dbname: { type: String, required: true },
  isUUID: { type: Boolean },
  isRequired: { type: Boolean },
  isIndexed: { type: Boolean },
  isSet: { type: Boolean }
});

// Define the schema for routes within each schema
const routeSchema = new mongoose.Schema({
  url: { type: String, required: true },
  service_name: { type: String, required: true },
  controller_name: { type: String, required: true },
  criterias: [
    {
      targetVar: { type: String },
      operationType: { type: String },
      valueType: { type: String }
    }
  ]
});

// Define the schema for relations within each schema
const relationSchema = new mongoose.Schema({
  schema: { type: String, required: true },
  target: { type: String, required: true },
  lazyLoad: { type: Boolean },
  type: { type: String, required: true }
});

// Define the schema for each individual schema
const schemaSchema = new mongoose.Schema({
  schema_name: { type: String, required: true },
  schema_dbname: { type: String, required: true },
  attributes: [attributeSchema],
  routes: [routeSchema],
  relations: [relationSchema]
});

// Define the Project schema
const projectSchema = new mongoose.Schema({
  projectName: { type: String, required: true },
  schemas: [schemaSchema]
}, { timestamps: true });

const Project = mongoose.model('Project', projectSchema);

export default Project;
