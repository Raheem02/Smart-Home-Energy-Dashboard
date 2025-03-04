package com.smarthome.service;

import com.smarthome.dao.ApplianceDAO;
import com.smarthome.model.Appliance;
import com.smarthome.model.EnergyEntry;

import javax.ejb.Stateless;
import javax.inject.Inject;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Random;

@Stateless
public class ApplianceService {
    
    @Inject
    private ApplianceDAO applianceDAO;
    
    private final Random random = new Random();
    
    public List<Appliance> getAllAppliances() {
        return applianceDAO.getAllAppliances();
    }
    
    public Appliance getApplianceById(Long id) {
        return applianceDAO.findById(id);
    }
    
    public void createAppliance(Appliance appliance) {
        applianceDAO.create(appliance);
    }
    
    public Appliance updateAppliance(Appliance appliance) {
        return applianceDAO.update(appliance);
    }
    
    public void deleteAppliance(Long id) {
        applianceDAO.delete(id);
    }
    
    public void updateAppliancePower(Long id, double newPower) {
        Appliance appliance = applianceDAO.findById(id);
        if (appliance != null) {
            appliance.setCurrentPowerKw(newPower);
            
            // Create a new energy entry
            double energyKwh = newPower * 0.25; // 15 minutes in hours
            EnergyEntry entry = new EnergyEntry(LocalDateTime.now(), energyKwh);
            appliance.addEnergyEntry(entry);
            
            applianceDAO.update(appliance);
        }
    }
    
    public void simulateDataUpdate() {
        List<Appliance> appliances = applianceDAO.getAllAppliances();
        for (Appliance appliance : appliances) {
            double currentValue = appliance.getCurrentPowerKw();
            double fluctuationFactor = 0.5 + random.nextDouble();
            double newPower = Math.max(0.05, currentValue * fluctuationFactor);
            
            updateAppliancePower(appliance.getId(), newPower);
        }
    }
    
    public void initializeDefaultAppliances() {
        if (applianceDAO.getAllAppliances().isEmpty()) {
            createDefaultAppliance("Refrigerator", "refrigerator", getRandomPower(0.1, 0.5));
            createDefaultAppliance("Television", "tv", getRandomPower(0.05, 0.3));
            createDefaultAppliance("Heater", "flame", getRandomPower(0.5, 1.5));
            createDefaultAppliance("Washing Machine", "washing-machine", getRandomPower(0.4, 1.2));
            createDefaultAppliance("Dishwasher", "utensils", getRandomPower(0.3, 1.0));
            createDefaultAppliance("Air Conditioner", "fan", getRandomPower(0.8, 2.0));
        }
    }
    
    private void createDefaultAppliance(String name, String icon, double power) {
        Appliance appliance = new Appliance(name, icon, power);
        applianceDAO.create(appliance);
    }
    
    private double getRandomPower(double min, double max) {
        return min + (max - min) * random.nextDouble();
    }
}