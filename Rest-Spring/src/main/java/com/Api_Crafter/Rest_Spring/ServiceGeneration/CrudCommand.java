package com.Api_Crafter.Rest_Spring.ServiceGeneration;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

import com.Api_Crafter.Rest_Spring.DTO.GenerationResult;
import com.Api_Crafter.Rest_Spring.DTO.Schema;
import com.Api_Crafter.Rest_Spring.EntitiesGeneration.ServiceController;
import com.Api_Crafter.Rest_Spring.Exception.NoSchemaFoundException;

public interface CrudCommand {
	
	List<GenerationResult>execute(Map<String, Schema> schemaMap,Schema schema) throws NoSchemaFoundException;
	
	


}
