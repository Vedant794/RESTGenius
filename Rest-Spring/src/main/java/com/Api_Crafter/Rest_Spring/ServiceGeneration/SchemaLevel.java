package com.Api_Crafter.Rest_Spring.ServiceGeneration;

import com.Api_Crafter.Rest_Spring.DTO.Schema;

import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class SchemaLevel {
	Schema schmea;
	int level;
}
