package com.smarthome.dao;

import com.smarthome.model.EnergyEntry;

import javax.ejb.Stateless;
import javax.persistence.EntityManager;
import javax.persistence.PersistenceContext;
import java.time.LocalDateTime;
import java.util.List;

@Stateless
public class EnergyEntryDAO {
    
    @PersistenceContext(unitName = "energyPU")
    private EntityManager entityManager;
    
    public List<EnergyEntry> getEntriesByApplianceId(Long applianceId) {
        return entityManager.createQuery(
                "SELECT e FROM EnergyEntry e WHERE e.appliance.id = :applianceId ORDER BY e.timestamp",
                EnergyEntry.class)
                .setParameter("applianceId", applianceId)
                .getResultList();
    }
    
    public List<EnergyEntry> getEntriesByApplianceIdAndTimeRange(Long applianceId, LocalDateTime start, LocalDateTime end) {
        return entityManager.createQuery(
                "SELECT e FROM EnergyEntry e WHERE e.appliance.id = :applianceId " +
                "AND e.timestamp BETWEEN :start AND :end ORDER BY e.timestamp",
                EnergyEntry.class)
                .setParameter("applianceId", applianceId)
                .setParameter("start", start)
                .setParameter("end", end)
                .getResultList();
    }
    
    public void create(EnergyEntry entry) {
        entityManager.persist(entry);
    }
    
    public void deleteOldEntries(LocalDateTime cutoffTime) {
        entityManager.createQuery(
                "DELETE FROM EnergyEntry e WHERE e.timestamp < :cutoffTime")
                .setParameter("cutoffTime", cutoffTime)
                .executeUpdate();
    }
}