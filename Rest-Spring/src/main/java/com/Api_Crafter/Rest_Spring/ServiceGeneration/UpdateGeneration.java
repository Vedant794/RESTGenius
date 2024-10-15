package com.Api_Crafter.Rest_Spring.ServiceGeneration;

import java.util.Map;

import com.Api_Crafter.Rest_Spring.DTO.Schema;
import com.Api_Crafter.Rest_Spring.EntitiesGeneration.ServiceController;
import com.Api_Crafter.Rest_Spring.Utils.ImportUtils;

public class UpdateGeneration implements CrudCommand {
	
	public final ImportUtils importUtils;
	
	UpdateGeneration(ImportUtils importUtils){
		this.importUtils=importUtils;
	}

    @Override
    public ServiceController execute(Map<String, Schema> schemaMap, Schema schema) {

        String Entity = schema.getSchema_name(); // Entity name (e.g., User)
        String entityString = Entity.substring(0, 1).toLowerCase() + Entity.substring(1); // entity (e.g., user)
        String entityRepository = entityString + "Repository"; // userRepository
        String entityService = entityString + "Service"; // userService
        
        // Service method template
        String serviceTemplate = "public " + Entity + " update" + Entity + "(String id, " + Entity + " new" + Entity + ") {\r\n"
                + "    if (" + entityRepository + ".existsById(id)) {\r\n"
                + "        new" + Entity + ".setId(id);\r\n"
                + "        return " + entityRepository + ".save(new" + Entity + ");\r\n"
                + "    } else {\r\n"
                + "        throw new RuntimeException(\"" + Entity + " not found\");\r\n"
                + "    }\r\n"
                + "}";

        // Controller method template
        String controllerTemplate = "@PutMapping(\"/{id}\")\r\n"
                + "public " + Entity + " update" + Entity + "(@PathVariable String id, @RequestBody " + Entity + " " + entityString + ") {\r\n"
                + "    return " + entityService + ".update" + Entity + "(id, " + entityString + ");\r\n"
                + "}";
        

   
        
        return new ServiceController(serviceTemplate, controllerTemplate);
    }
}
