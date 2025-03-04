package com.smarthome.api;

import com.smarthome.model.EnergyEntry;
import com.smarthome.service.EnergyService;

import javax.inject.Inject;
import javax.ws.rs.*;
import javax.ws.rs.core.MediaType;
import javax.ws.rs.core.Response;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.List;

@Path("/energy")
@Produces(MediaType.APPLICATION_JSON)
@Consumes(MediaType.APPLICATION_JSON)
public class EnergyResource {
    
    @Inject
    private EnergyService energyService;
    
    private static final DateTimeFormatter formatter = DateTimeFormatter.ISO_DATE_TIME;
    
    @GET
    @Path("/appliance/{id}/history")
    public Response getApplianceHistory(@PathParam("id") Long applianceId) {
        List<EnergyEntry> history = energyService.getApplianceHistory(applianceId);
        return Response.ok(history).build();
    }
    
    @GET
    @Path("/appliance/{id}/history/range")
    public Response getApplianceHistoryByTimeRange(
            @PathParam("id") Long applianceId,
            @QueryParam("start") String startStr,
            @QueryParam("end") String endStr) {
        
        LocalDateTime start = LocalDateTime.parse(startStr, formatter);
        LocalDateTime end = LocalDateTime.parse(endStr, formatter);
        
        List<EnergyEntry> history = energyService.getApplianceHistoryByTimeRange(applianceId, start, end);
        return Response.ok(history).build();
    }
    
    @POST
    @Path("/appliance/{id}/entry")
    public Response addEnergyEntry(@PathParam("id") Long applianceId, EnergyEntry entry) {
        energyService.addEnergyEntry(applianceId, entry);
        return Response.status(Response.Status.CREATED).build();
    }
    
    @GET
    @Path("/usage/{userId}")
    public Response getTotalUsage(@PathParam("userId") String userId) {
        double totalUsage = energyService.calculateTotalUsage(userId);
        return Response.ok(totalUsage).build();
    }
    
    @POST
    @Path("/cleanup")
    public Response cleanupOldData() {
        energyService.cleanupOldData();
        return Response.ok().build();
    }
}