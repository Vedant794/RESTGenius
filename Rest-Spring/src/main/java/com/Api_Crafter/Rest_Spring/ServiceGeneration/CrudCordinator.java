package com.Api_Crafter.Rest_Spring.ServiceGeneration;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.thymeleaf.context.Context;
import org.thymeleaf.spring6.SpringTemplateEngine;

import com.Api_Crafter.Rest_Spring.DTO.ProjectDetails;
import com.Api_Crafter.Rest_Spring.DTO.Route;
import com.Api_Crafter.Rest_Spring.DTO.Schema;
import com.Api_Crafter.Rest_Spring.Services.Helper;

@Service
public class CrudCordinator {

    private final SpringTemplateEngine templateEngine;

    List<CrudCommand> crudCommands = new ArrayList<>();
    Map<String, Schema> map;
    AdvanceRoutes advanceRoutes;

    @Autowired
    public CrudCordinator(SpringTemplateEngine templateEngine, Map<String, Schema> helperMap) {
        this.templateEngine = templateEngine;
        this.map = helperMap;
        crudCommands.add(new SaveGeneration());
        crudCommands.add(new FindByIdGeneration());
        crudCommands.add(new DeleteGeneration());
        crudCommands.add(new UpdateGeneration());
        advanceRoutes=new AdvanceRoutes(templateEngine);
    }

    public String execute(Schema schema) {
        List<String> templateList = new ArrayList<>();
        for (CrudCommand crudCommand : crudCommands) {
            templateList.add(crudCommand.execute(map, schema));
        }
        for(Route route: schema.getRoutes()) {
        templateList.add(	advanceRoutes.HandleAdvanceRoutes(route, schema.getSchema_name()));
        }

        Context context = new Context();
        context.setVariable("Entity", schema.getSchema_name());
        context.setVariable("EntityRepository", schema.getSchema_name() + "Repository");
        context.setVariable("entityRepository", schema.getSchema_dbname().toLowerCase() + "Repository");
        context.setVariable("Services", templateList);

        String ans = templateEngine.process("Service.txt", context);
       // System.out.println(ans);
        return ans;
    }
}

