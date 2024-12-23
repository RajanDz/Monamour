package com.appmicroservice.javapracticeudemy;

public class UserDatabaseProvider implements UserDataProvider{
    @Override
    public String getUserName() {
        return "Ryan is coming from database provider";
    }
}
