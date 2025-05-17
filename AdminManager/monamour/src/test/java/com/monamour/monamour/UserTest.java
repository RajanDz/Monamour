package com.monamour.monamour;

import com.monamour.monamour.entities.Notification;
import com.monamour.monamour.entities.Role;
import com.monamour.monamour.entities.User;
import com.monamour.monamour.entities.UserLog;
import com.monamour.monamour.repository.NotificationRepo;
import com.monamour.monamour.repository.RoleRepo;
import com.monamour.monamour.repository.UserLogRepo;
import com.monamour.monamour.repository.UserRepo;
import org.junit.jupiter.api.Test;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.security.crypto.password.PasswordEncoder;

import java.time.Duration;
import java.time.LocalDateTime;
import java.util.HashSet;
import java.util.List;
import java.util.Optional;
import java.util.Set;

@SpringBootTest(classes = MonamourApplication.class)
public class UserTest {

    private static Logger logger = LoggerFactory.getLogger(UserTest.class);
    @Autowired
    private UserRepo userRepo;
    @Autowired
    private RoleRepo roleRepo;
    @Autowired
    private UserLogRepo userLogRepo;
    @Autowired
    private PasswordEncoder passwordEncoder;
    @Autowired
    private NotificationRepo notificationRepo;
    @Test
    void registration(){
        User user = new User();
        user.setName("Darko");
        user.setLastname("Markovic");
        user.setUsername("Darko");
        user.setEmail("marko123@monamour.com");
        user.setPassword(passwordEncoder.encode("raki"));
        user.setPhoneNumber("067 152 370");
        logger.info(user.toString());
        userRepo.save(user);
    }

    @Test
    void addRoleToUser(){
        Optional<User> user = userRepo.findById(86);
        Optional<Role> findRole = roleRepo.findById(2);
        Set<Role> roles = new HashSet<>();
        roles.add(findRole.get());
        user.get().setRoles(roles);
        for (Role role : roles) {
            logger.info(role.toString());
        }
        userRepo.save(user.get());
    }

    @Test
    void findUser(){
        Optional<User> user = userRepo.findById(1);
        logger.info(String.valueOf(user.get()));
    }
    @Test
    void  sumOfUserRegisteredInLastMonth(){
        List<UserLog> allUsers = userLogRepo.findAll();
        LocalDateTime now = LocalDateTime.now();
        Integer sum = 0;
        for (UserLog user : allUsers) {
            Duration duration = Duration.between(user.getRegistrationDate(), now);
            if (duration.toDays() <= 30){
                sum++;
            }
        }
        System.out.println(sum);
    }
    @Test
    void changePassword(){
        Optional<User> user = userRepo.findById(83);
        if (user.isPresent()) {
            user.get().setPassword(passwordEncoder.encode("123"));
            userRepo.save(user.get());
        }
    }
    @Test
    void addNotification(){
        Optional<User> user = userRepo.findById(83);
        if (user.isPresent()) {
            int i = 0;
            while (i < 1000){
                Notification notification = new Notification();
                notification.setUser(user.get());
                notification.setMessage("Hello World");
                notification.setDateOfNotication(LocalDateTime.now());
                notificationRepo.save(notification);
                i++;
                System.out.println(i);
            }
        }
    }
}
