package com.smarthome.api;

import javax.ws.rs.ApplicationPath;
import javax.ws.rs.core.Application;
import java.util.HashSet;
import java.util.Set;

@ApplicationPath("/api")
public class ApplicationConfig extends Application {
    
    @Override
    public Set<Class<?>> getClasses() {
        Set<Class<?>> resources = new HashSet<>();
        
        // Add resource classes
        resources.add(ApplianceResource.class);
        resources.add(BudgetResource.class);
        resources.add(EnergyResource.class);
        
        // Add filters
        resources.add(CorsFilter.class);
        
        return resources;
    }
}