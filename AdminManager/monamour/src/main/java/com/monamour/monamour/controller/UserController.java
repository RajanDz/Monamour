package com.monamour.monamour.controller;


import com.monamour.monamour.dto.*;
import com.monamour.monamour.entities.*;
import com.monamour.monamour.service.RoleService;
import com.monamour.monamour.service.UserService;
import jakarta.servlet.http.HttpServletRequest;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.File;
import java.io.IOException;
import java.util.Base64;
import java.util.List;

@RestController()
@RequestMapping("/api")
@CrossOrigin(origins = "*") // Dozvoljava CORS za sve domene
public class UserController {

    private final UserService userService;

    public UserController(UserService userService) {
        this.userService = userService;
    }

//    @PreAuthorize("hasRole('Emplooyer')")
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

    @GetMapping("/info")
    public ResponseEntity<String> getRequestInfo(HttpServletRequest request, @RequestParam(name = "name") String name) {
        String method = request.getMethod();
        String url = String.valueOf(request.getRequestURL());
        String uri = request.getRequestURI();
        String queryString = request.getQueryString();
        String userAgent = request.getHeader("User-Agent");
        String ipAddress = request.getRemoteAddr();

        return ResponseEntity.ok("Method: " + method +
                "\nURL: " + url +
                "\nURI: " + uri +
                "\nQuery: " + queryString +
                "\nUser-Agent: " + userAgent +
                "\nIP: " + ipAddress);
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
    @GetMapping("/user/profile-image/{id}")
    public ResponseEntity<String> getProfileImage(@PathVariable Integer id) {
            String getImage = userService.getProfileImage(id);
            return ResponseEntity.ok(getImage);
    }
    @PostMapping("/editUserDetails")
    public ResponseEntity<User> editUserDetails(@RequestBody UserDetailsEdit userDetailsEdit) {
            User userDetailsEdit1 = userService.editUserDetails(userDetailsEdit);
            return ResponseEntity.ok(userDetailsEdit1);
    }
    @PostMapping("/uploadProfileImage")
    public ResponseEntity<User> uploadProfileImage(@RequestParam(name = "id") Integer userId, @RequestParam(name = "image") MultipartFile file) throws IOException {
        User uploadImage = userService.changeProfileImage(userId,file);
        return ResponseEntity.ok(uploadImage);
    }
    @GetMapping("/userLog/{id}")
    public ResponseEntity<UserLog> userActivity(@PathVariable Integer id) {
        UserLog userLog = userService.userLog(id);
        return ResponseEntity.ok(userLog);
    }
    @GetMapping("/sumOfNewUsers")
    public ResponseEntity<Integer> getSumOfNewUsers() {
        Integer sum = userService.sumOfUserRegisteredInLastMonth();
        return ResponseEntity.ok(sum);
    }
    @PostMapping("/findUsersByFilter")
    public ResponseEntity<List<User>> findUsersByFilter(@RequestParam(name = "userId",required = false) Integer userId, @RequestParam(name = "filter",required = false) String filter) {
        List<User> findUsers = userService.findUserByFilter(userId, filter);
        return ResponseEntity.ok(findUsers);
    }
    @PostMapping("/confirmCheckout")
    public ResponseEntity<String> confirmCheckout(@RequestBody CreateOrder createOrder) {
        String checkout = userService.createOrder(createOrder);
        return ResponseEntity.ok(checkout);
    }
    @GetMapping("/getOrders/{userId}")
    public ResponseEntity<List<Order>> getOrders(@PathVariable  Integer userId) {
        List<Order> order = userService.getOrders(userId);
        return ResponseEntity.ok(order);
    }
    @GetMapping("/getProductsOfOrder/{orderId}")
    public ResponseEntity<List<OrderedProducts>> getProductsOfOrder(@PathVariable Integer orderId) {
        List<OrderedProducts> products = userService.getProduct(orderId);
        return ResponseEntity.ok(products);
    }
    @GetMapping("/getUserNotifications/{id}")
    public ResponseEntity<List<Notification>> getUserNotifications(@PathVariable Integer id) {
        List<Notification> getNotifications = userService.getNotifications(id);
        return ResponseEntity.ok(getNotifications);
    }

}