package com.monamour.monamour.controller;


import com.monamour.monamour.dto.LoginCredentials;
import com.monamour.monamour.dto.LoginResponse;
import com.monamour.monamour.dto.Registration;
import com.monamour.monamour.entities.User;
import com.monamour.monamour.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.File;
import java.io.IOException;
import java.util.Base64;
import java.util.List;

@RestController()
@RequestMapping("/api")
public class UserController {

    private final UserService userService;

    public UserController(UserService userService) {
        this.userService = userService;
    }
    @GetMapping("/users")
    public ResponseEntity<List<User>> getAllUsers() {
        List<User> users = userService.getAllUsers();
        return ResponseEntity.ok(users);
    }
    @PostMapping("/testUpload")
    public ResponseEntity<String> testUpload(@RequestParam("file") MultipartFile file) throws IOException {
            String fName = file.getOriginalFilename();
            file.transferTo(new File("D:\\Upload\\" + fName));
            return ResponseEntity.ok("Uploaded");
    }
    @PostMapping("/register")
    public ResponseEntity<String> registerUser(
            @RequestParam String name,
            @RequestParam String lastname,
            @RequestParam String email,
            @RequestParam String phoneNumber,
            @RequestParam String password,
            @RequestParam MultipartFile profileImage) {

        Registration registration = new Registration();
        registration.setName(name);
        registration.setLastname(lastname);
        registration.setEmail(email);
        registration.setPhoneNumber(phoneNumber);
        registration.setPassword(password);

        try {
            String result = userService.registration(registration, profileImage);
            return ResponseEntity.ok(result);
        } catch (IOException e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Error occurred while saving user.");
        }
    }


    @PostMapping("/login")
    public ResponseEntity<LoginResponse> login(@RequestBody LoginCredentials loginCredentials) {
        LoginResponse user = userService.login(loginCredentials);
        return ResponseEntity.ok(user);
    }

    @GetMapping("/user/{id}")
    public ResponseEntity<User> getUserById(@PathVariable Integer id) {
        User user = userService.findById(id);
        return ResponseEntity.ok(user);
    }

    @GetMapping("/user/{id}/profile-image")
    public ResponseEntity<String> getProfileImage(@PathVariable Integer id) {
        byte[] image = userService.getProfileImage(id);

        if (image == null) {
            return ResponseEntity.notFound().build();
        }

        String base64Image = "data:image/jpeg;base64," + Base64.getEncoder().encodeToString(image);
        return ResponseEntity.ok(base64Image);
    }

}


