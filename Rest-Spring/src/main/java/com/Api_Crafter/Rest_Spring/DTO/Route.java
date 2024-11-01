package com.Api_Crafter.Rest_Spring.DTO;

import java.util.List;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;

import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor

@JsonIgnoreProperties(ignoreUnknown = true)
public class Route {

	String url;
	
	String service_name;
	
	String controller_name;
	
	List<Criteria>criterias;
	
}
