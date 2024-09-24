package com.Api_Crafter.Rest_Spring.DTO;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
public class Criteria {

	String targetVar;
	
	String  operationType;
	
	String valueType;
}
