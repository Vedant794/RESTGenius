package com.Api_Crafter.Rest_Spring.Services;

import java.util.HashMap;
import java.util.Iterator;
import java.util.List;
import java.util.Map;

import org.springframework.context.support.StaticApplicationContext;

import com.Api_Crafter.Rest_Spring.DTO.Attribute;
import com.Api_Crafter.Rest_Spring.DTO.File;
import com.Api_Crafter.Rest_Spring.DTO.OutputDTO;
import com.Api_Crafter.Rest_Spring.DTO.ProjectDetails;
import com.Api_Crafter.Rest_Spring.DTO.Schema;
import com.Api_Crafter.Rest_Spring.DTO.GenerationResult;

public class Helper {

	public static Map<String, Schema> schemaMap(ProjectDetails projectDetails) {
		Map<String, Schema> map = new HashMap<>();

		for (Schema sc : projectDetails.getSchemas()) {
			map.put(sc.getSchema_name(), sc);
		}
		return map;
	}

	public static void setToOutputDTO(List<GenerationResult> generationResults, OutputDTO outputDTO) {
	    generationResults.forEach(it -> {
	        String filename = it.getFilename();
	        String content = replaceSpecialCharacters(it.getContent());

	        if (it.getType().equals("Object")) {
	            outputDTO.getObjectFile().add(new File(filename, content));
	        } else if (it.getType().equals("Repository")) {
	            outputDTO.getRepoFiles().add(new File(filename, content));
	        } else if (it.getType().equals("Service")) {
	            outputDTO.getServiceFiles().add(new File(filename, content));
	        } else if (it.getType().equals("Controller")) {
	            outputDTO.getControllerFiles().add(new File(filename, content));
	        } else if (it.getType().equals("Entity")) {
	            outputDTO.getEntityFiles().add(new File(filename, content));
	        }
	    });
	}

	// Method to replace special characters
	private static String replaceSpecialCharacters(String input) {
	    return input.replace("&quot;", "\"")
	                .replace("&lt;", "<")
	                .replace("&gt;", ">")
	                .replace("&amp;", "&"); // Add more replacements as needed
	}


	
	public static String camelCase(String str) {
		return str.substring(0,1).toLowerCase()+str.substring(1);
	}
	
	public static String pascalCase(String str) {
		return str.substring(0,1).toUpperCase()+str.substring(1);
	}
	
}
