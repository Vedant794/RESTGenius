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
import com.Api_Crafter.Rest_Spring.DTO.File;
import com.Api_Crafter.Rest_Spring.DTO.GenerationResult;
import com.Api_Crafter.Rest_Spring.DTO.Relation;
import com.Api_Crafter.Rest_Spring.DTO.Schema;
import com.Api_Crafter.Rest_Spring.Services.Helper;

import org.thymeleaf.spring6.SpringTemplateEngine;

@Component
public class EntityHandler {
	private final SpringTemplateEngine templateEngine;

	public EntityHandler(SpringTemplateEngine templateEngine) {
		this.templateEngine = templateEngine;

	}

	// map to avoid generating object files again and again
	Map<String, String> map = new HashMap<String, String>();

	// set of imports that needed to be added
	

	public List<GenerationResult> handleEntity(Schema schema, String ProjectName) {
		Set<String> importSet = new HashSet<>();
		// list of data field
		List<DataFields> dataFields = new ArrayList<>();

		for (Attribute attribute : schema.getAttributes()) {
			DataFields tempDataFields = createDataField(attribute, importSet, ProjectName);
			if (tempDataFields != null) {
				dataFields.add(tempDataFields);
			}
		}

		relationhandler(schema, ProjectName,importSet).forEach(it -> dataFields.add(it));

		// Create Thymeleaf context and add variables
		Context context = createContext(schema, dataFields, importSet, ProjectName);

		// Generate the entity code by processing the Thymeleaf template
		String entityCode = templateEngine.process("Schema.txt", context);
		EntityDTO entityDTO = new EntityDTO();
		entityDTO.setEntity_code(entityCode.replace("&lt;", "<").replace("&gt;", ">"));

		GenerationResult generationResult = new GenerationResult();
		generationResult.setContent(entityCode);
		generationResult.setFilename(schema.getSchema_name());
		generationResult.setType("Entity");

		List<GenerationResult> rslt = new ArrayList<GenerationResult>();
		rslt.add(generationResult);
		return rslt;
	}

	private DataFields createDataField(Attribute attribute, Set<String> importSet, String projectName) {
		StringBuilder annotations = new StringBuilder();
		DataFields tempDataFields = new DataFields();

		
		
		if (attribute.isObject()) {
			String uppercase_Var=attribute.getVar_name().substring(0,1).toUpperCase()+attribute.getVar_name().substring(1);
			importSet.add("import " + projectName + "." + uppercase_Var);
			generateObjectFiles(attribute, projectName);
			
			if(attribute.isList()) {
				String tempString = "List<" + uppercase_Var + "> " + attribute.getVar_name();
				tempDataFields.setField(tempString);
				importSet.add("import java.util.List");
			}
			else if (attribute.isSet()) {
				String tempString = "Set<" + uppercase_Var + "> " + attribute.getVar_name();
				tempDataFields.setField(tempString);
				importSet.add("import java.util.Set");
			}
			else {
				String tempString = uppercase_Var + " " + attribute.getVar_name();
				tempDataFields.setField(tempString);
			}
			
		}
		
		
		else {

		if (attribute.isList()) {
			String tempString = "List<" + attribute.getDb_type() + "> " + attribute.getVar_name();
			tempDataFields.setField(tempString);
			importSet.add("import java.util.List");
		} else if (attribute.isSet()) {
			String tempString = "Set<" + attribute.getDb_type() + "> " + attribute.getVar_name();
			tempDataFields.setField(tempString);
			importSet.add("import java.util.Set");
		} else {
			// Handle single value fields
			String tempString = attribute.getDb_type() + " " + attribute.getVar_name();
			tempDataFields.setField(tempString);
		}
		}
		// Add necessary annotations
		addAnnotations(attribute, annotations, importSet, projectName);

		String annotationsString = annotations.toString();

		// Remove the last character if it's a newline
		if (annotationsString.endsWith("\n")) {
		    annotationsString = annotationsString.substring(0, annotationsString.length() - 1);
		}

		tempDataFields.setAnnotation(annotationsString);

		return tempDataFields;
	}

	private void addAnnotations(Attribute attribute, StringBuilder annotations, Set<String> importSet,
			String projectName) {
		if (attribute.isRequired()) {
			annotations.append("@NotNull\n");
			
			importSet.add("import javax.validation.constraints.NotNull");
		}
		if (attribute.isIndexed()) {
			annotations.append("@Indexed\n");
			importSet.add("import org.springframework.data.mongodb.core.index.Indexed");
		}
		if (attribute.isUUID()) {
			annotations.append("@GeneratedValue(strategy = GenerationType.UUID)");
			importSet.add("import java.util.UUID");
		}
		if (attribute.isDate()) {
			importSet.add("import java.util.Date");
		}
		if (attribute.isObject()) {
			
			importSet.add("import " + projectName + "." + Helper.pascalCase(attribute.getVar_name()));
		}

	}

	
	/*
	 * This is the method that creates context
	 * 
	 */
	private Context createContext(Schema schema, List<DataFields> fields, Set<String> imports, String projectName) {
		Context context = new Context();
		context.setVariable("fields", fields);
		context.setVariable("Entity", schema.getSchema_name());
		context.setVariable("projectName", projectName);
		context.setVariable("schema_dbname", schema.getSchema_dbname());
		context.setVariable("imports", imports);
		return context;
	}

