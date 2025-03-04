package com.smarthome.service;

import com.smarthome.dao.ApplianceDAO;
import com.smarthome.dao.EnergyEntryDAO;
import com.smarthome.model.Appliance;
import com.smarthome.model.EnergyEntry;

import javax.ejb.Stateless;
import javax.inject.Inject;
import java.time.LocalDateTime;
import java.util.List;

@Stateless
public class EnergyService {
    
    @Inject
    private EnergyEntryDAO energyEntryDAO;
    
    @Inject
    private ApplianceDAO applianceDAO;
    
    public List<EnergyEntry> getApplianceHistory(Long applianceId) {
        return energyEntryDAO.getEntriesByApplianceId(applianceId);
    }
    
    public List<EnergyEntry> getApplianceHistoryByTimeRange(Long applianceId, LocalDateTime start, LocalDateTime end) {
        return energyEntryDAO.getEntriesByApplianceIdAndTimeRange(applianceId, start, end);
    }
    
    public void addEnergyEntry(Long applianceId, EnergyEntry entry) {
        Appliance appliance = applianceDAO.findById(applianceId);
        if (appliance != null) {
            entry.setAppliance(appliance);
            energyEntryDAO.create(entry);
        }
    }
    
    public double calculateTotalUsage(String userId) {
        // In a real application, you would filter by user ID
        // For simplicity, we'll calculate total usage across all appliances
        List<Appliance> appliances = applianceDAO.getAllAppliances();
        double totalUsage = 0.0;
        
        LocalDateTime oneDayAgo = LocalDateTime.now().minusDays(1);
        
        for (Appliance appliance : appliances) {
            List<EnergyEntry> entries = energyEntryDAO.getEntriesByApplianceIdAndTimeRange(
                    appliance.getId(), oneDayAgo, LocalDateTime.now());
            
            for (EnergyEntry entry : entries) {
                totalUsage += entry.getEnergyKwh();
            }
        }
        
        return totalUsage;
    }
    
    public void cleanupOldData() {
        // Remove data older than 7 days
        LocalDateTime cutoffTime = LocalDateTime.now().minusDays(7);
        energyEntryDAO.deleteOldEntries(cutoffTime);
    }
}