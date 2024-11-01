package com.Api_Crafter.Rest_Spring.AdvanceSearch;



import com.Api_Crafter.Rest_Spring.DTO.Route;

import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class AdvanceSearchDTO {

	String schemaName;
	
	Route route;
	
}
