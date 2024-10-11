package com.Api_Crafter.Rest_Spring.Services;

import java.util.HashMap;
import java.util.Map;

import org.springframework.context.support.StaticApplicationContext;

import com.Api_Crafter.Rest_Spring.DTO.Attribute;
import com.Api_Crafter.Rest_Spring.DTO.ProjectDetails;
import com.Api_Crafter.Rest_Spring.DTO.Schema;

public class Helper {

	public static Map<String, Schema> schemaMap(ProjectDetails projectDetails) {
		Map<String, Schema> map = new HashMap<>();

		for (Schema sc : projectDetails.getSchemas()) {
			map.put(sc.getSchema_name(), sc);
		}
		return map;
	}

}
