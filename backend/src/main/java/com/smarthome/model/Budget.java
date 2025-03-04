package com.smarthome.model;

import javax.persistence.*;

@Entity
@Table(name = "budgets")
public class Budget {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @Column(name = "daily_budget_kwh", nullable = false)
    private double dailyBudgetKwh;
    
    @Column(name = "user_id", nullable = false)
    private String userId;
    
    public Budget() {
    }
    
    public Budget(double dailyBudgetKwh, String userId) {
        this.dailyBudgetKwh = dailyBudgetKwh;
        this.userId = userId;
    }
    
    // Getters and Setters
    
    public Long getId() {
        return id;
    }
    
    public void setId(Long id) {
        this.id = id;
    }
    
    public double getDailyBudgetKwh() {
        return dailyBudgetKwh;
    }
    
    public void setDailyBudgetKwh(double dailyBudgetKwh) {
        this.dailyBudgetKwh = dailyBudgetKwh;
    }
    
    public String getUserId() {
        return userId;
    }
    
    public void setUserId(String userId) {
        this.userId = userId;
    }
}