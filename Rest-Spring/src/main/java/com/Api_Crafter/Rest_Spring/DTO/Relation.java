package com.Api_Crafter.Rest_Spring.DTO;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;

@Data
@AllArgsConstructor
@Builder
public class Relation {

	String schema;
	
	String target;

	boolean lazyLoad;
	
	String type;
	
	boolean cascadeDelete;
	
}