	/*
	 * 
	 * Method that generated object files 
	 */
	String generateObjectFiles(Attribute attribute, String projectName) {
		Queue<Attribute> queue = new LinkedList<>();
		queue.add(attribute);

		// Loop through all nested objects using BFS
		while (!queue.isEmpty()) {
			Attribute tempAttribute = queue.poll();

			// If the current attribute is an object and hasn't been generated yet
			if (tempAttribute.isObject() && !map.containsKey ( Helper.pascalCase(tempAttribute.getVar_name()))) {
				List<DataFields> dataFields = new ArrayList<>();
				HashSet<String> importSet = new HashSet<>();

				// Loop through the attributes of the nested object
				for (Attribute nestedAttribute : tempAttribute.getAttributes()) {
					DataFields tempDataFields = createDataField(nestedAttribute, importSet, projectName);
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
				context.setVariable("Entity",Helper.pascalCase( tempAttribute.getVar_name())); // Use var_name for the object class name
				context.setVariable("imports", importSet);
				context.setVariable("projectName", projectName);
				// Generate the object code using Thymeleaf
				String objectCode = templateEngine.process("Object.txt", context);
				objectCode = objectCode.replace("&lt;", "<").replace("&gt;", ">");

				// Store the generated object code in the map to avoid duplication
				map.put(  Helper.pascalCase( tempAttribute.getVar_name()), objectCode);
			}
		}

		// Return the generated object code (if needed for further processing)
		return map.get(attribute.getVar_name());
	}

	/*
	 * This method here returns the genrated output files so its best to use it when
	 * all the code is generated already what i mean is when all entity is generated
	 * then call this function its uses a map to avoid generating same files over
	 * and over again
	 */
	public List<GenerationResult> getGeneratedObjectFilesAsList() {
		List<GenerationResult> rslt = new ArrayList<>();

		map.forEach((key, value) -> {
			GenerationResult generationResult = new GenerationResult();
			generationResult.setType("Object");
			generationResult.setFilename(key);
			generationResult.setContent(value);
			rslt.add(generationResult);
		});

		// map.forEach((key,value)->System.out.println(key+"->>"+value));

		return rslt;
	}

	/*
	 * This method is to add data fields when mapping is introduced
	 * 
	 * 
	 */
	public List<DataFields> relationhandler(Schema schema, String projectName,Set<String> importSet ) {

		List<DataFields> datafields = new ArrayList<DataFields>();

		for (Relation relation : schema.getRelations()) {
			StringBuilder field = new StringBuilder();
			StringBuilder annotation = new StringBuilder();

			// importing @ transient
			importSet.add("import org.springframework.data.annotation.Transient\r\n");
			// importing the eg :- com.example.ChildEntity
			importSet.add("import " + projectName + "." + relation.getTarget());

			if (relation.getType().equals("OneToOne") && relation.isLazyLoad()) {
				annotation.append("@Transient");
				field.append(relation.getTarget() + " " + Helper.camelCase(relation.getTarget()));
				datafields.add(new DataFields(field.toString(), annotation.toString()));

				// For ID field
				field = new StringBuilder();
				annotation = new StringBuilder();
				annotation.append("@Name = \"" + relation.getTarget() + "Id\"");
				field.append("String " + Helper.camelCase(relation.getTarget()) + "Id");
				datafields.add(new DataFields(field.toString(), annotation.toString()));

			} else if (relation.getType().equals("OneToMany") && relation.isLazyLoad()) {

				// import List
				importSet.add("import java.util.List\r\n" + "");

				// For List<relation.getTarget>
				annotation.append("@Transient");
				field.append("List<" + relation.getTarget() + "> " + Helper.camelCase(relation.getTarget()) + "s");
				datafields.add(new DataFields(field.toString(), annotation.toString()));

				// For List<String> of IDs
				field = new StringBuilder();
				annotation = new StringBuilder();
				annotation.append("@Name = \"" + relation.getTarget() + "Ids\"");
				field.append("List<String> " + Helper.camelCase(relation.getTarget()) + "Ids");
				datafields.add(new DataFields(field.toString(), annotation.toString()));
			}

			// Similar handling for ManyToMany if needed
			else if (relation.getType().equals("ManyToMany") && relation.isLazyLoad()) {
				// For List<relation.getTarget> for ManyToMany
				annotation.append("@Transient");
				field.append("List<" + relation.getTarget() + "> " + Helper.camelCase(relation.getTarget()) + "s");
				datafields.add(new DataFields(field.toString(), annotation.toString()));

				// For List<String> of IDs for ManyToMany
				field = new StringBuilder();
				annotation = new StringBuilder();
				annotation.append("@Name = \"" + relation.getTarget() + "Ids\"");
				field.append("List<String> " + Helper.camelCase(relation.getTarget()) + "Ids");
				datafields.add(new DataFields(field.toString(), annotation.toString()));
			}
		}

		return datafields;
	}

}
