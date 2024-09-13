package com.Api_Crafter.Rest_Spring.DTO;

import java.util.List;

import jakarta.annotation.Nullable;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class Attribute {

	String name;
	
	String type;
	
	String dbname;
	
	@Nullable
	List<ObjectAttribute>objectAttributes;
	public Boolean hasObjectAttribute() {
	    return objectAttributes != null && !objectAttributes.isEmpty();
	}

	
}
