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

public class DeleteGeneration implements CrudCommand {
	
	public final ImportUtils importUtils;
	String projectName;
	public DeleteGeneration(ImportUtils importUtils,String projectName) {
	this.importUtils=importUtils;
	this.projectName=projectName;
	}

    @Override
    public ServiceController execute(Map<String, Schema> schemaMap, Schema schema) {

        // Separating the concerns
        List<String> deleteStatements = new ArrayList<>();
        List<String> fetchStatements = new ArrayList<>();
        
        importUtils.getServiceAutowire().add(schema.getSchema_name()+"Repository "+schema.getSchema_name().substring(0, 1).toLowerCase() + schema.getSchema_name().substring(1)+"Repository");

        importUtils.getServiceImport().add("import "+projectName+".Entity."+schema.getSchema_name());
		importUtils.getServiceImport().add("import "+projectName+".Repositories."+schema.getSchema_name()+"Repository");

        // Fetching the root entity
        fetchStatements.add(schema.getSchema_name()+" "+schema.getSchema_name().substring(0, 1).toLowerCase() + schema.getSchema_name().substring(1)+"="+schema.getSchema_name().substring(0, 1).toLowerCase() + schema.getSchema_name().substring(1) + "Repository.findById(id).orElseThrow(() -> new RuntimeException(\"" 
                            + schema.getSchema_name() + " not found\"));\n");

        // Creating a queue for schema level traversal
        Queue<SchemaLevel> queue = new LinkedList<>();
        queue.add(new SchemaLevel(schema, 0));

        // Traversing relationships in the schema
        while (!queue.isEmpty()) {
            SchemaLevel temp = queue.poll();
            importUtils.getServiceImport().add("import "+projectName+".Entity."+temp.getSchmea().getSchema_name());
			importUtils.getServiceImport().add("import "+projectName+".Repositories."+schema.getSchema_name()+"Repository");

            
            Schema currentSchema = temp.getSchmea();
            importUtils.getServiceAutowire().add(currentSchema.getSchema_name()+"Repository "+currentSchema.getSchema_name().substring(0, 1).toLowerCase() +currentSchema.getSchema_name().substring(1)+"Repository");
            
            for (Relation relation : currentSchema.getRelations()) {
				importUtils.getServiceImport().add("import "+projectName+".Entity."+relation.getTarget());
				importUtils.getServiceImport().add("import "+projectName+".Repositories."+relation.getTarget()+"Repository");
            	
                if (relation.getType().equals("OneToOne")) {
                    fetchStatements.add(handleOneToOne(currentSchema.getSchema_name(), relation.getTarget()));
                    deleteStatements.add(relation.getTarget().substring(0,1).toLowerCase()+relation.getTarget().substring(1)+"Repository.deleteById(" 
                                         + currentSchema.getSchema_name().substring(0,1).toLowerCase()+currentSchema.getSchema_name().substring(1) + ".get" 
                                         + relation.getTarget() + "Id());\n");
                } else if (relation.getType().equals("OneToMany")) {
                    fetchStatements.add(handleOneToMany(currentSchema.getSchema_name(), relation.getTarget()));
                    deleteStatements.add("if(!"+relation.getTarget().toLowerCase()+"List.isEmpty()){\n"+
                    		relation.getTarget().toLowerCase()+"Repository.deleteManyIds(student.get"+relation.getTarget()+"Ids())\n}\n");
                    

                }
                queue.add(new SchemaLevel(schemaMap.get(relation.getTarget()), temp.getLevel() + 1));
            }
        }

        
        // Building the final method for deleting
        StringBuilder template = new StringBuilder();
        String parent = schema.getSchema_name();
        template.append("public void delete" + parent + "ById(String id) {\n");
        
        // Add fetch statements
        fetchStatements.forEach(template::append);
        
       
        // Add delete statements
        deleteStatements.forEach(template::append);
        template.append("\n");
        template.append(schema.getSchema_name().substring(0, 1).toLowerCase() + schema.getSchema_name().substring(1)+"Repository.deleteById(id);\n");
        template.append("}");
        
        // Output the generated method for verification
       System.out.println(template);
String controllerString=handleDeleteController(schema.getSchema_name());
        return new ServiceController(template.toString(),controllerString);
    }

