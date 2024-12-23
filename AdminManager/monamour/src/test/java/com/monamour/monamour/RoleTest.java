package com.monamour.monamour;

import com.monamour.monamour.entities.Role;
import com.monamour.monamour.repository.RoleRepo;
import org.junit.jupiter.api.Test;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;

@SpringBootTest(classes = MonamourApplication.class)
public class RoleTest {

    private static Logger logger = LoggerFactory.getLogger(UserTest.class);
    @Autowired
    private RoleRepo roleRepo;


    @Test
    void createRole() {
        Role role = new Role();
        role.setName("Manager");
        role.setDescription("Manager is the one who can control all the features in app and manage them");
        roleRepo.save(role);
    }
}
