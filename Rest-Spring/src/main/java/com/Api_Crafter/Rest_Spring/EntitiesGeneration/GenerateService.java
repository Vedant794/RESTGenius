package com.Api_Crafter.Rest_Spring.EntitiesGeneration;

import java.util.ArrayList;
import java.util.List;

import org.apache.catalina.startup.CertificateCreateRule;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.autoconfigure.amqp.RabbitProperties.Template;
import org.springframework.stereotype.Component;
import org.springframework.stereotype.Service;
import org.thymeleaf.context.Context;
import org.thymeleaf.spring6.SpringTemplateEngine;

import com.Api_Crafter.Rest_Spring.DTO.Schema;

@Component
public class GenerateService {


public final	SpringTemplateEngine templateEngine;


	
	public GenerateService(SpringTemplateEngine templateEngine) {
	this.templateEngine = templateEngine;
}

	Context context;
	
	
	ServiceController generateSave() {
		ServiceController serviceController=new ServiceController();
		String servicetemplate="SaveService.txt";
		
		String controllerTemplateString="SaveController.txt";
		
		 serviceController.setService(templateEngine.process(servicetemplate, context));
		 serviceController.setController(templateEngine.process(controllerTemplateString, context));
		 return serviceController;
	}
	
	ServiceController generateGetAll() {
		ServiceController serviceController=new ServiceController();
		String servicetemplate="GetAllService.txt";
		String controllerTemplateString="GetAllController.txt";
		 serviceController.setService(templateEngine.process(servicetemplate, context));
		 serviceController.setController(templateEngine.process(controllerTemplateString, context));
		 return serviceController;
	}
	
	
	ServiceController generateGetByID() {
		ServiceController serviceController=new ServiceController();
		String servicetemplate="GetByIdService.txt";
				
		
		String controllerTemplateString="GetByIdController.txt";
		
		 serviceController.setService(templateEngine.process(servicetemplate, context));
		 serviceController.setController(templateEngine.process(controllerTemplateString, context));
		 return serviceController;
	}
	
	ServiceController generateUpdate() {
		ServiceController serviceController=new ServiceController();
		String servicetemplate="UpdateService.txt";
			
		
		String controllerTemplateString="UpdateController.txt";
		 serviceController.setService(templateEngine.process(servicetemplate, context));
		 serviceController.setController(templateEngine.process(controllerTemplateString, context));
		 return serviceController;
	}
	
	ServiceController generateDelete() {
		ServiceController serviceController=new ServiceController();
		String servicetemplate="DeleteService.txt";
		
		String controllerTemplateString="DeleteController.txt";
		 serviceController.setService(templateEngine.process(servicetemplate, context));
		 serviceController.setController(templateEngine.process(controllerTemplateString, context));
		 return serviceController;
	}
	
 public	ServiceController Create(Schema schema) {
           context=new Context();
           context.setVariable("Entity", schema.getSchema_name());
           context.setVariable("EntityRepository", schema.getSchema_name()+"Repository");
       
           String entity=schema.getSchema_name().substring(0, 1).toLowerCase() + schema.getSchema_name().substring(1);
           context.setVariable("entityRepository", entity+"Repository");
           context.setVariable("entity",entity );
           context.setVariable("entityService", entity+"Service");
           context.setVariable("EntityService", schema.getSchema_name()+"Service");
           
           List<String>serviceStrings=new ArrayList<String>();
           List<String>controllerList=new ArrayList<String>();
           
         ServiceController serviceController=generateSave();
         serviceStrings.add(serviceController.getService());
         controllerList.add(serviceController.getController());
         serviceController=generateDelete();
         serviceStrings.add(serviceController.getService());
         controllerList.add(serviceController.getController());
          serviceController =generateGetAll();
          serviceStrings.add(serviceController.getService());
          controllerList.add(serviceController.getController());
         serviceController=generateGetByID();
         serviceStrings.add(serviceController.getService());
         controllerList.add(serviceController.getController());
         serviceController=generateUpdate();
         serviceStrings.add(serviceController.getService());
         controllerList.add(serviceController.getController());
         
         context.setVariable("Services", serviceStrings);
         context.setVariable("Controllers", controllerList);
         
         String serviceFile=templateEngine.process("Service.txt", context);
         String controllerFile=templateEngine.process("Controller.txt", context);
         
         serviceController.setController(controllerFile.replace("&lt;", "<").replace("&gt;", ">"));
         serviceController.setService(serviceFile.replace("&lt;", "<").replace("&gt;", ">"));
         
        return serviceController;
	}
	
}
