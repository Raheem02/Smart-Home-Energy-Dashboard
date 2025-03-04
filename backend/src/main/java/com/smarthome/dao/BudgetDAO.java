package com.smarthome.dao;

import com.smarthome.model.Budget;

import javax.ejb.Stateless;
import javax.persistence.EntityManager;
import javax.persistence.NoResultException;
import javax.persistence.PersistenceContext;

@Stateless
public class BudgetDAO {
    
    @PersistenceContext(unitName = "energyPU")
    private EntityManager entityManager;
    
    public Budget findByUserId(String userId) {
        try {
            return entityManager.createQuery(
                    "SELECT b FROM Budget b WHERE b.userId = :userId", Budget.class)
                    .setParameter("userId", userId)
                    .getSingleResult();
        } catch (NoResultException e) {
            return null;
        }
    }
    
    public void create(Budget budget) {
        entityManager.persist(budget);
    }
    
    public Budget update(Budget budget) {
        return entityManager.merge(budget);
    }
    
    public void delete(Long id) {
        Budget budget = entityManager.find(Budget.class, id);
        if (budget != null) {
            entityManager.remove(budget);
        }
    }
}