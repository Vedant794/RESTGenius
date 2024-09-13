package com.Api_Crafter.Rest_Spring.Services;


import java.util.ArrayList;
import java.util.List;

import org.springframework.asm.Handle;

import org.springframework.stereotype.Service;
import org.thymeleaf.context.Context;
import org.thymeleaf.spring6.SpringTemplateEngine;

import com.Api_Crafter.Rest_Spring.DTO.Attribute;
import com.Api_Crafter.Rest_Spring.DTO.ControllerDTO;
import com.Api_Crafter.Rest_Spring.DTO.OutputDTO;
import com.Api_Crafter.Rest_Spring.DTO.ProjectDetails;
import com.Api_Crafter.Rest_Spring.DTO.Schema;
import com.Api_Crafter.Rest_Spring.DTO.ServiceDTO;
import com.Api_Crafter.Rest_Spring.Utils.Generator;


@Service
public class SpringMongoGenerator implements Generator {
	public final SpringTemplateEngine templateEngine;
	
    public SpringMongoGenerator(SpringTemplateEngine templateEngine) {
        this.templateEngine=templateEngine; 
    }
    

    @Override
    public OutputDTO generate(ProjectDetails projectDetails) {
    	Schema schema=projectDetails.getSchemas();
        OutputDTO dto=handleEntity(projectDetails.getSchemas());
        
        List<String>repoList=new ArrayList<String>();
        
     repoList.add( handleRepository(schema));
      dto.setRepoFiles(repoList);  
      
     
      ServiceDTO serviceDTO =new ServiceDTO();
      serviceDTO.setEntity(schema.getName());
      String name = schema.getName();
      String modifiedName = name.substring(0, 1).toLowerCase() + name.substring(1);
      serviceDTO.setEntity_(modifiedName);
      serviceDTO.setEntityRepository(schema.getName()+"Repository");
      serviceDTO.setEntityRepository_(modifiedName + "Repository");
      List<String>servicelist=new ArrayList<String>();
      
      servicelist.add( handleService(serviceDTO));
      dto.setServiceFiles(servicelist);
      
      ControllerDTO controllerDTO=new ControllerDTO();
      controllerDTO.setEntity(schema.getName());
      controllerDTO.setEntity_(modifiedName);
      controllerDTO.setEntityService(schema.getName()+"Service");
      controllerDTO.setEntityService_(modifiedName+"Service");
      
      List<String>controllerList=new ArrayList<String>();
      controllerList.add(handleController(controllerDTO));
      dto.setControllerFiles(controllerList);
        return dto;
    }
    
    public String handleObjects(Attribute attribute) {
        Context context = new Context();
        context.setVariable("name", attribute.getName());
        context.setVariable("fields", attribute.getObjectAttributes());
        String templateString = "Object.txt";
        return templateEngine.process(templateString, context);
    }
    
    public String handleRepository(Schema schema) {
    	   try {
    	       Context context = new Context();
    	       context.setVariable("Package", "Repos");
    	       context.setVariable("Schema_Name", schema.getName());
    	       context.setVariable("Type", "String");
    	       context.setVariable("Artifact", "Willadd");
    	       
    	       return templateEngine.process("repo.txt", context);
    	   } catch (Exception e) {
    	       // Log the error or handle it
    	       e.printStackTrace();
    	       return "";
    	   }
    	}
    
    public OutputDTO handleEntity(Schema schema) {
		 List<String>objectcodeStrings=new ArrayList<String>();
		 //Handle objects
		 for(Attribute attribute:schema.getAttributes()) {
			 if(attribute.hasObjectAttribute()) {
				objectcodeStrings.add( handleObjects(attribute));
			 }
		 }
		 	   //Handle entity generation
	        Context context = new Context();
	        context.setVariable("dbname", schema.getDbname());
	        context.setVariable("name", schema.getName());
	        context.setVariable("fields", schema.getAttributes());

	        String template="Schema.txt";
	     List<String>schemaStrings=new ArrayList<String>();
	    
	     String entity= templateEngine.process(template, context);
	    
	     schemaStrings.add(entity);
	     OutputDTO dto=new OutputDTO();
	     dto.setEntityFiles(schemaStrings);
	     dto.setObjectFile(objectcodeStrings);
	        return dto;
	    }
   
    
   public  String handleService(ServiceDTO serviceDTO) {
	   Context context=new Context();
	   context.setVariable("entity", serviceDTO.getEntity_());
	   context.setVariable("Entity", serviceDTO.getEntity());
	   context.setVariable("EntityRepository", serviceDTO.getEntityRepository());
	   context.setVariable("entityRepository", serviceDTO.getEntityRepository_());
	   return templateEngine.process("Service.txt", context);
   }
   
   public String handleController(ControllerDTO controllerDTO) {
	   Context context=new Context();
	   context.setVariable("Entity", controllerDTO.getEntity());
	   context.setVariable("entity",controllerDTO.getEntity_() );
	   context.setVariable("EntityService", controllerDTO.getEntityService());
	   context.setVariable("entityService", controllerDTO.getEntityService_());
	   context.setVariable("Artifact", "com.example");
	   
return	   templateEngine.process("Controller.txt", context);

   }
    
}
