import express from 'express'
import {createProjects,updateSchemas,deleteSchemas,getProjectDatas, addRoutes, addRelations} from '../controllers/mainModelController.js'
const routerMain = express.Router();

// POST: Create a new project schema
routerMain.post('/createProject', createProjects);

//POST:Add routes in the Project
routerMain.post('/addRoutes/:projectName/:schemaName',addRoutes)

//Post:Add relations in the Project
routerMain.post('/addRelation/:projectName/:schemaName',addRelations)

// PUT: Update a specific schema in a project
routerMain.put('/updateSchema/:projectId/:schemaId', updateSchemas);

// DELETE: Delete a specific schema in a project
routerMain.delete('/deleteSchema/:projectId/:schemaId', deleteSchemas);

// GET: Retrieve all schemas for a project
routerMain.get('/getProjectData/:projectId', getProjectDatas);

export default routerMain;
