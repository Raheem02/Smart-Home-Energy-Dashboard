package com.smarthome.api;

import com.smarthome.model.Budget;
import com.smarthome.service.BudgetService;

import javax.inject.Inject;
import javax.ws.rs.*;
import javax.ws.rs.core.MediaType;
import javax.ws.rs.core.Response;

@Path("/budgets")
@Produces(MediaType.APPLICATION_JSON)
@Consumes(MediaType.APPLICATION_JSON)
public class BudgetResource {
    
    @Inject
    private BudgetService budgetService;
    
    @GET
    @Path("/{userId}")
    public Response getBudgetByUserId(@PathParam("userId") String userId) {
        Budget budget = budgetService.getBudgetByUserId(userId);
        if (budget != null) {
            return Response.ok(budget).build();
        } else {
            return Response.status(Response.Status.NOT_FOUND).build();
        }
    }
    
    @POST
    @Path("/{userId}")
    public Response setUserBudget(@PathParam("userId") String userId, @QueryParam("budget") double dailyBudgetKwh) {
        Budget budget = budgetService.setUserBudget(userId, dailyBudgetKwh);
        return Response.ok(budget).build();
    }
    
    @PUT
    @Path("/{id}")
    public Response updateBudget(@PathParam("id") Long id, Budget budget) {
        budget.setId(id);
        Budget updated = budgetService.updateBudget(budget);
        return Response.ok(updated).build();
    }
    
    @DELETE
    @Path("/{id}")
    public Response deleteBudget(@PathParam("id") Long id) {
        budgetService.deleteBudget(id);
        return Response.noContent().build();
    }
}