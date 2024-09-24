package com.Api_Crafter.Rest_Spring.DTO;

import java.util.List;

import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class Route {

	String url;
	
	String service_name;
	
	String controller_name;
	
	List<Criteria>criterias;
	
}
