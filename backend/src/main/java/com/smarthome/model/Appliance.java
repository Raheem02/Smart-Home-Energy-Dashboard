package com.smarthome.model;

import javax.persistence.*;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "appliances")
public class Appliance {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @Column(nullable = false)
    private String name;
    
    @Column(nullable = false)
    private String icon;
    
    @Column(name = "current_power_kw", nullable = false)
    private double currentPowerKw;
    
    @OneToMany(mappedBy = "appliance", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<EnergyEntry> history = new ArrayList<>();
    
    public Appliance() {
    }
    
    public Appliance(String name, String icon, double currentPowerKw) {
        this.name = name;
        this.icon = icon;
        this.currentPowerKw = currentPowerKw;
    }
    
    // Getters and Setters
    
    public Long getId() {
        return id;
    }
    
    public void setId(Long id) {
        this.id = id;
    }
    
    public String getName() {
        return name;
    }
    
    public void setName(String name) {
        this.name = name;
    }
    
    public String getIcon() {
        return icon;
    }
    
    public void setIcon(String icon) {
        this.icon = icon;
    }
    
    public double getCurrentPowerKw() {
        return currentPowerKw;
    }
    
    public void setCurrentPowerKw(double currentPowerKw) {
        this.currentPowerKw = currentPowerKw;
    }
    
    public List<EnergyEntry> getHistory() {
        return history;
    }
    
    public void setHistory(List<EnergyEntry> history) {
        this.history = history;
    }
    
    public void addEnergyEntry(EnergyEntry entry) {
        history.add(entry);
        entry.setAppliance(this);
    }
    
    public void removeEnergyEntry(EnergyEntry entry) {
        history.remove(entry);
        entry.setAppliance(null);
    }
}