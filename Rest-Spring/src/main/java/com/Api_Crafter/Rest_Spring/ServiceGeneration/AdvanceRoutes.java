package com.Api_Crafter.Rest_Spring.ServiceGeneration;

import java.util.ArrayList;
import java.util.HashSet;
import java.util.List;
import java.util.Set;

import org.springframework.stereotype.Component;
import org.thymeleaf.spring6.SpringTemplateEngine;
import com.Api_Crafter.Rest_Spring.DTO.Criteria;
import com.Api_Crafter.Rest_Spring.DTO.GenerationResult;
import com.Api_Crafter.Rest_Spring.DTO.Route;
import com.Api_Crafter.Rest_Spring.EntitiesGeneration.ServiceController;
import com.Api_Crafter.Rest_Spring.Services.Helper;
import com.Api_Crafter.Rest_Spring.Utils.ImportUtils;

import lombok.extern.slf4j.Slf4j;

@Slf4j 
public class AdvanceRoutes {

    public final ImportUtils importUtils;
    String projectName;

    public AdvanceRoutes(ImportUtils importUtils, String projectName) {
        this.projectName = projectName;
        this.importUtils = importUtils;
    }

    public ServiceController handleAdvanceRoutes(Route route, String schemaName) {
        importUtils.getServiceAutowire().add("MongoTemplate mongoTemplate");
//imp imports
        importHelper();
        
        List<String> param = new ArrayList<>();
        StringBuilder queryString = new StringBuilder();
        StringBuilder values = new StringBuilder();

        // Generate query conditions based on Criteria
        for (Criteria it : route.getCriterias()) {
            String fieldName = it.getTargetVar();
            String valueType = it.getValueType();
            String operationType = it.getOperationType();

            switch (operationType) {
                case "EXACT_MATCH":
                    generateExactMatchQuery(queryString, param, fieldName, valueType);
                    break;
                case "REGEX":
                    generateRegexQuery(queryString, param, fieldName, valueType);
                    break;
                case "FULL_TEXT":
                    generateFullTextQuery(queryString, param, fieldName, valueType);
                    break;
                case "LESS_THAN":
                    generateLessThanQuery(queryString, param, fieldName, valueType);
                    break;
                case "GREATER_THAN":
                    generateGreaterThanQuery(queryString, param, fieldName, valueType);
                    break;
                case "BETWEEN":
                    generateBetweenQuery(queryString, param, fieldName, valueType);
                    break;
                default:
                    throw new IllegalArgumentException("Invalid search operation: " + operationType);
            }
            queryString.append("}\n");
            values.append(", ").append(valueType).append(" ").append(fieldName);
        }

        String serviceString = buildServiceMethod(schemaName, route.getService_name(), param, queryString);
        logGeneratedServiceDetails(serviceString, param);
        
        ServiceController serviceController=new ServiceController();
        serviceController.setService(serviceString);
        serviceController.setController(handleController(param, schemaName, route));
        
        return serviceController;
    }

    private void generateExactMatchQuery(StringBuilder queryString, List<String> param, String fieldName, String valueType) {
        queryString.append("if (").append(fieldName)
                   .append(" != null && !").append(fieldName)
                   .append(".isEmpty()) {\n");
        queryString.append("    query.addCriteria(Criteria.where(\"")
                   .append(fieldName)
                   .append("\").is(")
                   .append(fieldName)
                   .append("));\n");
        param.add(valueType + " " + fieldName);
    }

    private void generateRegexQuery(StringBuilder queryString, List<String> param, String fieldName, String valueType) {
        queryString.append("if (").append(fieldName)
                   .append(" != null && !").append(fieldName)
                   .append(".isEmpty()) {\n");
        queryString.append("    query.addCriteria(Criteria.where(\"")
                   .append(fieldName)
                   .append("\").regex(")
                   .append(fieldName)
                   .append(", \"i\"));\n");
        param.add(valueType + " " + fieldName);
    }

    private void generateFullTextQuery(StringBuilder queryString, List<String> param, String fieldName, String valueType) {
        queryString.append("if (").append(fieldName)
                   .append(" != null && !").append(fieldName)
                   .append(".isEmpty()) {\n");
        queryString.append("    query.addCriteria(Criteria.where(\"$text\").is(")
                   .append(fieldName)
                   .append("));\n");
        param.add(valueType + " " + fieldName);
    }

    private void generateLessThanQuery(StringBuilder queryString, List<String> param, String fieldName, String valueType) {
        queryString.append("if (").append("lt" + fieldName)
                   .append(" != null && !").append("lt" + fieldName)
                   .append(".isEmpty()) {\n");
        queryString.append("    query.addCriteria(Criteria.where(\"")
                   .append(fieldName)
                   .append("\").lt(")
                   .append("lt" + fieldName)
                   .append("));\n");
        param.add(valueType + " lt" + fieldName);
    }

    private void generateGreaterThanQuery(StringBuilder queryString, List<String> param, String fieldName, String valueType) {
        queryString.append("if (").append("gt" + fieldName)
                   .append(" != null && !").append("gt" + fieldName)
                   .append(".isEmpty()) {\n");
        queryString.append("    query.addCriteria(Criteria.where(\"")
                   .append(fieldName)
                   .append("\").gt(")
                   .append("gt" + fieldName)
                   .append("));\n");
        param.add(valueType + " gt" + fieldName);
    }