    // Method to handle OneToOne relationships
    String handleOneToOne(String parent, String child) {
    	String smallchild=child.substring(0,1).toLowerCase()+child.substring(1);
    	String smallparent=parent.substring(0,1).toLowerCase()+parent.substring(1);
    	
        StringBuilder template = new StringBuilder();
        template.append(child +" "+smallchild+"="+ smallchild + "Repository.findById(" + smallparent + ".get" + child + "Id())");
        template.append(".orElseThrow(() -> new RuntimeException(\"" + child + " not found\"));\n");
        return template.toString();
    }

    // Method to handle OneToMany relationships
    String handleOneToMany(String parent, String child) {
    	importUtils.getServiceImport().add("import java.util.List;");
        StringBuilder template = new StringBuilder();
        String smallchild = child.substring(0, 1).toLowerCase() + child.substring(1);

        // Generating code to fetch the list of child entities
        template.append("List<" + child + "> " + child.toLowerCase() + "List = Optional.ofNullable(" 
                       + parent.toLowerCase() + ".get" + child + "Ids())\n");
        template.append("    .orElse(Collections.emptyList())\n");
        template.append("    .stream()\n");
        template.append("    .map(childId -> " + smallchild + "Repository.findById(childId)\n");
        template.append("    .orElseThrow(() -> new RuntimeException(\"" + child + " not found\")))\n");
        template.append("    .collect(Collectors.toList());\n");

        return template.toString();
    }


    
    String handleDeleteController(String Entity) {
        String entity = Entity.substring(0, 1).toLowerCase() + Entity.substring(1);
        String entityService = entity + "Service";

        String templateString = " @Operation(summary = \"Delete " + Entity + " by ID\", description = \"Delete a specific " + Entity + " by its ID.\")\r\n"
                + "    @ApiResponses(value = {\r\n"
                + "        @ApiResponse(responseCode = \"200\", description = \"" + Entity + " successfully deleted\"),\r\n"
                + "        @ApiResponse(responseCode = \"404\", description = \"" + Entity + " not found\"),\r\n"
                + "        @ApiResponse(responseCode = \"500\", description = \"Internal server error\")\r\n"
                + "    })\r\n"
                + "    @DeleteMapping(\"/{id}\")\r\n"
                + "    public ResponseEntity<?> delete" + Entity + "ById(@PathVariable(\"id\") String id) {\r\n"
                + "        try {\r\n"
                + "            logger.info(\"Deleting " + entity + " with id: {}\", id);\r\n"
                + "            \r\n"
                + "            // Attempt to delete the entity directly\r\n"
                + "            " + entityService + ".deleteById(id);\r\n"
                + "            logger.info(\"" + Entity + " with id: {} successfully deleted\", id);\r\n"
                + "            return new ResponseEntity<>(\"" + Entity + " successfully deleted\", HttpStatus.OK);\r\n"
                + "        } catch (NoSuchElementException e) {\r\n"
                + "            // Handle case where entity does not exist\r\n"
                + "            logger.warn(\"" + Entity + " with id: {} not found\", id);\r\n"
                + "            return new ResponseEntity<>(\"" + Entity + " not found\", HttpStatus.NOT_FOUND);\r\n"
                + "        } catch (Exception e) {\r\n"
                + "            // Log the exception and return a 500 Internal Server Error\r\n"
                + "            logger.error(\"Error deleting " + entity + " with id: {}. Error: {}\", id, e.getMessage());\r\n"
                + "            return new ResponseEntity<>(\"Internal server error\", HttpStatus.INTERNAL_SERVER_ERROR);\r\n"
                + "        }\r\n"
                + "    }";

        return templateString;
    }


    
}
