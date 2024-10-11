package com.Api_Crafter.Rest_Spring.DTO;

import java.util.List;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@Builder
public class ProjectDetails {
	
	String projectName;
	
List<Schema>schemas;
}
