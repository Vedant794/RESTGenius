package com.Api_Crafter.Rest_Spring.Services;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.springframework.stereotype.Service;
import com.Api_Crafter.Rest_Spring.DTO.EntityDTO;
import com.Api_Crafter.Rest_Spring.DTO.OutputDTO;
import com.Api_Crafter.Rest_Spring.DTO.ProjectDetails;
import com.Api_Crafter.Rest_Spring.DTO.Schema;
import com.Api_Crafter.Rest_Spring.EntitiesGeneration.EntityHandler;

import com.Api_Crafter.Rest_Spring.EntitiesGeneration.RepositoryGenerator;
import com.Api_Crafter.Rest_Spring.EntitiesGeneration.ServiceController;
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

	public SpringMongoGenerator(EntityHandler entityHandler, RepositoryGenerator repositoryGenerator,SpringTemplateEngine templateEngine) {
		this.entityHandler = entityHandler;
		this.repositoryGenerator = repositoryGenerator;
this.templateEngine=templateEngine;
	}

	@Override
	public OutputDTO generate(ProjectDetails projectDetails) {

		// tesing
		Map<String, Schema> schemaMaps = Helper.schemaMap(projectDetails);

		CrudCordinator crudCordinator=new CrudCordinator(templateEngine,schemaMaps,projectDetails.getProjectName());
	
		
		
		

		List<String> entityList = new ArrayList<>();
		OutputDTO outputDTO = new OutputDTO();
		List<String> serviceList = new ArrayList<String>();
		List<String> controllerList = new ArrayList<String>();

		
		for (Schema sc : projectDetails.getSchemas()) {
			EntityDTO entityDTO = entityHandler.handleEntity(sc);
			entityList.add(entityDTO.getEntity_code());
			outputDTO.setEntityFiles(entityList);
			outputDTO.setObjectFile(entityHandler.getGeneratedObjectFilesAsList());

			List<String> repoList = new ArrayList<String>();
			repoList.add(repositoryGenerator.handleRepository(sc));
			outputDTO.setRepoFiles(repoList);

			ServiceController serviceController=crudCordinator.execute(sc);
			serviceList.add(serviceController.getService());
			controllerList.add(serviceController.getController());
			
		}

		outputDTO.setControllerFiles(controllerList);
		outputDTO.setServiceFiles(serviceList);

		return outputDTO;
	}
}
