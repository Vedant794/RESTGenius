import mongoose from "mongoose";

// Define the schema for individual attributes in each schema
const attributeSchema = new mongoose.Schema(
  {
    var_name: { type: String, required: false, default: "" }, // Default empty string
    db_type: { type: String, required: false, default: "" }, // Default empty string
    var_dbname: { type: String, required: false, default: "" }, // Default empty string
    isUUID: { type: Boolean, default: undefined }, // Default null if not provided
    isRequired: { type: Boolean, default: undefined },
    isObject: { type: Boolean, default: undefined },
    isDate: { type: Boolean, default: undefined },
    isList: { type: Boolean, default: undefined },
    isIndexed: { type: Boolean, default: undefined },
    isSet: { type: Boolean, default: undefined },
    attributes: {
      type: [this],
      default: undefined,
      required: false,
    },
  },
  { minimize: true }
);

// Define the schema for routes within each schema
const routeSchema = new mongoose.Schema({
  url: { type: String, required: false, default: "" }, // Default empty string
  service_name: { type: String, required: false, default: "" }, // Default empty string
  controller_name: { type: String, required: false, default: "" }, // Default empty string
  isPaginated: { type: Boolean, default: false }, // Default to false
  criterias: [
    {
      targetVar: { type: String, default: "" }, // Default empty string
      operationType: { type: String, default: "" }, // Default empty string
      valueType: { type: String, default: "" }, // Default empty string
      isList: { type: Boolean, default: false }, // Default to false
    },
  ],
});

// Define the schema for relations within each schema
const relationSchema = new mongoose.Schema({
  schema: { type: String, required: false, default: "" }, // Required
  target: { type: String, required: false, default: "" }, // Required
  lazyLoad: { type: Boolean, default: false }, // Default to false
  type: {
    type: String,
    required: true,
    enum: ["OneToOne", "OneToMany", "ManyToMany"], // Only allow specific types
    default: "OneToOne", // Default type
  },
});

// Define the schema for each individual schema
const schemaSchema = new mongoose.Schema({
  schema_name: { type: String, required: false }, // Default empty string
  schema_dbname: { type: String, required: false }, // Default empty string
  attributes: [attributeSchema],
  routes: [routeSchema],
  relation: [relationSchema],
});

// Define the Project schema
const projectSchema = new mongoose.Schema(
  {
    projectName: { type: String, required: false, default: "" }, // Default empty string
    schemas: [schemaSchema],
  },
  { timestamps: true }
);

const Project = mongoose.model("Project", projectSchema);

export default Project;
