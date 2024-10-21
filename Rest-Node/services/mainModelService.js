import Project from "../model/mainModel.js";

// Service to create a new project
export const createProject = async (projectData) => {
  try {
    const project = new Project(projectData);
    const savedProject = await project.save();
    return savedProject;
  } catch (error) {
    throw new Error(`Failed to create project: ${error.message}`);
  }
};

// Service to find a project by projectName
const findProjectByName = async (projectName) => {
  const project = await Project.findOne({ projectName });
  if (!project) {
    throw new Error('Project not found');
  }
  return project;
};

// Service to update a schema in an existing project
export const updateSchema = async (projectName, schemaName, schemaData) => {
  const project = await findProjectByName(projectName);

  // Check if schemas exist
  if (!project.schemas || !Array.isArray(project.schemas)) {
    throw new Error('No schemas found for this project');
  }

  const schemaIndex = project.schemas.findIndex(schema => schema.schema_name === schemaName);

  if (schemaIndex !== -1) {
    project.schemas[schemaIndex] = { ...project.schemas[schemaIndex].toObject(), ...schemaData };
    return await project.save();
  } else {
    throw new Error('Schema not found');
  }
};

// Service to delete a schema in an existing project
export const deleteSchema = async (projectName, schemaName) => {
  const project = await findProjectByName(projectName);

  // Check if schemas exist
  if (!project.schemas || !Array.isArray(project.schemas)) {
    throw new Error('No schemas found for this project');
  }

  const schemaIndex = project.schemas.findIndex(schema => schema.schema_name === schemaName);

  if (schemaIndex !== -1) {
    project.schemas.splice(schemaIndex, 1); // Remove the schema
    return await project.save();
  } else {
    throw new Error('Schema not found');
  }
};

// Service to get project data (all schemas) by projectName
export const getProjectData = async (projectName) => {
  const project = await findProjectByName(projectName);
  
  // Ensure schemas are available
  if (!project.schemas || !Array.isArray(project.schemas)) {
    return { ...project.toObject(), schemas: [] }; // Return project with empty schemas array
  }

  return project;
};



export const addRouteToSchema = async (projectName, schemaName, newRoute) => {
    const project = await findProjectByName(projectName);
    if (!project.schemas || !Array.isArray(project.schemas)) {
      throw new Error('No schemas found for this project');
    }
  
    const schemaIndex = project.schemas.findIndex(schema => schema.schema_name === schemaName);
    
    if (schemaIndex === -1) {
      throw new Error(`Schema with name ${schemaName} not found.`);
    }
    
    project.schemas[schemaIndex].routes.push(newRoute);
    const updatedProject = await project.save();
    
    console.log(`Route added successfully to ${schemaName}:`, newRoute);
    return updatedProject;
  };

  export const addRelationToSchema = async (projectName, schemaName, newRelation) => {
    const project = await findProjectByName(projectName);
    if (!project.schemas || !Array.isArray(project.schemas)) {
      throw new Error('No schemas found for this project');
    }
  
    const schemaIndex = project.schemas.findIndex(schema => schema.schema_name === schemaName);
    
    if (schemaIndex === -1) {
      throw new Error(`Schema with name ${schemaName} not found.`);
    }
    
    project.schemas[schemaIndex].relations.push(newRelation);
    const updatedProject = await project.save();
    
    console.log(`Route added successfully to ${schemaName}:`, newRelation);
    return updatedProject;
  }

  export const addSchemaToProject = async (projectName,newSchema) =>{
    const project = await findProjectByName(projectName);
    if (!project) {
      throw new Error(`Project with name '${projectName}' not found`);
    }
    project.schemas.push(newSchema);
    const updatedProject = await project.save()
    console.log(`Schema is added in ${projectName}:`,newSchema);
    return updatedProject
  }
  