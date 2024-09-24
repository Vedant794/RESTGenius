package com.Api_Crafter.Rest_Spring.EntitiesGeneration;

import java.util.List;
import org.springframework.stereotype.Component;
import org.thymeleaf.spring6.SpringTemplateEngine;
import com.Api_Crafter.Rest_Spring.DTO.Criteria;
import com.Api_Crafter.Rest_Spring.DTO.Route;

@Component
public class AdvanceRoutes {

    public final SpringTemplateEngine templateEngine;

    public AdvanceRoutes(SpringTemplateEngine templateEngine) {
        this.templateEngine = templateEngine;
    }



	public List<String> HandleAdvanceRoutes(Route route, String schemaName) {
	     StringBuilder queryString = new StringBuilder();
	     StringBuilder values = new StringBuilder();
	     
	     // Generate query conditions based on Criteria
	     for (Criteria it : route.getCriterias()) {
	         String fieldName = it.getTargetVar();
	         String value = it.getValueType();
	         String operationType = it.getOperationType();
	
	         // Generate the dynamic query string with null and empty checks
	         queryString.append("if (").append(value)
	                    .append(" != null && !").append(value)
	                    .append(".isEmpty()) {\n");
	
	         if ("EXACT_MATCH".equals(operationType)) {
	             queryString.append("    query.addCriteria(Criteria.where(\"")
	                        .append(fieldName)
	                        .append("\").is(\"")
	                        .append(value)
	                        .append("\"));\n");
	
	         } else if ("REGEX".equals(operationType)) {
	             queryString.append("    query.addCriteria(Criteria.where(\"")
	                        .append(fieldName)
	                        .append("\").regex(\"")
	                        .append(value)
	                        .append("\", \"i\"));\n");
	
	         } else if ("FULL_TEXT".equals(operationType)) {
	             queryString.append("    query.addCriteria(Criteria.where(\"$text\").is(\"")
	                        .append(value)
	                        .append("\"));\n");
	
	         } else if ("LESS_THAN".equals(operationType)) {
	             queryString.append("    query.addCriteria(Criteria.where(\"")
	                        .append(fieldName)
	                        .append("\").lt(")
	                        .append(value)
	                        .append("));\n");
	
	         } else if ("GREATER_THAN".equals(operationType)) {
	             queryString.append("    query.addCriteria(Criteria.where(\"")
	                        .append(fieldName)
	                        .append("\").gt(")
	                        .append(value)
	                        .append("));\n");
	
	         } else if ("BETWEEN".equals(operationType)) {
	             String[] valuesArray = value.split(",");  // Assuming the value is passed as "min,max"
	             if (valuesArray.length == 2) {
	                 queryString.append("    query.addCriteria(Criteria.where(\"")
	                            .append(fieldName)
	                            .append("\").gte(")
	                            .append(valuesArray[0])
	                            .append(").lte(")
	                            .append(valuesArray[1])
	                            .append("));\n");
	             }
	
	         } else {
	             queryString.append("    throw new IllegalArgumentException(\"Invalid search operation: ")
	                        .append(operationType)
	                        .append("\");\n");
	         }
	
	         queryString.append("}\n");
	
	         // Building service method parameters
	         values.append(", ").append(it.getValueType()).append(" ").append(it.getTargetVar());
	     }
	
	     // Building the service method signature
	     StringBuilder serviceString = new StringBuilder();
	     serviceString.append("List<")
	                  .append(schemaName)
	                  .append("> ")
	                  .append(route.getService_name())
	                  .append("(")
	                  .append(values.substring(2)) 
	                  .append("){/n");
	
	 serviceString.append(queryString);
	 serviceString.append("mongoTemplate.find(query," +schemaName+".class);");
	 
	 StringBuilder controller=new StringBuilder();
	     return List.of(serviceString.toString());
	 }
}
