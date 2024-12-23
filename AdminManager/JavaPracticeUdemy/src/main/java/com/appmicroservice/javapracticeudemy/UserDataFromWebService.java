package com.appmicroservice.javapracticeudemy;

public class UserDataFromWebService implements UserDataProvider{
    @Override
    public String getUserName() {
        return "This user is coming from Web Service";
    }
}
