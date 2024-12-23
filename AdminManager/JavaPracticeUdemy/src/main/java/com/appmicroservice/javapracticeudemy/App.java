package com.appmicroservice.javapracticeudemy;

import org.springframework.context.ApplicationContext;
import org.springframework.context.support.ClassPathXmlApplicationContext;

public class App {
    public static void main(String[] args) {
        ApplicationContext context = new ClassPathXmlApplicationContext("applicationLooseCoupling.xml");
        UserManager userManager = (UserManager) context.getBean("userManagerWithUserDataProvider");
        System.out.println(userManager.getUserDataProvider());
        UserManager userManager2 = (UserManager) context.getBean("userManagerWithUserDataWebService");
        System.out.println(userManager2.getUserDataProvider());
    }

}
