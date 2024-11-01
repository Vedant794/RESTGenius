package com.Api_Crafter.Rest_Spring.ServiceGeneration;

import java.util.ArrayList;
import java.util.LinkedList;
import java.util.List;
import java.util.Map;
import java.util.Queue;
import java.util.Set;
import java.util.stream.Collectors;

import org.thymeleaf.spring6.SpringTemplateEngine;

import com.Api_Crafter.Rest_Spring.DTO.GenerationResult;
import com.Api_Crafter.Rest_Spring.DTO.Relation;
import com.Api_Crafter.Rest_Spring.DTO.Schema;
import com.Api_Crafter.Rest_Spring.Services.Helper;
import org.thymeleaf.context.Context;



public class DTOGenerator {
	
	SpringTemplateEngine templateEngine;
	
	public DTOGenerator(SpringTemplateEngine templateEngine) {
		this.templateEngine=templateEngine;
	}

	GenerationResult Execute(Schema schema,String projectName,Map<String, Schema>schemaMap) {
		List<String>fields=new ArrayList<String>();
		List<String>imports=new ArrayList<String>();
		
		  fields.add(Helper.pascalCase(schema.getSchema_name()) + " " + Helper.camelCase(schema.getSchema_name()));
          imports.add("import " + projectName + ".Model." + Helper.pascalCase(schema.getSchema_name()));
		
		Queue<Schema>queue=new LinkedList<Schema>();
		queue.add(schema);
		
		while (!queue.isEmpty()) {
		    Schema curSchema = queue.poll();
		    
		    // Corrected to use `curSchema` instead of `schema`
		    if (curSchema.getRelations() != null) {
		        for (Relation relation : curSchema.getRelations()) {
		            if (relation.getType().equals("OneToOne")) {
		                fields.add(Helper.pascalCase(relation.getTarget()) + " " + Helper.camelCase(relation.getTarget()));
		                imports.add("import " + projectName + ".Model." + Helper.pascalCase(relation.getTarget()));
		                queue.add(schemaMap.get(relation.getTarget()));
		            } else if (relation.getType().equals("OneToMany")) {
		                fields.add("List<" + Helper.pascalCase(relation.getTarget()) + "> " + Helper.camelCase(relation.getTarget())+"s");
		                imports.add("import " + projectName + ".Model." + Helper.pascalCase(relation.getTarget()));
		                queue.add(schemaMap.get(relation.getTarget()));
		            }
		        }
		    }
		}

		
		
		
	Context context=new org.thymeleaf.context.Context();
     context.setVariable("projectName", projectName);
     context.setVariable("fields", fields);
    context.setVariable("Entity", schema.getSchema_name());
    context.setVariable("imports", imports);
    
    
String dto=	templateEngine.process("DTO.txt", context);
	
	GenerationResult generationResult=new GenerationResult();
	generationResult.setContent(dto);
	generationResult.setFilename("Save"+Helper.pascalCase(schema.getSchema_name())+"DTO");
	generationResult.setType("Object");
		
		return generationResult;
	}
	
}
