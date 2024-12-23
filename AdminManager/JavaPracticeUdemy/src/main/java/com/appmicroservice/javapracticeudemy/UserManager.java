package com.appmicroservice.javapracticeudemy;

public class UserManager {
    private UserDataProvider userDataProvider;

    public UserManager(UserDataProvider userDataProvider) {
        this.userDataProvider = userDataProvider;
    }
    public String getUserDataProvider() {
        return userDataProvider.getUserName();
    }
}
