package com.Api_Crafter.Rest_Spring.EntitiesGeneration;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.HashSet;
import java.util.LinkedList;
import java.util.List;
import java.util.Map;
import java.util.Queue;
import java.util.Set;

import org.apache.catalina.startup.CertificateCreateRule;
import org.springframework.stereotype.Component;
import org.thymeleaf.context.Context;

import com.Api_Crafter.Rest_Spring.DTO.Attribute;

import com.Api_Crafter.Rest_Spring.DTO.EntityDTO;
import com.Api_Crafter.Rest_Spring.DTO.Schema;
import org.thymeleaf.spring6.SpringTemplateEngine;

@Component
public class EntityHandler {
	private final SpringTemplateEngine templateEngine;

	public EntityHandler(SpringTemplateEngine templateEngine) {
		this.templateEngine = templateEngine;
	}

	Map<String, String> map = new HashMap<String, String>();

	public EntityDTO handleEntity(Schema schema) {
		List<DataFields> dataFields = new ArrayList<>();
		Set<String> importSet = new HashSet<>();

		for (Attribute attribute : schema.getAttributes()) {
			DataFields tempDataFields = createDataField(attribute, importSet);
			if (tempDataFields != null) {
				dataFields.add(tempDataFields);
			}
		}

		// Create Thymeleaf context and add variables
		Context context = createContext(schema, dataFields, importSet);

		// Generate the entity code by processing the Thymeleaf template
		String entityCode = templateEngine.process("Schema.txt", context);
		EntityDTO entityDTO = new EntityDTO();
		entityDTO.setEntity_code(entityCode.replace("&lt;", "<").replace("&gt;", ">"));
		return entityDTO;
	}

	private DataFields createDataField(Attribute attribute, Set<String> importSet) {
		StringBuilder annotations = new StringBuilder();
		DataFields tempDataFields = new DataFields();

		// Handle collections like List and Set
		if (attribute.isList()) {
			String tempString = "List<" + attribute.getDb_type() + "> " + attribute.getVar_name();
			tempDataFields.setField(tempString);
			importSet.add("import java.util.List;");
		} else if (attribute.isSet()) {
			String tempString = "Set<" + attribute.getDb_type() + "> " + attribute.getVar_name();
			tempDataFields.setField(tempString);
			importSet.add("import java.util.Set;");
		} else {
			// Handle single value fields
			String tempString = attribute.getDb_type() + " " + attribute.getVar_name();
			tempDataFields.setField(tempString);
		}

		// Add necessary annotations
		addAnnotations(attribute, annotations, importSet);

		
		if(attribute.isObject()) {
			generateObjectFiles(attribute);
		}
		

		tempDataFields.setAnnotation(annotations.toString());
		return tempDataFields;
	}

	private void addAnnotations(Attribute attribute, StringBuilder annotations, Set<String> importSet) {
		if (attribute.isRequired()) {
			annotations.append("@NotNull\n");
			importSet.add("import javax.validation.constraints.NotNull;");
		}
		if (attribute.isIndexed()) {
			annotations.append("@Indexed\n");
			importSet.add("import org.springframework.data.mongodb.core.index.Indexed;");
		}
		if (attribute.isUUID()) {
			annotations.append("@GeneratedValue(strategy = GenerationType.UUID)\n");
			importSet.add("import java.util.UUID;");
		}
		if (attribute.isDate()) {
			importSet.add("import java.util.Date;");
		}
		if (attribute.isObject()) {
			importSet.add("import some.package.for.objects;");
		}

	}

	private Context createContext(Schema schema, List<DataFields> fields, Set<String> imports) {
		Context context = new Context();
		context.setVariable("fields", fields);
		context.setVariable("Entity", schema.getSchema_name());
		context.setVariable("schema_dbname", schema.getSchema_dbname());
		context.setVariable("imports", imports);
		return context;
	}

	// Method to generate code for objects (nested attributes)
	String generateObjectFiles(Attribute attribute) {
	    Queue<Attribute> queue = new LinkedList<>();
	    queue.add(attribute);

	    // Loop through all nested objects using BFS
	    while (!queue.isEmpty()) {
	        Attribute tempAttribute = queue.poll();
	        
	        // If the current attribute is an object and hasn't been generated yet
	        if (tempAttribute.isObject() && !map.containsKey(tempAttribute.getVar_name())) {
	            List<DataFields> dataFields = new ArrayList<>();
	            HashSet<String> importSet = new HashSet<>();

	            // Loop through the attributes of the nested object
	            for (Attribute nestedAttribute : tempAttribute.getAttributes()) {
	                DataFields tempDataFields = createDataField(nestedAttribute, importSet);
	                if (tempDataFields != null) {
	                    dataFields.add(tempDataFields);
	                }
	                
	                // If the nested attribute is also an object, add it to the queue
	                if (nestedAttribute.isObject()) {
	                    queue.add(nestedAttribute);
	                }
	            }

	            // Create a Thymeleaf context for the nested object
	            Context context = new Context();
	            context.setVariable("fields", dataFields);
	            context.setVariable("Entity", tempAttribute.getVar_name());  // Use var_name for the object class name
	            context.setVariable("imports", importSet);

	            // Generate the object code using Thymeleaf
	            String objectCode = templateEngine.process("Object.txt", context);
	            objectCode = objectCode.replace("&lt;", "<").replace("&gt;", ">");

	            // Store the generated object code in the map to avoid duplication
	            map.put(tempAttribute.getVar_name(), objectCode);
	        }
	    }

	    // Return the generated object code (if needed for further processing)
	    return map.get(attribute.getVar_name());
	}

	
	/*
	 * This method here returns the geenrated output files so its best to use it when all the code is generated already 
	 * what i mean is when all entity is generated then call this function its uses a map to avoid generating same files over 
	 * and over again
	 */
	public List<String> getGeneratedObjectFilesAsList() {
	    // Convert the map's values (object files) to a list
	    return new ArrayList<>(map.values());
	}

}
