package com.Api_Crafter.Rest_Spring.Utils;

import org.springframework.context.event.EventPublicationInterceptor;

import com.Api_Crafter.Rest_Spring.DTO.OutputDTO;
import com.Api_Crafter.Rest_Spring.DTO.ProjectDetails;
import com.Api_Crafter.Rest_Spring.Exception.NoSchemaFoundException;



public interface Generator {

	public OutputDTO generate(ProjectDetails projectDetails) throws NoSchemaFoundException;
	
}
