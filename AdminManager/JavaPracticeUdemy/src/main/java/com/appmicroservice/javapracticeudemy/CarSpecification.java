package com.appmicroservice.javapracticeudemy;

public class CarSpecification {
    private String brand;
    private String model;

    public void setBrand(String brand) {
        this.brand = brand;
    }
    public void setModel(String model) {
        this.model = model;
    }

    @Override
    public String toString() {
        return "Brand: " + brand + ", Model: " + model;
    }
}
