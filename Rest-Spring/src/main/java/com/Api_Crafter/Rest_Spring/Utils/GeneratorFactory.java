package com.Api_Crafter.Rest_Spring.Utils;


import org.thymeleaf.spring6.SpringTemplateEngine;

import com.Api_Crafter.Rest_Spring.Services.SpringMongoGenerator;

import org.springframework.stereotype.Component;

@Component
public class GeneratorFactory {

    private final SpringTemplateEngine templateEngine;

    public GeneratorFactory(SpringTemplateEngine templateEngine) {
        this.templateEngine = templateEngine;
    }

   
    public Generator springGenerator(String database) {
        switch (database) {
            case "Mongo":
                return new SpringMongoGenerator(templateEngine);
            default:
                throw new IllegalArgumentException("Unexpected value: " + database);
        }
    }
}
