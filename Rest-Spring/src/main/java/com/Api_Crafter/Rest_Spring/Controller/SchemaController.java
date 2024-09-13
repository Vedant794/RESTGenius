package com.Api_Crafter.Rest_Spring.Controller;


import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import com.Api_Crafter.Rest_Spring.DTO.OutputDTO;
import com.Api_Crafter.Rest_Spring.DTO.ProjectDetails;
import com.Api_Crafter.Rest_Spring.Services.EntityService;
import com.Api_Crafter.Rest_Spring.Utils.GeneratorFactory;
import com.Api_Crafter.Rest_Spring.Utils.Generator;
@RestController
public class SchemaController {

   
    private final GeneratorFactory generatorFactory;

    @Autowired
    public SchemaController(GeneratorFactory generatorFactory) {
        this.generatorFactory = generatorFactory;
    }

    @PostMapping("/generateEntity")
    public OutputDTO generateEntity(@RequestBody ProjectDetails projectDetails) {
        // Use the generator factory's instance method to get the correct generator
        Generator generator = generatorFactory.springGenerator("Mongo");
        return generator.generate(projectDetails);
    }
}
