package com.Api_Crafter.Rest_Spring.DTO;

import java.util.List;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class ProjectDetails {
	
	String projectName;
	
Schema schemas;
}
