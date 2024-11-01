package com.Api_Crafter.Rest_Spring.Utils;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;
import org.thymeleaf.spring6.SpringTemplateEngine;

import com.Api_Crafter.Rest_Spring.AdvanceSearch.ApiService;
import com.Api_Crafter.Rest_Spring.EntitiesGeneration.EntityHandler;

import com.Api_Crafter.Rest_Spring.EntitiesGeneration.RepositoryGenerator;
import com.Api_Crafter.Rest_Spring.Services.SpringMongoGenerator;

@Component
public class GeneratorFactory {

    private final SpringTemplateEngine templateEngine;
    private final ApiService apiService;

    @Autowired
    public GeneratorFactory(SpringTemplateEngine templateEngine, ApiService apiService) {
        this.templateEngine = templateEngine;
        this.apiService = apiService;
    }

    public Generator springGenerator(String database) {
        switch (database) {
            case "Mongo":
                return new SpringMongoGenerator(
                    new EntityHandler(templateEngine),
                    new RepositoryGenerator(templateEngine),
                    templateEngine,
                    apiService
                );
            default:
                throw new IllegalArgumentException("Unexpected value: " + database);
        }
    }
}
