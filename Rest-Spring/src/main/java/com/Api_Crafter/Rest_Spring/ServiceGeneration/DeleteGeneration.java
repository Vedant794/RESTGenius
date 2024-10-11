package com.Api_Crafter.Rest_Spring.ServiceGeneration;

import java.util.ArrayList;
import java.util.LinkedList;
import java.util.List;
import java.util.Map;
import java.util.Queue;

import com.Api_Crafter.Rest_Spring.DTO.Relation;
import com.Api_Crafter.Rest_Spring.DTO.Schema;

public class DeleteGeneration implements CrudCommand {

    @Override
    public String execute(Map<String, Schema> schemaMap, Schema schema) {

        // Separating the concerns
        List<String> deleteStatements = new ArrayList<>();
        List<String> fetchStatements = new ArrayList<>();

        // Fetching the root entity
        fetchStatements.add(schema.getSchema_name()+" "+schema.getSchema_name()+"="+schema.getSchema_name() + "Repository.findById(id).orElseThrow(() -> new RuntimeException(\"" 
                            + schema.getSchema_name() + " not found\"));\n");

        // Creating a queue for schema level traversal
        Queue<SchemaLevel> queue = new LinkedList<>();
        queue.add(new SchemaLevel(schema, 0));

        // Traversing relationships in the schema
        while (!queue.isEmpty()) {
            SchemaLevel temp = queue.poll();
            Schema currentSchema = temp.getSchmea();

            for (Relation relation : currentSchema.getRelations()) {
                if (relation.getType().equals("OneToOne")) {
                    fetchStatements.add(handleOneToOne(currentSchema.getSchema_name(), relation.getTarget()));
                    deleteStatements.add(relation.getTarget() + "Repository.deleteById(" 
                                         + currentSchema.getSchema_name() + ".get" 
                                         + relation.getTarget() + "Id());\n");
                } else if (relation.getType().equals("OneToMany")) {
                    fetchStatements.add(handleOneToMany(currentSchema.getSchema_name(), relation.getTarget()));
                    deleteStatements.add("for (String childId : " + currentSchema.getSchema_name() + ".get" 
                                         + relation.getTarget() + "Ids()) {");
                    deleteStatements.add("    " + relation.getTarget() + "Repository.deleteById(childId);\n");
                    deleteStatements.add("}");
                }
                queue.add(new SchemaLevel(schemaMap.get(relation.getTarget()), temp.getLevel() + 1));
            }
        }

        // Building the final method for deleting
        StringBuilder template = new StringBuilder();
        String parent = schema.getSchema_name();
        template.append("void delete" + parent + "ById(String id) {\n");
        
        // Add fetch statements
        fetchStatements.forEach(template::append);
        
        // Add delete statements
        deleteStatements.forEach(template::append);
        
        template.append("}");
        
        // Output the generated method for verification
     //   System.out.println(template);

        return template.toString();
    }

    // Method to handle OneToOne relationships
    String handleOneToOne(String parent, String child) {
        StringBuilder template = new StringBuilder();
        template.append(child + "Repository.findById(" + parent + ".get" + child + "Id())");
        template.append(".orElseThrow(() -> new RuntimeException(\"" + child + " not found\"));\n");
        return template.toString();
    }

    // Method to handle OneToMany relationships
    String handleOneToMany(String parent, String child) {
        StringBuilder template = new StringBuilder();
        
        // Generating code to fetch the list of child entities
        template.append("List<" + child + "> " + child.toLowerCase() + "List = " 
                       + parent.toLowerCase() + ".get" + child + "Ids().stream()\n");
        template.append("    .map(childId -> " + child + "Repository.findById(childId)\n");
        template.append("    .orElseThrow(() -> new RuntimeException(\"" + child + " not found\")))\n");
        template.append("    .collect(Collectors.toList());\n");

        return template.toString();
    }

}
