package com.Api_Crafter.Rest_Spring.ServiceGeneration;

import java.util.*;

import com.Api_Crafter.Rest_Spring.DTO.Schema;
import com.Api_Crafter.Rest_Spring.EntitiesGeneration.RepositoryGenerator;
import com.Api_Crafter.Rest_Spring.EntitiesGeneration.ServiceController;
import com.Api_Crafter.Rest_Spring.Exception.NoSchemaFoundException;
import com.Api_Crafter.Rest_Spring.Services.Helper;
import com.Api_Crafter.Rest_Spring.Utils.ImportUtils;
import com.Api_Crafter.Rest_Spring.DTO.GenerationResult;
import com.Api_Crafter.Rest_Spring.DTO.Relation;

public class SaveGeneration implements CrudCommand {

	public final ImportUtils importUtils;

String	projectName;
	
	public SaveGeneration(ImportUtils importUtils,String projectName) {
		this.importUtils = importUtils;
		this.projectName=projectName;
	}

	@Override
	public List<GenerationResult> execute(Map<String, Schema> schemaMap, Schema schema) throws NoSchemaFoundException {
 
		List<String>callSet=new ArrayList<>();
		callSet.add(schema.getSchema_name());
		
		
		
		
		// camelcase schema name
		String lowercaseParent =Helper.camelCase(schema.getSchema_name());

		// Initializing the queue for BFS
		Queue<SchemaLevel> queue = new LinkedList<>();
		SchemaLevel schemaLevel = new SchemaLevel(schema, 0);
		queue.add(schemaLevel);

		// Function parameters set
		Set<String> fnParams = new HashSet<>();
		fnParams.add(schema.getSchema_name() + " " + lowercaseParent);

		// Result is stored here
		List<String> saveStrings = new ArrayList<>();

		// Applying BFS
		while (!queue.isEmpty()) {
			SchemaLevel temp = queue.poll();
			
			//adding imports
			importUtils.getServiceImport().add("import "+projectName+".Model."+temp.getSchmea().getSchema_name());
			importUtils.getServiceImport().add("import "+projectName+".Repository."+schema.getSchema_name()+"Repository");
			importUtils.getControllerImport().add("import "+projectName+".Service."+schema.getSchema_name()+"Service");
			importUtils.getControllerImport().add("import "+projectName+".Model."+schema.getSchema_name());
			
			if (temp.getSchmea().getRelations() != null) {
				for (Relation relation : temp.getSchmea().getRelations()) {
					if(schemaMap.get(relation.getTarget())==null)throw new NoSchemaFoundException(relation.getTarget()+" No such schema is defined");
					Schema relatedSchema = schemaMap.get(relation.getTarget());

					importUtils.getServiceImport().add("import "+projectName+".Model."+relation.getTarget());
					importUtils.getServiceImport().add("import "+projectName+".Repository."+relation.getTarget()+"Repository");
					importUtils.getControllerImport().add("import "+projectName+".Model."+relation.getTarget());
				
					
					importUtils.getServiceAutowire()
							.add(relatedSchema.getSchema_name() + "Repository "
									+ Helper.camelCase(relatedSchema.getSchema_name())
									+ "Repository");

					// Adding it to function parameters
					String nameString = relatedSchema.getSchema_name();
					String smallnameString = Helper.camelCase(relatedSchema.getSchema_name());

					// for one to one case
					if (relation.getType().equals("OneToOne")) {
						saveStrings.add(handleOneToOneString(relatedSchema.getSchema_name(),
								temp.getSchmea().getSchema_name()));
						// adding the paremeter --> Entity entity
						fnParams.add(nameString + " " + smallnameString);
						callSet.add(relation.getTarget());
					} else {
						saveStrings.add(
								handleOneToMany(temp.getSchmea().getSchema_name(), relatedSchema.getSchema_name()));
						// adding the parameter --> List<Entity>entitis
						fnParams.add("List<" + nameString + ">" + smallnameString + "s");
						callSet.add(relation.getTarget()+"s");
					}
				
					queue.add(new SchemaLevel(relatedSchema, temp.getLevel() + 1));
				}
			}
		}

		// Building the template string
		StringBuilder template = new StringBuilder();

		// adding-->> Entity saveEntity(
		template.append("public "+schema.getSchema_name()).append(" save").append(schema.getSchema_name()).append("(");

		// parameters set --> Entity entity ,
		fnParams.forEach(it -> template.append(it + ","));
		// removing the extra ,
		template.deleteCharAt(template.length() - 1);
		// line break and start of {
		template.append(") {\n");

		// reversing the strings to get the correct order
		Collections.reverse(saveStrings);

		// appending the collection to ans string
		saveStrings.forEach(it -> template.append(it));

		// adding--> return entityRepository.save(entity); }
		template.append("return ")
				.append(lowercaseParent)
				.append("Repository.save(" + lowercaseParent + ");");
		template.append("\n}");

		// creating the desired controller for the save String
		String controller = handleSaveController(schema.getSchema_name(), fnParams.stream().toList(),callSet);
            controller.replace("&lt;", "<").replace("&gt;", ">");
		
		// replacing the &lt with < and &gt with >
		String serviceString = template.toString();
		serviceString = serviceString.replace("&lt;", "<").replace("&gt;", ">");

		// debuging
		// System.out.println(template);

		
		  List<GenerationResult>rslt=new ArrayList<GenerationResult>();
	        GenerationResult servicegeneration=new GenerationResult();
	        servicegeneration.setContent(template.toString());
	        servicegeneration.setFilename(schema.getSchema_name()+"Service");
	        servicegeneration.setType("Service_SubPart");

	        rslt.add(servicegeneration);
	        GenerationResult controllergeneration=new GenerationResult();
	        controllergeneration.setContent( controller);
	        controllergeneration.setType("Controller_SubPart");
	        controllergeneration.setFilename(schema.getSchema_name()+"Controller");
	        rslt.add(controllergeneration);
		
		
		return rslt;
	}

