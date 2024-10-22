package com.Api_Crafter.Rest_Spring.Utils;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;
import org.thymeleaf.spring6.SpringTemplateEngine;

import com.Api_Crafter.Rest_Spring.EntitiesGeneration.EntityHandler;

import com.Api_Crafter.Rest_Spring.EntitiesGeneration.RepositoryGenerator;
import com.Api_Crafter.Rest_Spring.Services.SpringMongoGenerator;

@Component
public class GeneratorFactory {

    private final SpringTemplateEngine templateEngine;

    @Autowired
    public GeneratorFactory(SpringTemplateEngine templateEngine) {
        this.templateEngine = templateEngine;
    }

    public Generator springGenerator(String database) {
        switch (database) {
            case "Mongo":
                return new SpringMongoGenerator(new EntityHandler(templateEngine),new RepositoryGenerator(templateEngine), templateEngine
                		); // Pass the template engine
            default:
                throw new IllegalArgumentException("Unexpected value: " + database);
        }
    }
}
