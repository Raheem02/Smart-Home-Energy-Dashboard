package com.smarthome.service;

import com.smarthome.dao.BudgetDAO;
import com.smarthome.model.Budget;

import javax.ejb.Stateless;
import javax.inject.Inject;

@Stateless
public class BudgetService {
    
    @Inject
    private BudgetDAO budgetDAO;
    
    public Budget getBudgetByUserId(String userId) {
        return budgetDAO.findByUserId(userId);
    }
    
    public void createBudget(Budget budget) {
        budgetDAO.create(budget);
    }
    
    public Budget updateBudget(Budget budget) {
        return budgetDAO.update(budget);
    }
    
    public void deleteBudget(Long id) {
        budgetDAO.delete(id);
    }
    
    public Budget setUserBudget(String userId, double dailyBudgetKwh) {
        Budget existingBudget = budgetDAO.findByUserId(userId);
        
        if (existingBudget != null) {
            existingBudget.setDailyBudgetKwh(dailyBudgetKwh);
            return budgetDAO.update(existingBudget);
        } else {
            Budget newBudget = new Budget(dailyBudgetKwh, userId);
            budgetDAO.create(newBudget);
            return newBudget;
        }
    }
}