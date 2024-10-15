package com.Api_Crafter.Rest_Spring.ServiceGeneration;

import java.util.ArrayList;
import java.util.Collections;
import java.util.LinkedList;
import java.util.List;
import java.util.Map;
import java.util.Queue;

import com.Api_Crafter.Rest_Spring.DTO.Relation;
import com.Api_Crafter.Rest_Spring.DTO.Schema;
import com.Api_Crafter.Rest_Spring.EntitiesGeneration.ServiceController;
import com.Api_Crafter.Rest_Spring.Utils.ImportUtils;

public class FindByIdGeneration implements CrudCommand {
	
	public final ImportUtils importUtils;
	
	public FindByIdGeneration(ImportUtils importUtils) {
		this.importUtils=importUtils;
	}

    @Override
    public ServiceController execute(Map<String, Schema> schemaMap, Schema schema) {

        List<String> saveStrings = new ArrayList<>();
        List<String> findByStrings = new ArrayList<>();
        findByStrings.add(handleOneToOne(schema.getSchema_name(), "id"));

        // Create a queue to traverse the schema relations
        Queue<SchemaLevel> queue = new LinkedList<>();
        queue.add(new SchemaLevel(schema, 0));

        while (!queue.isEmpty()) {
            SchemaLevel temp = queue.poll();
            int level = temp.getLevel();
            Schema currentSchema = temp.getSchmea();
            String lowerCurrentString=currentSchema.getSchema_name().substring(0,1).toLowerCase()+currentSchema.getSchema_name().substring(1);
            importUtils.getServiceAutowire().add(currentSchema.getSchema_name()+"Repository "+currentSchema.getSchema_name().substring(0, 1).toLowerCase() +currentSchema.getSchema_name().substring(1)+"Repository");
            
            // Traverse through each relation in the schema
            for (Relation relation : currentSchema.getRelations()) {
                if (relation.isLazyLoad()) {
                    if (relation.getType().equals("OneToOne")) {
                        findByStrings.add(handleOneToOne(relation.getTarget(),
                                currentSchema.getSchema_name().substring(0,1).toLowerCase()+currentSchema.getSchema_name().substring(1) + ".get" + relation.getTarget() + "Id()"));
                        saveStrings.add("new" + currentSchema.getSchema_name() + ".set" + relation.getTarget() + "(new"
                                + relation.getTarget() + ");\n");

                        // Add related schema to queue for further processing
                        queue.add(new SchemaLevel(schemaMap.get(relation.getTarget()), level + 1));
                    } else {
                        findByStrings.add(handleOneToMany(currentSchema.getSchema_name(), relation.getTarget()));
                        saveStrings.add("new"+currentSchema.getSchema_name()+".set"+relation.getTarget()+"s(new"+relation.getTarget()+"s);\n");
                    }
                }
            }
        }

        // Generate the method body
        String parent = schema.getSchema_name();
        StringBuilder template = new StringBuilder();
        template.append(parent + " get" + parent + "ById(String id){\n");

        // Add all findByStrings and saveStrings to the method
        findByStrings.forEach(template::append);
        Collections.reverse(saveStrings);
        saveStrings.forEach(template::append);

        // Final return statement
        template.append("return new" + parent + ";\n}");

        // Print generated template for verification
       // System.out.println(template);

        String controller=handleController(schema.getSchema_name());
        return new ServiceController(template.toString(),controller); // Return the generated code as a string
    }


 // Method to handle OneToOne relationships
    private String handleOneToOne(String parent, String id) {
        String smallParent = parent.substring(0, 1).toLowerCase() + parent.substring(1);
        StringBuilder template = new StringBuilder();
        template.append(parent + " " + smallParent + " = ");
        template.append(smallParent + "Repository.findById(" + id + ")");
        template.append(".orElseThrow(() -> new RuntimeException(\"" + parent + " not found\"));\n");
        return template.toString();
    }


    // Method to handle OneToMany relationships
    private String handleOneToMany(String parent, String child) {
        String smallChild = child.substring(0, 1).toLowerCase() + child.substring(1);
        String smallParent = parent.substring(0, 1).toLowerCase() + parent.substring(1);

        StringBuilder template = new StringBuilder();

        // Generate code for creating a list of children
        template.append("List<" + child + "> " + smallChild + "s = new ArrayList<>();\n");
        
        // Generate code for looping through parent and fetching child objects
        template.append("for (String it : " + smallParent + ".get" + child + "Ids()) {\n");
        template.append("    new" + smallChild + "s.add(");
        template.append(smallChild + "Repository.findById(it)");
        template.append(".orElseThrow(() -> new RuntimeException(\"" + child + " not found\")));\n");
        template.append("}\n");

        return template.toString();
    }

    
    
    //handle controller
    String handleController(String Entity) {
        String entity = Entity.substring(0, 1).toLowerCase() + Entity.substring(1);
        String entityService = entity + "Service";
        
        String templateString = " @Operation(summary = \"Get " + Entity + " by ID\", description = \"Fetch a specific " + Entity + " by its ID.\")\r\n"
                + "    @ApiResponses(value = {\r\n"
                + "        @ApiResponse(responseCode = \"200\", description = \"" + Entity + " found and returned\"),\r\n"
                + "        @ApiResponse(responseCode = \"404\", description = \"" + Entity + " not found\"),\r\n"
                + "        @ApiResponse(responseCode = \"500\", description = \"Internal server error\")\r\n"
                + "    })\r\n"
                + "    @GetMapping(\"/{id}\")\r\n"
                + "    public ResponseEntity<?> get" + Entity + "ById(@PathVariable(\"id\") String id) {\r\n"
                + "        try {\r\n"
                + "            logger.info(\"Fetching " + entity + " with id: {}\", id);\r\n"
                + "            \r\n"
                + "            // Fetch " + entity + " by ID\r\n"
                + "            " + Entity + " " + entity + " = " + entityService + ".get" + Entity + "ById(id);\r\n"
                + "            \r\n"
                + "            // If " + entity + " is found\r\n"
                + "            if (" + entity + " != null) {\r\n"
                + "                return new ResponseEntity<>(" + entity + ", HttpStatus.OK);\r\n"
                + "            } else {\r\n"
                + "                logger.warn(\"" + Entity + " with id: {} not found\", id);\r\n"
                + "                return new ResponseEntity<>(\"" + Entity + " not found\", HttpStatus.NOT_FOUND);\r\n"
                + "            }\r\n"
                + "            \r\n"
                + "        } catch (Exception e) {\r\n"
                + "            // Log the exception and return a 500 Internal Server Error\r\n"
                + "            logger.error(\"Error fetching " + entity + " with id: {}. Error: {}\", id, e.getMessage());\r\n"
                + "            return new ResponseEntity<>(\"Internal server error\", HttpStatus.INTERNAL_SERVER_ERROR);\r\n"
                + "        }\r\n"
                + "    }";
        
        return templateString;
    }

}
