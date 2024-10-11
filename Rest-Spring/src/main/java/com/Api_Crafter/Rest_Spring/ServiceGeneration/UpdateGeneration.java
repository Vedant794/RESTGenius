package com.Api_Crafter.Rest_Spring.ServiceGeneration;

import java.util.Map;

import com.Api_Crafter.Rest_Spring.DTO.Schema;

public class UpdateGeneration implements CrudCommand {

    @Override
    public String execute(Map<String, Schema> schemaMap, Schema schema) {
     
        String Entity = schema.getSchema_name();
        String entityString = Entity.substring(0, 1).toLowerCase() + Entity.substring(1);
        String entityRepository = entityString + "Repository";
        
       
        String template = "public " + Entity + " update" + Entity + "(String id, " + Entity + " new" + Entity + ") {\r\n"
                + "    if (" + entityRepository + ".existsById(id)) {\r\n"
                + "        new" + Entity + ".setId(id);\r\n"
                + "        return " + entityRepository + ".save(new" + Entity + ");\r\n"
                + "    } else {\r\n"
                + "        throw new RuntimeException(\"" + Entity + " not found\");\r\n"
                + "    }\r\n"
                + "}";

        return template;  
    }
}
