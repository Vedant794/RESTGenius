package com.Api_Crafter.Rest_Spring.EntitiesGeneration;

import java.util.ArrayList;
import java.util.List;

import org.springframework.stereotype.Component;
import org.thymeleaf.context.Context;
import org.thymeleaf.spring6.SpringTemplateEngine;

import com.Api_Crafter.Rest_Spring.DTO.GenerationResult;
import com.Api_Crafter.Rest_Spring.DTO.Schema;

@Component
public class RepositoryGenerator {
	private final SpringTemplateEngine templateEngine;

	public RepositoryGenerator(SpringTemplateEngine templateEngine) {
		this.templateEngine = templateEngine;
	}
	public List<GenerationResult> handleRepository(Schema schema,String projectName) {
	    Context context = new Context();
	    context.setVariable("Entity", schema.getSchema_name());
        context.setVariable("projectName", projectName);
	    
	    
	    String outString = templateEngine.process("repo.txt", context);

	    GenerationResult generationResult = new GenerationResult();
	    generationResult.setFilename(schema.getSchema_name() + "Repository");
	    generationResult.setType("Repository");
	    generationResult.setContent(outString);

	    List<GenerationResult> resultList = new ArrayList<>();
	    resultList.add(generationResult);

	    return resultList;
	}

	
	
}
