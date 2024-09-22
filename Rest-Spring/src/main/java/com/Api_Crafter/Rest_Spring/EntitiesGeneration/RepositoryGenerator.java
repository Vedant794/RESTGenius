package com.Api_Crafter.Rest_Spring.EntitiesGeneration;

import org.springframework.stereotype.Component;
import org.thymeleaf.context.Context;
import org.thymeleaf.spring6.SpringTemplateEngine;

import com.Api_Crafter.Rest_Spring.DTO.Schema;

@Component
public class RepositoryGenerator {
	private final SpringTemplateEngine templateEngine;

	public RepositoryGenerator(SpringTemplateEngine templateEngine) {
		this.templateEngine = templateEngine;
	}
	
	public String  handleRepository(Schema schema) {
		Context context=new Context();
		context.setVariable("Entity", schema.getSchema_name());
		
		
		return templateEngine.process("repo.txt", context);
	}
	
	
	
}
