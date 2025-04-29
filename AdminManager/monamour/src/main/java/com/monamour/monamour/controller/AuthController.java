package com.monamour.monamour.controller;


import com.monamour.monamour.dto.*;
import com.monamour.monamour.entities.Notification;
import com.monamour.monamour.entities.Role;
import com.monamour.monamour.entities.User;
import com.monamour.monamour.entities.UserLog;
import com.monamour.monamour.repository.NotificationRepo;
import com.monamour.monamour.repository.RoleRepo;
import com.monamour.monamour.repository.UserLogRepo;
import com.monamour.monamour.repository.UserRepo;
import com.monamour.monamour.responses.MessageResponse;
import com.monamour.monamour.security.jwt.JwtUtils;
import com.monamour.monamour.security.service.UserDetailsImpl;
import jakarta.servlet.http.Cookie;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseCookie;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.AuthenticationException;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.util.WebUtils;

import java.time.LocalDateTime;
import java.util.*;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/auth")
@CrossOrigin(origins = "*")
public class AuthController {
    @Autowired
    private JwtUtils jwtUtils;

    @Autowired
    private AuthenticationManager authenticationManager;
    private final  UserRepo userRepository;
    private final  UserLogRepo userLogRepository;
    private final RoleRepo roleRepository;
    private final NotificationRepo notificationRepository;
    @Autowired
    private PasswordEncoder encoder;

    public AuthController(UserRepo userRepository, UserLogRepo userLogRepository, RoleRepo roleRepository, NotificationRepo notificationRepository) {
        this.userRepository = userRepository;
        this.userLogRepository = userLogRepository;
        this.roleRepository = roleRepository;
        this.notificationRepository = notificationRepository;
    }


    @PostMapping("/signin")
    public ResponseEntity<?> authenticateUser(@RequestBody LoginRequest loginRequest) {
        Authentication authentication;

        try {
            authentication = authenticationManager
                    .authenticate(new UsernamePasswordAuthenticationToken(loginRequest.getUsername(), loginRequest.getPassword()));
        } catch (AuthenticationException exception) {
            Map<String, Object> map = new HashMap<>();
            map.put("message", "Bad credentials");
            map.put("status", false);
            return new ResponseEntity<Object>(map, HttpStatus.NOT_FOUND);
        }

        SecurityContextHolder.getContext().setAuthentication(authentication);

        UserDetailsImpl userDetails = (UserDetailsImpl) authentication.getPrincipal();

        ResponseCookie jwtCookie = jwtUtils.generateJwtCookie(userDetails);

        List<String> roles = userDetails.getAuthorities().stream()
                .map(item -> item.getAuthority())
                .collect(Collectors.toList());

        UserInfoResponse response = new UserInfoResponse(userDetails.getId(),
                userDetails.getUsername(), jwtCookie.toString(), roles);

        return ResponseEntity.ok().header(HttpHeaders.SET_COOKIE, jwtCookie.toString()).body(response);
    }
    @PostMapping("/signup")
    public ResponseEntity<?> userRegistration( @RequestBody SignupRequest signUpRequest) {
        if (userRepository.existsByUsername(signUpRequest.getUsername())) {
            return ResponseEntity.badRequest().body(new MessageResponse("Error: Username is already taken!"));
        }

        if (userRepository.existsByEmail(signUpRequest.getEmail())) {
            return ResponseEntity.badRequest().body(new MessageResponse("Error: Email is already in use!"));
        }

        User user = new User();
        user.setName(signUpRequest.getName());
        user.setLastname(signUpRequest.getLastname());
        user.setGender(signUpRequest.getGender());
        user.setPhoneNumber(signUpRequest.getPhoneNumber());
        user.setPassword(encoder.encode(signUpRequest.getPassword()));
        user.setEmail(signUpRequest.getEmail());
        user.setUsername(signUpRequest.getUsername());
        if (signUpRequest.getGender().equals("male")) {
            user.setProfileImage("/muska.png");
        }else if (signUpRequest.getGender().equalsIgnoreCase("female")){
            user.setProfileImage("/zenska.png");
        }

        Set<String> strRoles = signUpRequest.getRole();
        Set<Role> roles = new HashSet<>();

        if (strRoles == null) {
            Role userRole = roleRepository.findByName(AppRole.ROLE_Emplooyer.name())
                    .orElseThrow(() -> new RuntimeException("Error: Role is not found."));
            roles.add(userRole);
        }

        user.setRoles(roles);
        userRepository.save(user);

        UserLog userLog = new UserLog();
        userLog.setUser(user);
        userLog.setRegistrationDate(LocalDateTime.now());
        userLog.setLastLoginDate(LocalDateTime.now());
        userLogRepository.save(userLog);
        String username = user.getUsername() != null ? user.getUsername(): "Unknown username";
        Notification notification = new Notification();
        notification.setUser(user);
        notification.setMessage(NotificationMessage.REGISTERED.formatMessage(username));
        notification.setDateOfNotication(LocalDateTime.now());
        notificationRepository.save(notification);
        return ResponseEntity.ok(new MessageResponse("User registered successfully!"));
    }
    @GetMapping("/logout")
    public ResponseEntity<String> logout() {
        ResponseCookie cookie = jwtUtils.logout();

        return ResponseEntity.ok()
                .header(HttpHeaders.SET_COOKIE, cookie.toString())

                .body("You have been logged out successfully");
    }

    @GetMapping("/getUsernameFromTokenFromCookie")
    public ResponseEntity<User> getUserFromToken(HttpServletRequest request){
        User retriveUser = jwtUtils.getUserFromJwtToken(request);
        return ResponseEntity.ok(retriveUser);
    }
}