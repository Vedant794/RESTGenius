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

    if(newRoute.routes && newRoute.routes.length>0){
      newRoute.routes.forEach(routes=>{
        project.schemas[schemaIndex].routes.push(routes)
      })
    } else {
      throw new Error('No Routes found in request data.');
    }
    const updatedProject = await project.save();
    
    console.log(`Route added successfully to ${schemaName}:`, newRoute);
    return updatedProject;
  };

  export const addRelationToSchema = async (projectName, schemaName, newRelationData) => {
    const project = await findProjectByName(projectName);
    
    if (!project.schemas || !Array.isArray(project.schemas)) {
      throw new Error('No schemas found for this project');
    }
    
    const schemaIndex = project.schemas.findIndex(schema => schema.schema_name === schemaName);
    
    if (schemaIndex === -1) {
      throw new Error(`Schema with name ${schemaName} not found.`);
    }
    console.log(newRelationData)
    if (newRelationData.relation && newRelationData.relation.length > 0) {
      newRelationData.relation.forEach(relation => {
        project.schemas[schemaIndex].relation.push(relation);
      });
    } else {
      throw new Error('No Relations found in request data.');
    }
  
    // Save the updated project
    const updatedProject = await project.save({ runValidators: true });
    
    console.log(`Relations added successfully to ${schemaName}:`, newRelationData.relation);
    return updatedProject;
  };
  

  export const addSchemaToProject = async (projectName, newSchemaData) => {
    const project = await findProjectByName(projectName);
    if (!project) {
      throw new Error(`Project with name '${projectName}' not found`);
    }
  
    // Check if 'schemas' array exists in newSchemaData and contains at least one schema
    if (newSchemaData.schemas && newSchemaData.schemas.length > 0) {
      // Push each schema in 'schemas' array to the project.schemas array
      newSchemaData.schemas.forEach(schema => {
        project.schemas.push(schema);
      });
    } else {
      throw new Error('No schemas found in request data.');
    }
  
    // Save the updated project with the new schema(s)
    const updatedProject = await project.save({ runValidators: true });
    console.log(`Schema is added in ${projectName}:`, newSchemaData.schemas);
    return updatedProject;
  };
  
  