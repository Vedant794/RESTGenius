import {createProject,updateSchema,deleteSchema,getProjectData,addRouteToSchema, addRelationToSchema, addSchemaToProject} from '../services/mainModelService.js';

// Controller to handle creating a new project
export const createProjects = async (req, res) => {
  try {
    const project = await createProject(req.body);
    res.status(201).json({ success: true, project });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Controller to handle updating a specific schema within a project
export const updateSchemas = async (req, res) => {
  const { projectId, schemaId } = req.params;
  const schemaData = req.body;
  
  try {
    const updatedProject = await updateSchema(projectId, schemaId, schemaData);
    res.status(200).json({ success: true, updatedProject });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Controller to handle deleting a specific schema within a project
export const deleteSchemas = async (req, res) => {
  const { projectId, schemaId } = req.params;
  
  try {
    await deleteSchema(projectId, schemaId);
    res.status(200).json({ success: true, message: 'Schema deleted successfully' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Controller to retrieve project data (all schemas)
export const getProjectDatas = async (req, res) => {
  const { projectId } = req.params;
  
  try {
    const projectData = await getProjectData(projectId);
    res.status(200).json({ success: true, projectData });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const addRoutes = async(req,res)=>{
    const {projectName,schemaName} = req.params;
    const newRoutes=req.body
    try {
        const addRoutes= await addRouteToSchema(projectName,schemaName,newRoutes)
        res.status(200).json({success:true,addRoutes})
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
}

export const addRelations = async(req,res)=>{
    const {projectName,schemaName} = req.params
    const newRelation=req.body
    try {
        const addRelations=await addRelationToSchema(projectName,schemaName,newRelation)
        res.status(200).json({success:true,addRelations})
    } catch (error) {
        res.status(500).json({ success:false, message:error.message })
    }
}

export const addSchemas = async(req,res)=>{
  const {projectName} = req.params
  const newSchema=req.body
  console.log(newSchema)
  try {
      const addSchema=await addSchemaToProject(projectName,newSchema)
      res.status(200).json({success:true,addSchema})
  } catch (error) {
      res.status(500).json({ success:false, message:error.message })
  }
}
