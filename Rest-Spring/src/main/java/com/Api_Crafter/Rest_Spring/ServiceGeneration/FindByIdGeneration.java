package com.Api_Crafter.Rest_Spring.ServiceGeneration;

import java.util.ArrayList;
import java.util.Collections;
import java.util.LinkedList;
import java.util.List;
import java.util.Map;
import java.util.Queue;

import com.Api_Crafter.Rest_Spring.DTO.Relation;
import com.Api_Crafter.Rest_Spring.DTO.Schema;

public class FindByIdGeneration implements CrudCommand {

    @Override
    public String execute(Map<String, Schema> schemaMap, Schema schema) {

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

            // Traverse through each relation in the schema
            for (Relation relation : currentSchema.getRelations()) {
                if (relation.isLazyLoad()) {
                    if (relation.getType().equals("OneToOne")) {
                        findByStrings.add(handleOneToOne(relation.getTarget(),
                                currentSchema.getSchema_name() + ".get" + relation.getTarget() + "Id()"));
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

        return template.toString(); // Return the generated code as a string
    }

    // Method to handle OneToOne relationships
    private String handleOneToOne(String parent, String id) {
        String smallParent = parent.substring(0, 1).toLowerCase() + parent.substring(1);
        StringBuilder template = new StringBuilder();
        template.append(parent + " new" + parent + " = ");
        template.append(parent + "Repository.findById(" + id + ");\n");
        return template.toString();
    }

    // Method to handle OneToMany relationships
    private String handleOneToMany(String parent, String child) {
        String smallChild = child.substring(0, 1).toLowerCase() + child.substring(1);
        String smallParent = parent.substring(0, 1).toLowerCase() + parent.substring(1);

        StringBuilder template = new StringBuilder();

        // Generate code for creating a list of children
        template.append("List<" + child + "> new" + smallChild + "s = new ArrayList<>();\n");
        
        // Generate code for looping through parent and fetching child objects
        template.append("for (String it : " + smallParent + ".get" + child + "Ids()) {\n");
        template.append("    new" + smallChild + "s.add(" + smallChild + "Repository.findById(it));\n");
        template.append("}\n");

        return template.toString();
    }

}
