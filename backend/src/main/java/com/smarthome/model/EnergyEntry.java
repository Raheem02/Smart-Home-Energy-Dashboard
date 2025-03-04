package com.smarthome.model;

import javax.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "energy_entries")
public class EnergyEntry {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @Column(nullable = false)
    private LocalDateTime timestamp;
    
    @Column(name = "energy_kwh", nullable = false)
    private double energyKwh;
    
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "appliance_id")
    private Appliance appliance;
    
    public EnergyEntry() {
    }
    
    public EnergyEntry(LocalDateTime timestamp, double energyKwh) {
        this.timestamp = timestamp;
        this.energyKwh = energyKwh;
    }
    
    // Getters and Setters
    
    public Long getId() {
        return id;
    }
    
    public void setId(Long id) {
        this.id = id;
    }
    
    public LocalDateTime getTimestamp() {
        return timestamp;
    }
    
    public void setTimestamp(LocalDateTime timestamp) {
        this.timestamp = timestamp;
    }
    
    public double getEnergyKwh() {
        return energyKwh;
    }
    
    public void setEnergyKwh(double energyKwh) {
        this.energyKwh = energyKwh;
    }
    
    public Appliance getAppliance() {
        return appliance;
    }
    
    public void setAppliance(Appliance appliance) {
        this.appliance = appliance;
    }
}