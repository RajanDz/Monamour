package com.appmicroservice.javapracticeudemy;

public class Car {

    private CarSpecification carSpecification;

    public Car (CarSpecification carSpecification) {
        this.carSpecification = carSpecification;
    }
    public String getCarSpecification() {
        return carSpecification.toString();
    }
}
