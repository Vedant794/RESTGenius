package com.Api_Crafter.Rest_Spring.DTO;

import java.util.List;


import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
@Data
@AllArgsConstructor
@NoArgsConstructor
public class ObjectAttribute {
String name;

String type;

@jakarta.annotation.Nullable
List<ObjectAttribute>objectAttributes;
}
