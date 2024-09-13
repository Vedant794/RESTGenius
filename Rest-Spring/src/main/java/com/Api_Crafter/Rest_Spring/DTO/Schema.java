package com.Api_Crafter.Rest_Spring.DTO;

import java.util.List;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class Schema {

	String name;
	
	String dbname;
	
	List<Attribute>attributes;
}
