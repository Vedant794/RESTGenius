package com.Api_Crafter.Rest_Spring.Utils;

import java.util.HashSet;
import java.util.Set;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data

public class ImportUtils {
	
	Set<String>serviceImport;
	Set<String>controllerImport;
	Set<String>serviceAutowire;

	
	public ImportUtils(){
		serviceImport=new HashSet<String>();
	
		serviceAutowire=new HashSet<String>();
		controllerImport=new HashSet<String>();
	}

}
