package com.Api_Crafter.Rest_Spring.DTO;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class GenerationResult {

	private String type;
	
	private String content;
	
	private String filename;
	
}

