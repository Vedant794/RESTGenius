package com.Api_Crafter.Rest_Spring.ServiceGeneration;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;

import org.springframework.stereotype.Service;
import org.thymeleaf.context.Context;
import org.thymeleaf.spring6.SpringTemplateEngine;

import com.Api_Crafter.Rest_Spring.DTO.ProjectDetails;
import com.Api_Crafter.Rest_Spring.DTO.Route;
import com.Api_Crafter.Rest_Spring.DTO.Schema;
import com.Api_Crafter.Rest_Spring.EntitiesGeneration.ServiceController;
import com.Api_Crafter.Rest_Spring.Services.Helper;
import com.Api_Crafter.Rest_Spring.Utils.ImportUtils;

@Service
public class CrudCordinator {

	// Injected template engine for rendering Thymeleaf templates
	private final SpringTemplateEngine templateEngine;

	// List of CRUD command generators
	private final List<CrudCommand> crudCommands = new ArrayList<>();

	// Schema mapping
	private final Map<String, Schema> map;

	// Object for handling advanced route generation
	private final AdvanceRoutes advanceRoutes;
	
	ImportUtils importUtils=new ImportUtils();

	public CrudCordinator(SpringTemplateEngine templateEngine, Map<String, Schema> helperMap) {
		this.templateEngine = templateEngine;
		this.map = helperMap;


		crudCommands.add(new SaveGeneration(importUtils));
		crudCommands.add(new FindByIdGeneration(importUtils));
		crudCommands.add(new DeleteGeneration(importUtils));
		crudCommands.add(new UpdateGeneration(importUtils));

		// Initialize advanced route handler
		advanceRoutes = new AdvanceRoutes(templateEngine);
	}

	// Main method to execute CRUD and advanced route generation
	public ServiceController execute(Schema schema) {
		List<String> serviceTemplateList = new ArrayList<>();
		List<String> controllerTemplateList = new ArrayList<>();

		// Loop through all CRUD commands and generate service/controller templates
		for (CrudCommand crudCommand : crudCommands) {
			ServiceController serviceController = crudCommand.execute(map, schema);
			serviceTemplateList.add(serviceController.getService());
			controllerTemplateList.add(serviceController.getController());
		}

		// Handle advanced routes based on the schema's routes
		for (Route route : schema.getRoutes()) {
			serviceTemplateList.add(advanceRoutes.HandleAdvanceRoutes(route, schema.getSchema_name()));
		}

		// Prepare Thymeleaf context for template processing
		Context context = new Context();
		context.setVariable("Entity", schema.getSchema_name());
		context.setVariable("EntityRepository", schema.getSchema_name() + "Repository");
		context.setVariable("entityRepository", schema.getSchema_dbname().toLowerCase() + "Repository");
		context.setVariable("Services", serviceTemplateList);
		context.setVariable("EntityService", schema.getSchema_name() + "Service");
		context.setVariable("entityService", schema.getSchema_name() + "Service");
		context.setVariable("Controllers", controllerTemplateList);
         context.setVariable("controllerImports", importUtils.getControllerImport());
		context.setVariable("ServiceImports", importUtils.getServiceImport());
	context.setVariable("Repositories", importUtils.getServiceAutowire());
	
	
		
		// Render service and controller templates
		String serviceOutput = templateEngine.process("Service.txt", context);
		String controllerOutput = templateEngine.process("Controller.txt", context);

		// Output the generated templates (for debugging or logging)
		//System.out.println(serviceOutput);
	//	System.out.println(controllerOutput);

		ServiceController serviceController=new ServiceController();
		serviceController.setService(serviceOutput);
		serviceController.setController(controllerOutput);
		
		// Return the generated service template (or you can modify this to return both)
		return serviceController;
	}
}
