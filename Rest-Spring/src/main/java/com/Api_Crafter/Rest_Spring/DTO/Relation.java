package com.Api_Crafter.Rest_Spring.DTO;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;

@Data
@AllArgsConstructor
@Builder

@JsonIgnoreProperties(ignoreUnknown = true)
public class Relation {

	String schema;
	
	String target;

	boolean lazyLoad;
	
	String type;
	
	boolean cascadeDelete;
	
}
