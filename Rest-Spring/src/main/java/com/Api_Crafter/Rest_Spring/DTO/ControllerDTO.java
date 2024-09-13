package com.Api_Crafter.Rest_Spring.DTO;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class ControllerDTO {
	
	String entityService;
	String entity;
	String entity_;
	String entityService_;

}
