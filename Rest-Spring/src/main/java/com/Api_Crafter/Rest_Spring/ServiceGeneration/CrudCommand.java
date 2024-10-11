package com.Api_Crafter.Rest_Spring.ServiceGeneration;

import java.util.HashMap;
import java.util.Map;

import com.Api_Crafter.Rest_Spring.DTO.Schema;

public interface CrudCommand {
	
	String execute(Map<String, Schema> schemaMap,Schema schema);
	
	


}
