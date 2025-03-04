package com.smarthome.util;

import com.smarthome.service.ApplianceService;

import javax.annotation.PostConstruct;
import javax.ejb.Singleton;
import javax.ejb.Startup;
import javax.inject.Inject;

@Singleton
@Startup
public class DatabaseInitializer {
    
    @Inject
    private ApplianceService applianceService;
    
    @PostConstruct
    public void init() {
        // Initialize default appliances if none exist
        applianceService.initializeDefaultAppliances();
    }
}