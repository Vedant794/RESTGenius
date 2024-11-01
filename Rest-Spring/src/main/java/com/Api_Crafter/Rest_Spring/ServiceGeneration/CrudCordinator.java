package com.Api_Crafter.Rest_Spring.ServiceGeneration;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;

import org.springframework.stereotype.Service;
import org.thymeleaf.context.Context;
import org.thymeleaf.spring6.SpringTemplateEngine;

import com.Api_Crafter.Rest_Spring.DTO.GenerationResult;
import com.Api_Crafter.Rest_Spring.DTO.ProjectDetails;
import com.Api_Crafter.Rest_Spring.DTO.Route;
import com.Api_Crafter.Rest_Spring.DTO.Schema;
import com.Api_Crafter.Rest_Spring.EntitiesGeneration.ServiceController;
import com.Api_Crafter.Rest_Spring.Exception.NoSchemaFoundException;
import com.Api_Crafter.Rest_Spring.Services.Helper;

import com.Api_Crafter.Rest_Spring.Utils.ImportUtils;

public class CrudCordinator {

	// Injected template engine for rendering Thymeleaf templates
	private final SpringTemplateEngine templateEngine;

	// List of CRUD command generators
	private final List<CrudCommand> crudCommands = new ArrayList<>();

	// Schema mapping
	private final Map<String, Schema> map;

	// Object for handling advanced route generation
//	private final AdvanceRoutes advanceRoutes;
	ImportUtils importUtils=new ImportUtils();
	
	private final Map<String, ArrayList<String>>serviceMap;
	
	private final  Map<String, ArrayList<String>>controllerMap;
	
 String	projectName;

	public CrudCordinator(SpringTemplateEngine templateEngine, Map<String, Schema> helperMap,String projectName,
			Map<String, ArrayList<String>>serviceMap,Map<String, ArrayList<String>>controllerMap) {
		this.templateEngine = templateEngine;
		this.map = helperMap;
this.projectName=projectName;
	
		crudCommands.add(new SaveGeneration(importUtils, projectName));
		crudCommands.add(new FindByIdGeneration(importUtils, projectName));
		crudCommands.add(new DeleteGeneration(importUtils, projectName));
		crudCommands.add(new UpdateGeneration(importUtils,projectName));
this.serviceMap=serviceMap;
this.controllerMap=controllerMap;
		// Initialize advanced route handler
	//	advanceRoutes = new AdvanceRoutes(importUtils,projectName);
	}

	// Main method to execute CRUD and advanced route generation
	public List<GenerationResult> execute(Schema schema) throws NoSchemaFoundException {
	
		List<String> serviceTemplateList = new ArrayList<>();
		List<String> controllerTemplateList = new ArrayList<>();
       DTOGenerator dtoGenerator=new DTOGenerator(templateEngine);
		List<GenerationResult>rslt=new ArrayList<GenerationResult>();
		
		// Loop through all CRUD commands and generate service/controller templates
		for (CrudCommand crudCommand : crudCommands) {
	        crudCommand.execute(map, schema).stream().forEach(it->{
	        	if(it.getType().equals("Service_SubPart")) {
	        		serviceTemplateList.add(it.getContent());
	        	}
	        	else if (it.getType().equals("Controller_SubPart")) {
					controllerTemplateList.add(it.getContent());
				}
	        	else {
	        		rslt.add(it);
	        	}
	       
	        });
//			serviceTemplateList.add(serviceController.getService());
//			controllerTemplateList.add(serviceController.getController());
		}

	 	if(schema.getRelations()!=null && !schema.getRelations().isEmpty()) {
    		rslt.add(dtoGenerator.Execute(schema, projectName, map));
    	}
	 	
	 	serviceTemplateList.addAll(serviceMap.getOrDefault(schema.getSchema_name(), new ArrayList<String>()));
	 	controllerTemplateList.addAll(controllerMap.getOrDefault(schema.getSchema_name(),new ArrayList<String>()));
    	
		
	//	 Handle advanced routes based on the schema's routes
//		for (Route route : schema.getRoutes()) {
//			ServiceController serviceController2=advanceRoutes.handleAdvanceRoutes(route, schema.getSchema_name());
//			serviceTemplateList.add(serviceController2.getService());
//			controllerTemplateList.add(serviceController2.getController());
//		}

	 	
		// Prepare Thymeleaf context for template processing
		Context context = new Context();
		context.setVariable("Entity", schema.getSchema_name());
		context.setVariable("EntityRepository", schema.getSchema_name() + "Repository");
		context.setVariable("entityRepository", schema.getSchema_dbname().toLowerCase() + "Repository");
		context.setVariable("Services", serviceTemplateList);
		context.setVariable("EntityService", schema.getSchema_name() + "Service");
		context.setVariable("entityService", Helper.camelCase(schema.getSchema_name())+ "Service");
		context.setVariable("Controllers", controllerTemplateList);
         context.setVariable("controllerImports", importUtils.getControllerImport());
		context.setVariable("ServiceImports", importUtils.getServiceImport());
	context.setVariable("Repositories", importUtils.getServiceAutowire());
	context.setVariable("projectName", projectName);
	
		
		// Render service and controller templates
		String serviceOutput = templateEngine.process("Service.txt", context);
		String controllerOutput = templateEngine.process("Controller.txt", context);
		


		// Output the generated templates (for debugging or logging)
		//System.out.println(serviceOutput);
	//	System.out.println(controllerOutput);

		GenerationResult servicegeneration=new GenerationResult();
		servicegeneration.setContent(serviceOutput);
		servicegeneration.setFilename(schema.getSchema_name()+"Service");
		servicegeneration.setType("Service");

		rslt.add(servicegeneration);
		GenerationResult controllergeneration=new GenerationResult();
		controllergeneration.setContent(controllerOutput);
		controllergeneration.setType("Controller");
		controllergeneration.setFilename(schema.getSchema_name()+"Controller");
		rslt.add(controllergeneration);
		
		
		importUtils.clearAll();
		// Return the generated service template (or you can modify this to return both)
		return rslt;
	}
}
