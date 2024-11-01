package com.Api_Crafter.Rest_Spring.DTO;

import java.util.List;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;

import jakarta.annotation.Nullable;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@JsonIgnoreProperties(ignoreUnknown = true)
public class Attribute {

    private String var_name;

    private String db_type;

    private String var_dbname;
    
    private boolean isSet;
    
    private boolean isList;
    
    private boolean isObject;

    private boolean isDate;
    
    private boolean isUUID;
    
    private boolean isRequired;
    
    private boolean isIndexed;

    @Nullable
    private List<Attribute> attributes;

}
