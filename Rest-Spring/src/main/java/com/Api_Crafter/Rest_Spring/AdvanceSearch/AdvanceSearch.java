package com.Api_Crafter.Rest_Spring.AdvanceSearch;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import com.Api_Crafter.Rest_Spring.DTO.GenerationResult;
import com.Api_Crafter.Rest_Spring.DTO.ProjectDetails;
import com.Api_Crafter.Rest_Spring.DTO.Route;
import com.Api_Crafter.Rest_Spring.DTO.Schema;



import reactor.core.publisher.Flux;

public class AdvanceSearch {

    private final ApiService apiService;

    public AdvanceSearch(ApiService apiService) {
        this.apiService = apiService;
    }

    public List<GenerationResult> execute(ProjectDetails projectDetails) {
        System.out.println("Executing search...");
        
        List<AdvanceSearchDTO> advanceSearchDTOs = new ArrayList<>();
        for (Schema schema : projectDetails.getSchemas()) {
            if (schema.getRoutes() != null && !schema.getRoutes().isEmpty()) {
                schema.getRoutes().forEach(route -> {
                    AdvanceSearchDTO advanceSearchDTO = new AdvanceSearchDTO(schema.getSchema_name(), route);
                    advanceSearchDTOs.add(advanceSearchDTO);
                });
            }
        }
        
        // Collect results into a list and block until all tasks are complete
        return Flux.fromIterable(advanceSearchDTOs)
            .flatMap(advanceSearchDTO -> apiService.performAdvanceSearch(advanceSearchDTO)
                .doOnSuccess(advanceResponseDTO -> {
                    if (advanceResponseDTO != null) {
                        System.out.println("Service Method: " + advanceResponseDTO.getService());
                        System.out.println("Controller: " + advanceResponseDTO.getController());
                        System.out.println("Schema Name: " + advanceResponseDTO.getSchemaName());
                    }
                })
                .doOnError(error -> System.err.println("Error: " + error.getMessage()))
                .flatMapMany(advanceResponseDTO -> Flux.just(
                    new GenerationResult("Service_SubPart", advanceResponseDTO.getService(), advanceResponseDTO.getSchemaName()),
                    new GenerationResult("Controller_SubPart", advanceResponseDTO.getController(), advanceResponseDTO.getSchemaName())
                ))
            )
            .doOnTerminate(() -> System.out.println("All tasks completed"))
            .collectList()  // Collect results into a list
            .block();       // Block the thread until all processing is done
    }
}
