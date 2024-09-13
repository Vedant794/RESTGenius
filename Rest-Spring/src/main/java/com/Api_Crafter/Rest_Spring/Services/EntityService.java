package com.Api_Crafter.Rest_Spring.Services;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Paths;
import java.util.ArrayList;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.thymeleaf.context.Context;
import org.thymeleaf.spring6.SpringTemplateEngine;

import com.Api_Crafter.Rest_Spring.DTO.Attribute;
import com.Api_Crafter.Rest_Spring.DTO.OutputDTO;
import com.Api_Crafter.Rest_Spring.DTO.Schema;


@Service
public class EntityService {
public  SpringTemplateEngine templateEngine;

    EntityService(SpringTemplateEngine templateEngine) {
        this.templateEngine = templateEngine;
    }
	
	 public OutputDTO generateEntity(Schema schema) {
		 List<String>objectcodeStrings=new ArrayList<String>();
		 for(Attribute attribute:schema.getAttributes()) {
			 if(attribute.hasObjectAttribute()) {
				objectcodeStrings.add( handleObjects(attribute));
			 }
		 }
		 	   
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
	

	 
	 public String handleObjects(Attribute attribute) {
		 Context context=new Context();
		 context.setVariable("name", attribute.getName());
		 context.setVariable("fields", attribute.getObjectAttributes());
		 String templateString="Object.txt";
		return templateEngine.process(templateString, context);
	 }
	
	 
}
