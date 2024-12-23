package com.monamour.monamour;

import com.monamour.monamour.entities.Role;
import com.monamour.monamour.entities.User;
import com.monamour.monamour.repository.RoleRepo;
import com.monamour.monamour.repository.UserRepo;
import org.junit.jupiter.api.Test;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;

import java.util.HashSet;
import java.util.Optional;
import java.util.Set;

@SpringBootTest(classes = MonamourApplication.class)
public class UserTest {

    private static Logger logger = LoggerFactory.getLogger(UserTest.class);
    @Autowired
    private UserRepo userRepo;
    @Autowired
    private RoleRepo roleRepo;
    @Test
    void registration(){
        User user = new User();
        user.setName("Marko");
        user.setLastname("Markovic");
        user.setEmail("marko123@monamour.com");
        user.setPassword("Marko123");
        user.setPhoneNumber("067 152 370");
        logger.info(user.toString());
        userRepo.save(user);
    }

    @Test
    void addRoleToUser(){
        Optional<User> user = userRepo.findById(1);
        Optional<Role> findRole = roleRepo.findById(1);
        Set<Role> roles = new HashSet<>();
        roles.add(findRole.get());
        user.get().setRoles(roles);
        userRepo.save(user.get());
    }

    @Test
    void findUser(){
        Optional<User> user = userRepo.findById(1);
        logger.info(String.valueOf(user.get()));
    }
}
