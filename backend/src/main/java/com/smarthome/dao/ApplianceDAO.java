package com.smarthome.dao;

import com.smarthome.model.Appliance;

import javax.ejb.Stateless;
import javax.persistence.EntityManager;
import javax.persistence.PersistenceContext;
import java.util.List;

@Stateless
public class ApplianceDAO {
    
    @PersistenceContext(unitName = "energyPU")
    private EntityManager entityManager;
    
    public List<Appliance> getAllAppliances() {
        return entityManager.createQuery("SELECT a FROM Appliance a", Appliance.class)
                .getResultList();
    }
    
    public Appliance findById(Long id) {
        return entityManager.find(Appliance.class, id);
    }
    
    public void create(Appliance appliance) {
        entityManager.persist(appliance);
    }
    
    public Appliance update(Appliance appliance) {
        return entityManager.merge(appliance);
    }
    
    public void delete(Long id) {
        Appliance appliance = findById(id);
        if (appliance != null) {
            entityManager.remove(appliance);
        }
    }
}