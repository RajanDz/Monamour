package com.monamour.monamour.service;


import com.monamour.monamour.dto.LoginCredentials;
import com.monamour.monamour.dto.LoginResponse;
import com.monamour.monamour.dto.Registration;
import com.monamour.monamour.entities.User;
import com.monamour.monamour.repository.UserRepo;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.List;
import java.util.Optional;

@Service
public class UserService {

    private final UserRepo userRepo;
    public UserService(UserRepo userRepo) {
        this.userRepo = userRepo;
    }
    public List<User> getAllUsers() {
        return userRepo.findAll();
    }
    public User findById (Integer id){
        return userRepo.findById(id).get();
    }
    public byte[] getProfileImage(Integer userId) {
        Optional<User> userOptional = userRepo.findById(userId);
        if (userOptional.isPresent()) {
            return userOptional.get().getProfileImage();
        }
        return null;
    }
    public String registration (Registration registration, MultipartFile profileImage) throws IOException {
        User user = new User();
        user.setName(registration.getName());
        user.setLastname(registration.getLastname());
        user.setPhoneNumber(registration.getPhoneNumber());
        user.setPassword(registration.getPassword());
        user.setEmail(registration.getEmail());
        if (profileImage != null) {
            user.setProfileImage(profileImage.getBytes());
        }
        userRepo.save(user);
        return "Successfully registered";
    }
    public LoginResponse login(LoginCredentials loginCredentials) {
        Optional<User> user = userRepo.findByEmail(loginCredentials.getEmail());
        if (user.isPresent()) {
            if (user.get().getPassword().equals(loginCredentials.getPassword())) {
                return new LoginResponse(user.get(),"Successfully logged in");
            }
            throw new RuntimeException("Wrong password!!");
        }
        return null;
    }
}
