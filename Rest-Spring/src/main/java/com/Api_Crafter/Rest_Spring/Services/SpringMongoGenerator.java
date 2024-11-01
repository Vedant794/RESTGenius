package com.Api_Crafter.Rest_Spring.Services;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.springframework.stereotype.Service;

import com.Api_Crafter.Rest_Spring.AdvanceSearch.AdvanceSearch;
import com.Api_Crafter.Rest_Spring.AdvanceSearch.AdvanceSearchDTO;
import com.Api_Crafter.Rest_Spring.AdvanceSearch.ApiService;
import com.Api_Crafter.Rest_Spring.DTO.EntityDTO;
import com.Api_Crafter.Rest_Spring.DTO.GenerationResult;
import com.Api_Crafter.Rest_Spring.DTO.OutputDTO;
import com.Api_Crafter.Rest_Spring.DTO.ProjectDetails;
import com.Api_Crafter.Rest_Spring.DTO.Schema;
import com.Api_Crafter.Rest_Spring.EntitiesGeneration.EntityHandler;

import com.Api_Crafter.Rest_Spring.EntitiesGeneration.RepositoryGenerator;
import com.Api_Crafter.Rest_Spring.EntitiesGeneration.ServiceController;
import com.Api_Crafter.Rest_Spring.Exception.NoSchemaFoundException;
import com.Api_Crafter.Rest_Spring.ServiceGeneration.CrudCordinator;
import com.Api_Crafter.Rest_Spring.ServiceGeneration.DeleteGeneration;
import com.Api_Crafter.Rest_Spring.ServiceGeneration.FindByIdGeneration;
import com.Api_Crafter.Rest_Spring.ServiceGeneration.SaveGeneration;
import com.Api_Crafter.Rest_Spring.Utils.Generator;

import org.thymeleaf.TemplateEngine;
import org.thymeleaf.spring6.SpringTemplateEngine;

@Service
public class SpringMongoGenerator implements Generator {
	private final EntityHandler entityHandler;
	private final RepositoryGenerator repositoryGenerator;
	private final SpringTemplateEngine templateEngine;
 private final ApiService apiService;
	public SpringMongoGenerator(EntityHandler entityHandler, RepositoryGenerator repositoryGenerator,
			SpringTemplateEngine templateEngine,ApiService apiService) {
		this.entityHandler = entityHandler;
		this.repositoryGenerator = repositoryGenerator;
		this.templateEngine = templateEngine;
		this.apiService=apiService;
	}

	@Override
	public OutputDTO generate(ProjectDetails projectDetails) throws NoSchemaFoundException {
		OutputDTO outputDTO = new OutputDTO();
		
		AdvanceSearch advanceSearch=new AdvanceSearch(apiService);
	 List<GenerationResult> advanceRoutes=	advanceSearch.execute(projectDetails);
	 
	 Map<String, ArrayList<String>>serviceMap=new HashMap<String, ArrayList<String>>();
	 Map<String, ArrayList<String>>controllerMap=new HashMap<String, ArrayList<String>>();
	 
	 advanceRoutes.forEach(it -> {
		    if (it.getType().equals("Service_SubPart")) {
		        // Use `getOrDefault` to avoid null pointer exceptions and add to existing list
		        ArrayList<String> services = serviceMap.getOrDefault(it.getFilename(), new ArrayList<>());
		        services.add(it.getContent());
		        serviceMap.put(it.getFilename(), services);
		    } else {
		        ArrayList<String> controllers = controllerMap.getOrDefault(it.getFilename(), new ArrayList<>());
		        controllers.add(it.getContent());
		        controllerMap.put(it.getFilename(), controllers);
		    }
		});
	 

		
		// tesing
		Map<String, Schema> schemaMaps = Helper.schemaMap(projectDetails);

		CrudCordinator crudCordinator = new CrudCordinator(templateEngine, schemaMaps, projectDetails.getProjectName(),
				serviceMap,controllerMap);
		

		EntityHandler entityHandler = new EntityHandler(templateEngine);
		RepositoryGenerator repositoryGenerator=new RepositoryGenerator(templateEngine);
		for (Schema sc : projectDetails.getSchemas()) {
           Helper.setToOutputDTO(repositoryGenerator.handleRepository(sc,projectDetails.getProjectName()), outputDTO);
			Helper.setToOutputDTO(entityHandler.handleEntity(sc,projectDetails.getProjectName()), outputDTO);
			Helper.setToOutputDTO(crudCordinator.execute(sc), outputDTO);

		}
		Helper.setToOutputDTO(entityHandler.getGeneratedObjectFilesAsList(), outputDTO);
	
		return outputDTO;
	}
}
