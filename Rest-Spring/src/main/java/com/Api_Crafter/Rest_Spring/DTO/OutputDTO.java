package com.Api_Crafter.Rest_Spring.DTO;

import java.util.ArrayList;
import java.util.List;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
public class OutputDTO {

	List<File> entityFiles;
	List<File> objectFile;
	List<File> repoFiles;
	List<File> serviceFiles;
	List<File> controllerFiles;

	public OutputDTO() {
		entityFiles = new ArrayList<File>();
		objectFile = new ArrayList<File>();
		repoFiles = new ArrayList<File>();
		serviceFiles = new ArrayList<File>();
		controllerFiles = new ArrayList<File>();
	}

}
