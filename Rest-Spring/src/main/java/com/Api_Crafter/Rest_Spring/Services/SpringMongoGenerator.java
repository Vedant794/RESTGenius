package com.Api_Crafter.Rest_Spring.Services;

import java.util.ArrayList;
import java.util.List;

import org.springframework.stereotype.Service;
import com.Api_Crafter.Rest_Spring.DTO.EntityDTO;
import com.Api_Crafter.Rest_Spring.DTO.OutputDTO;
import com.Api_Crafter.Rest_Spring.DTO.ProjectDetails;
import com.Api_Crafter.Rest_Spring.DTO.Schema;
import com.Api_Crafter.Rest_Spring.EntitiesGeneration.EntityHandler;
import com.Api_Crafter.Rest_Spring.EntitiesGeneration.GenerateService;
import com.Api_Crafter.Rest_Spring.EntitiesGeneration.RepositoryGenerator;
import com.Api_Crafter.Rest_Spring.EntitiesGeneration.ServiceController;
import com.Api_Crafter.Rest_Spring.Utils.Generator;

import org.thymeleaf.spring6.SpringTemplateEngine;

@Service
public class SpringMongoGenerator implements Generator {
    private final EntityHandler entityHandler;
    private final RepositoryGenerator repositoryGenerator;
    private final GenerateService generateService;
    
    public SpringMongoGenerator(EntityHandler entityHandler,RepositoryGenerator repositoryGenerator,GenerateService generateService) {
        this.entityHandler = entityHandler;
        this.repositoryGenerator=repositoryGenerator;
        this.generateService=generateService;
    }

    @Override
    public OutputDTO generate(ProjectDetails projectDetails) {
        List<String> entityList = new ArrayList<>();
        OutputDTO outputDTO = new OutputDTO();

        EntityDTO entityDTO = entityHandler.handleEntity(projectDetails.getSchemas());
        entityList.add(entityDTO.getEntity_code());
        outputDTO.setEntityFiles(entityList);
      outputDTO.setObjectFile(entityHandler.getGeneratedObjectFilesAsList());
      
      List<String>repoList=new ArrayList<String>();
      repoList.add(repositoryGenerator.handleRepository( projectDetails.getSchemas()));
      outputDTO.setRepoFiles(repoList);
        
    ServiceController serviceController=  generateService.Create(projectDetails.getSchemas());
      List<String>serviceList=new ArrayList<String>();
      serviceList.add(serviceController.getService());
      List<String>controllerList=new ArrayList<String>();
      controllerList.add(serviceController.getController());
      
      outputDTO.setControllerFiles(controllerList);
      outputDTO.setServiceFiles(serviceList);
     
      
        return outputDTO;
    }
}