    private void generateBetweenQuery(StringBuilder queryString, List<String> param, String fieldName, String valueType) {
        queryString.append("if (").append("gt" + fieldName)
                   .append(" != null && !").append("gt" + fieldName)
                   .append(".isEmpty()) {\n");
        String[] valuesArray = valueType.split(",");  // Assuming value is passed as "min,max"
        if (valuesArray.length == 2) {
            queryString.append("    query.addCriteria(Criteria.where(\"")
                       .append(fieldName)
                       .append("\").gte(")
                       .append(valuesArray[0])
                       .append(").lte(")
                       .append(valuesArray[1])
                       .append("));\n");
            param.add(valueType + " lt" + fieldName);
            param.add(valueType + " gt" + fieldName);
        }
    }

    private String buildServiceMethod(String schemaName, String serviceName, List<String> param, StringBuilder queryString) {
        StringBuilder serviceString = new StringBuilder();
        serviceString.append("List<")
                     .append(schemaName)
                     .append("> ")
                     .append(serviceName)
                     .append("(");

        // Adding parameters to method signature
        param.forEach(it -> serviceString.append(it).append(", "));
        // Remove last comma
        if (!param.isEmpty()) {
            serviceString.deleteCharAt(serviceString.length() - 1);
        }

        serviceString.append(") {\n");
        serviceString.append("    Query query = new Query(); \n");
        serviceString.append(queryString);
        serviceString.append("    return mongoTemplate.find(query, ").append(schemaName).append(".class); \n");
        serviceString.append("}\n");

        return serviceString.toString();
    }

    private void logGeneratedServiceDetails(String serviceString, List<String> param) {
        // Log the generated service string
        System.out.println(serviceString);

        // Log the parameters added to the set
        param.forEach(System.out::println);
    }
    


    public String handleController(List<String> param, String schemaName, Route route) {
        StringBuilder controllerMethod = new StringBuilder();
        List<String> setfns = new ArrayList<>();

        // Extract variable names for the service call
        param.forEach(it -> {
            String[] str = it.split(" ");
            setfns.add(str[1]);
        });

        // Define the route mapping and method signature
        controllerMethod.append("@GetMapping(\"/" + route.getUrl() + "\")\n");
        controllerMethod.append("public ResponseEntity<?> " + route.getController_name() + "(");

        // Append parameters with @RequestParam
        param.forEach(it -> controllerMethod.append("@RequestParam " + it + ", "));
        if (!param.isEmpty()) {
            controllerMethod.delete(controllerMethod.length() - 2, controllerMethod.length());
        }
        controllerMethod.append(") {\n");

        // Start the try block
        controllerMethod.append("    try {\n");

        // Call the service method and store the result
        String camelSchema = Helper.camelCase(schemaName);
        controllerMethod.append("        List<" + schemaName + "> " + camelSchema + "s = " + camelSchema + "Service.");
        controllerMethod.append(route.getController_name() + "(");
        setfns.forEach(it -> controllerMethod.append(it + ", "));
        if (!setfns.isEmpty()) {
            controllerMethod.delete(controllerMethod.length() - 2, controllerMethod.length());
        }
        controllerMethod.append(");\n");

        // Check for an empty result and respond accordingly
        controllerMethod.append("        if (" + camelSchema + "s.isEmpty()) {\n");
        controllerMethod.append("            logger.info(\"No " + schemaName.toLowerCase() + " found for the given parameters.\");\n");
        controllerMethod.append("            return ResponseEntity.status(HttpStatus.NOT_FOUND)\n");
        controllerMethod.append("                .body(\"No " + schemaName.toLowerCase() + " found matching the criteria.\");\n");
        controllerMethod.append("        }\n\n");

        // Log the results and return the found records
        controllerMethod.append("        logger.info(\"Found \" + " + camelSchema + "s.size() + \" " + schemaName.toLowerCase() + "(s) matching the criteria.\");\n");
        controllerMethod.append("        return ResponseEntity.ok(" + camelSchema + "s);\n");

        // Catch any exceptions and log an error message
        controllerMethod.append("    } catch (Exception e) {\n");
        controllerMethod.append("        logger.severe(\"Error occurred while searching for " + schemaName.toLowerCase() + ": \" + e.getMessage());\n");
        controllerMethod.append("        return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)\n");
        controllerMethod.append("            .body(\"An error occurred while processing your request.\");\n");
        controllerMethod.append("    }\n");

        // Close the method
        controllerMethod.append("}\n");

        return controllerMethod.toString();
    }

    
    void importHelper() {
    	importUtils.getServiceImport().add("import org.springframework.data.mongodb.core.MongoTemplate");
    	importUtils.getServiceImport().add("import org.springframework.data.mongodb.core.query.Criteria");
    	importUtils.getServiceImport().add("import org.springframework.data.mongodb.core.query.Query");
    	
    	
    }
    
  
    
}
