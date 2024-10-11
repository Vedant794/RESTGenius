package com.Api_Crafter.Rest_Spring.ServiceGeneration;

import java.util.*;

import com.Api_Crafter.Rest_Spring.DTO.Schema;
import com.Api_Crafter.Rest_Spring.EntitiesGeneration.RepositoryGenerator;
import com.Api_Crafter.Rest_Spring.DTO.Relation;

public class SaveGeneration implements CrudCommand {

    @Override
    public String execute(Map<String, Schema> schemaMap, Schema schema) {
        
        // Initializing the queue for BFS
        Queue<SchemaLevel> queue = new LinkedList<>();
        SchemaLevel schemaLevel = new SchemaLevel(schema, 0);
        queue.add(schemaLevel);

        // Function parameters set
        Set<String> fnParams = new HashSet<>();
        fnParams.add(schema.getSchema_name());

        // Result is stored here
        List<String> saveStrings = new ArrayList<>();

        // Applying BFS
        while (!queue.isEmpty()) {
            SchemaLevel temp = queue.poll();

            if (temp.getSchmea().getRelations() != null) {
                for (Relation relation : temp.getSchmea().getRelations()) {
                    Schema relatedSchema = schemaMap.get(relation.getTarget());

                    // Adding it to function parameters
                    String nameString = relatedSchema.getSchema_name();
                    fnParams.add(nameString.substring(0, 1).toLowerCase() + nameString.substring(1));

                    if (relation.getType().equals("OneToOne")) {
                        saveStrings.add(handleOneToOneString(relatedSchema.getSchema_name(), temp.getSchmea().getSchema_name()));
                    } else {
                        saveStrings.add(handleOneToMany(temp.getSchmea().getSchema_name(), relatedSchema.getSchema_name(), "List<>"));
                    }
                    queue.add(new SchemaLevel(relatedSchema, temp.getLevel() + 1));
                }
            }
        }

        // Building the template string
        StringBuilder template = new StringBuilder();
        template.append(schema.getSchema_name()).append(" Save").append(schema.getSchema_name()).append("(");

        fnParams.forEach(it -> template.append(", ").append(it).append(" ").append(it.substring(0, 1).toLowerCase()).append(it.substring(1)));
        template.append(") {\n");

        Collections.reverse(saveStrings);

        saveStrings.forEach(it -> template.append(it));
        template.append("return ").append(schema.getSchema_name()).append("Repository.save();");
        template.append("\n}");

        //System.out.println(template);
        return template.toString();
    }

    // Handling OneToOne relation
    public String handleOneToOneString(String entity, String parent) {
        // Lowercase entity name
        String lowerEntity = entity.substring(0, 1).toLowerCase() + entity.substring(1);

        StringBuilder template = new StringBuilder();
        template.append("new").append(lowerEntity).append(" = ").append(lowerEntity).append("Repository.save(").append(lowerEntity).append(");\n");
        template.append(parent).append(".set").append(entity).append("Id(new").append(lowerEntity).append(".getId());\n");

        return template.toString();
    }


    // Handling OneToMany relation
    public String handleOneToMany(String parentEntity, String childEntity, String childCollectionName) {
        // Lowercase entity names
        String lowerParentEntity = parentEntity.substring(0, 1).toLowerCase() + parentEntity.substring(1);
        String lowerChildEntity = childEntity.substring(0, 1).toLowerCase() + childEntity.substring(1);

        StringBuilder template = new StringBuilder();

        // Iterate through the collection of child entities
        template.append("\nfor (").append(childEntity).append(" ").append(lowerChildEntity).append(" : ")
                .append(lowerParentEntity).append(".get").append(childCollectionName).append("()) {\n");
        
        // Set the parent reference in each child entity
        template.append("    ").append(lowerChildEntity).append(".set").append(parentEntity).append("(")
                .append(lowerParentEntity).append(");\n");

        // Save each child entity
        template.append("    ").append(lowerChildEntity).append("Repository.save(").append(lowerChildEntity).append(");\n");

        template.append("}\n");

        return template.toString();
    }

    // Placeholder for ManyToMany relation
    public String handleManyToMany() {
        return null;
    }
}
