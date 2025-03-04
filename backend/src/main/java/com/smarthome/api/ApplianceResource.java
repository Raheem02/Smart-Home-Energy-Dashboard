package com.smarthome.api;

import com.smarthome.model.Appliance;
import com.smarthome.service.ApplianceService;

import javax.inject.Inject;
import javax.ws.rs.*;
import javax.ws.rs.core.MediaType;
import javax.ws.rs.core.Response;
import java.util.List;

@Path("/appliances")
@Produces(MediaType.APPLICATION_JSON)
@Consumes(MediaType.APPLICATION_JSON)
public class ApplianceResource {
    
    @Inject
    private ApplianceService applianceService;
    
    @GET
    public Response getAllAppliances() {
        List<Appliance> appliances = applianceService.getAllAppliances();
        return Response.ok(appliances).build();
    }
    
    @GET
    @Path("/{id}")
    public Response getApplianceById(@PathParam("id") Long id) {
        Appliance appliance = applianceService.getApplianceById(id);
        if (appliance != null) {
            return Response.ok(appliance).build();
        } else {
            return Response.status(Response.Status.NOT_FOUND).build();
        }
    }
    
    @POST
    public Response createAppliance(Appliance appliance) {
        applianceService.createAppliance(appliance);
        return Response.status(Response.Status.CREATED).entity(appliance).build();
    }
    
    @PUT
    @Path("/{id}")
    public Response updateAppliance(@PathParam("id") Long id, Appliance appliance) {
        appliance.setId(id);
        Appliance updated = applianceService.updateAppliance(appliance);
        return Response.ok(updated).build();
    }
    
    @DELETE
    @Path("/{id}")
    public Response deleteAppliance(@PathParam("id") Long id) {
        applianceService.deleteAppliance(id);
        return Response.noContent().build();
    }
    
    @PUT
    @Path("/{id}/power")
    public Response updateAppliancePower(@PathParam("id") Long id, @QueryParam("power") double power) {
        applianceService.updateAppliancePower(id, power);
        return Response.ok().build();
    }
    
    @POST
    @Path("/simulate")
    public Response simulateDataUpdate() {
        applianceService.simulateDataUpdate();
        return Response.ok().build();
    }
    
    @POST
    @Path("/initialize")
    public Response initializeDefaultAppliances() {
        applianceService.initializeDefaultAppliances();
        return Response.ok().build();
    }
}