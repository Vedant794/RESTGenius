package com.Api_Crafter.Rest_Spring.ServiceGeneration;

import java.util.HashMap;
import java.util.Map;

import com.Api_Crafter.Rest_Spring.DTO.Schema;
import com.Api_Crafter.Rest_Spring.EntitiesGeneration.ServiceController;

public interface CrudCommand {
	
	ServiceController execute(Map<String, Schema> schemaMap,Schema schema);
	
	


}