	// Handling OneToOne relation
	public String handleOneToOneString(String entity, String parent) {
		// Lowercase entity name
		String lowerEntity = Helper.camelCase(entity);
		String smallparent = Helper.camelCase(parent);

		StringBuilder template = new StringBuilder();
		template.append(entity + " new").append(lowerEntity).append(" = ").append(lowerEntity)
				.append("Repository.save(").append(lowerEntity).append(");\n");
		template.append(smallparent).append(".set").append(entity).append("Id(new").append(lowerEntity)
				.append(".getId());\n");

		return template.toString();
	}

	// Handling OneToMany relation
	public String handleOneToMany(String parentEntity, String childEntity) {
		importUtils.getServiceImport().add("import java.util.List;");
		importUtils.getControllerImport().add("import java.util.List;");

		// Lowercase entity names
		String lowerParentEntity = Helper.camelCase(parentEntity);
		String lowerChildEntity = Helper.camelCase(childEntity);

		StringBuilder template = new StringBuilder();

		template.append("List<" + childEntity + ">" + "new" + childEntity + "s=new ArrayList<>();\n");
		// Iterate through the collection of child entities
		template.append("\nfor (").append(childEntity).append(" ").append(lowerChildEntity).append(" : ")
				.append(lowerChildEntity + "s").append(") {\n");

//        // Set the parent reference in each child entity
//        template.append("    ").append(lowerChildEntity).append(".set").append(parentEntity).append("(")
//                .append(lowerParentEntity).append(");\n");

		// Save each child entity
		template.append("    ").append("new" + childEntity + "s" + ".add(").append(lowerChildEntity)
				.append("Repository.save(").append(lowerChildEntity).append("));\n");

		template.append("}\n");

		template.append(lowerParentEntity + ".set" + childEntity + "s" + "(new" + childEntity + "s);");
		return template.toString();
	}

