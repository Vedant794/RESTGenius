package com.Api_Crafter.Rest_Spring.ServiceGeneration;

import java.util.ArrayList;
import java.util.HashSet;
import java.util.List;
import java.util.Set;

import org.springframework.stereotype.Component;
import org.springframework.web.servlet.mvc.condition.ParamsRequestCondition;
import org.thymeleaf.spring6.SpringTemplateEngine;
import com.Api_Crafter.Rest_Spring.DTO.Criteria;
import com.Api_Crafter.Rest_Spring.DTO.Route;
import lombok.extern.slf4j.Slf4j;

@Component
@Slf4j 
public class AdvanceRoutes {

    public final SpringTemplateEngine templateEngine;
    

    public AdvanceRoutes(SpringTemplateEngine templateEngine) {
        this.templateEngine = templateEngine;
    }

    public String HandleAdvanceRoutes(Route route, String schemaName) {

       Set<String> param = new HashSet<>();
        StringBuilder queryString = new StringBuilder();
        StringBuilder values = new StringBuilder();

        // Generate query conditions based on Criteria
        for (Criteria it : route.getCriterias()) {
            String fieldName = it.getTargetVar();
            String value = it.getValueType();
            String operationType = it.getOperationType();

            // Generate the dynamic query string with null and empty checks
            queryString.append("if (").append(fieldName)
                       .append(" != null && !").append(fieldName)
                       .append(".isEmpty()) {\n");

            if ("EXACT_MATCH".equals(operationType)) {
                queryString.append("    query.addCriteria(Criteria.where(\"")
                           .append(fieldName)
                           .append("\").is(\"")
                           .append(value)
                           .append("\"));\n");
                param.add("String " + fieldName);

            } else if ("REGEX".equals(operationType)) {
                queryString.append("    query.addCriteria(Criteria.where(\"")
                           .append(fieldName)
                           .append("\").regex(\"")
                           .append(value)
                           .append("\", \"i\"));\n");
                param.add("String " + fieldName);

            } else if ("FULL_TEXT".equals(operationType)) {
                queryString.append("    query.addCriteria(Criteria.where(\"$text\").is(\"")
                           .append(value)
                           .append("\"));\n");
                param.add("String textSearchValue");

            } else if ("LESS_THAN".equals(operationType)) {
                queryString.append("    query.addCriteria(Criteria.where(\"")
                           .append(fieldName)
                           .append("\").lt(")
                           .append(value)
                           .append("));\n");
                param.add("String lessValue_" + fieldName);

            } else if ("GREATER_THAN".equals(operationType)) {
                queryString.append("    query.addCriteria(Criteria.where(\"")
                           .append(fieldName)
                           .append("\").gt(")
                           .append(value)
                           .append("));\n");
                param.add("String greaterValue_" + fieldName);

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
                    param.add("String minValue_" + fieldName);
                    param.add("String maxValue_" + fieldName);
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
                     .append("(");
//                     .append(values.substring(2))  // Skip the leading ", "
//                     .append("){\n");
        param.forEach(it->serviceString.append(it+","));
        serviceString.deleteCharAt(serviceString.length()-1);
                          serviceString  .append("){\n");

        serviceString.append(queryString);
        serviceString.append("mongoTemplate.find(query," + schemaName + ".class); \n }\n");

        // Log the service string instead of printing it
        //log.info(serviceString.toString());
        System.out.println(serviceString);

        // Log the parameters added to the set
        param.forEach(it->System.out.println(it));
      //  log.info("Parameters: " + param);
        


        return serviceString.toString();
    }
}
