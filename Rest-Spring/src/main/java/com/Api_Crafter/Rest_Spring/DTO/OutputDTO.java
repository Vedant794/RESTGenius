package com.Api_Crafter.Rest_Spring.DTO;

import java.util.List;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class OutputDTO {

	List<String>entityFiles;
	List<String>objectFile;
	List<String>repoFiles;
    List<String>serviceFiles;
    List<String>controllerFiles;
}