	// Placeholder for ManyToMany relation
	public String handleManyToMany() {
		return null;
	}

	String handleSaveController(String Entity, List<String> params,List<String>calls) {
	    String entity = Helper.camelCase(Entity);
	    String entityService = entity + "Service";

	    StringBuilder templateString = new StringBuilder();

	    // Adding method annotations and basic setup
	    templateString
	            .append(" @Operation(summary = \"Save new " + Entity + "\", description = \"Create a new " + Entity
	                    + " and save it to the database.\")\r\n")
	            .append("    @ApiResponses(value = {\r\n")
	            .append("        @ApiResponse(responseCode = \"201\", description = \"" + Entity
	                    + " successfully created\"),\r\n")
	            .append("        @ApiResponse(responseCode = \"400\", description = \"Invalid input\"),\r\n")
	            .append("        @ApiResponse(responseCode = \"500\", description = \"Internal server error\")\r\n")
	            .append("    })\r\n").append("    @PostMapping\r\n");

	    // Check if params require a DTO
	    if (params.size() > 1) {
	        // More than one parameter, use DTO
	    	
	    	importUtils.getControllerImport().add( ("import "+projectName+".Model.save"+Entity+"DTO"));
	    	
	        templateString
	                .append("    public ResponseEntity<?> save" + Entity + "(@RequestBody Save" + Entity + "DTO save"
	                        + entity + "DTO) {\r\n")
	                .append("        try {\r\n")
	                .append("            logger.info(\"Saving new " + entity + ": {}\", save" + entity + "DTO);\r\n");

	        // Building the service save method call with parameters from DTO
	        templateString.append("            // Save the new entity\r\n")
	                .append("            " + Entity + " savedEntity = " + entityService + ".save"+Entity+"(\r\n");

	        // Append parameters by fetching from DTO
	        for (int i = 0; i < calls.size(); i++) {
	            String param = calls.get(i);
	            templateString.append("                save" + entity + "DTO.get" + capitalize(param) + "()");
	            if (i != calls.size() - 1) {
	                templateString.append(",\r\n");
	            }
	        }

	        templateString.append(");\r\n");

	    } else {
	        // Only one parameter, no need for DTO
	        templateString
	                .append("    public ResponseEntity<?> save" + Entity + "(@RequestBody " + Entity + " " + entity
	                        + ") {\r\n")
	                .append("        try {\r\n")
	                .append("            logger.info(\"Saving new " + entity + ": {}\", " + entity + ");\r\n")
	                .append("            // Save the new entity\r\n")
	                .append("            " + Entity + " savedEntity = " + entityService + ".save"+Entity+"(" + entity + ");\r\n");
	    }

	    // Common response handling logic for both cases
	    templateString.append("            // Return 201 status on successful save\r\n")
	            .append("            return new ResponseEntity<>(savedEntity, HttpStatus.CREATED);\r\n")
	            .append("        } catch (IllegalArgumentException e) {\r\n")
	            .append("            // Log and handle invalid input\r\n")
	            .append("            logger.warn(\"Invalid input: {}\", e.getMessage());\r\n")
	            .append("            return new ResponseEntity<>(\"Invalid input\", HttpStatus.BAD_REQUEST);\r\n")
	            .append("        } catch (Exception e) {\r\n")
	            .append("            // Log the exception and return a 500 Internal Server Error\r\n")
	            .append("            logger.error(\"Error saving new " + entity + ". Error: {}\", e.getMessage());\r\n")
	            .append("            return new ResponseEntity<>(\"Internal server error\", HttpStatus.INTERNAL_SERVER_ERROR);\r\n")
	            .append("        }\r\n").append("    }");

	    return templateString.toString();
	}

	// Helper method to capitalize the first letter of a parameter
	private String capitalize(String param) {
	    return param.substring(0, 1).toUpperCase() + param.substring(1);
	}

	

	

}
