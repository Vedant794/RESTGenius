package com.Api_Crafter.Rest_Spring.DTO;

import java.util.List;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.fasterxml.jackson.annotation.JsonProperty;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor

@JsonIgnoreProperties(ignoreUnknown = true)
public class Schema {

	String schema_name;
	
	String schema_dbname;
	
	List<Attribute>attributes;
	
	private List<Route> routes;
	

	   @JsonProperty("relation")
	List<Relation>relations;
}
