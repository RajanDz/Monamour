package com.monamour.monamour.service;


import com.monamour.monamour.dto.*;
import com.monamour.monamour.entities.*;
import com.monamour.monamour.repository.*;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.File;
import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.time.Duration;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.Base64;
import java.util.List;
import java.util.Optional;

@Service
public class UserService {

    private final UserRepo userRepo;
    private final UserLogRepo userLogRepo;
    private final OrderRepo orderRepo;
    private final OrderedProductsRepo orderedProductsRepo;
    private final ProductRepo productRepo;
    public UserService(UserRepo userRepo, UserLogRepo userLogRepo, OrderRepo orderRepo, OrderedProductsRepo orderedProductsRepo, ProductRepo productRepo) {
        this.userRepo = userRepo;
        this.userLogRepo = userLogRepo;
        this.orderRepo = orderRepo;
        this.orderedProductsRepo = orderedProductsRepo;
        this.productRepo = productRepo;
    }
    public List<User> getAllUsers() {
        return userRepo.findAll();
    }
    public User findById (Integer id){
        return userRepo.findById(id).get();
    }
    public UserLog userLog (Integer userId){
        return userLogRepo.findByUserId(userId).orElseThrow();
    }
    private String defaultPath = "C:/Users/Rajan/Desktop/Galerije";

    public String getProfileImage(Integer userId) {
        Optional<User> findUser = userRepo.findById(userId);
        if (findUser.isPresent()) {
            System.out.println(findUser.get().getProfileImage());
            System.out.println("Real path" + " C:/Users/Rajan/Desktop/Galerija"+ findUser.get().getProfileImage());
            File file = new File(defaultPath +findUser.get().getProfileImage());
            try {
                byte [] imageBytes = Files.readAllBytes(file.toPath());
                String base64Image = "data:image/png;base64," + Base64.getEncoder().encodeToString(imageBytes);
                return base64Image;
            }catch (Exception e) {
                e.printStackTrace();
            }
        }
        return null;
    }
    public String registration (Registration registration) throws IOException {
        User user = new User();
        user.setName(registration.getName());
        user.setLastname(registration.getLastname());
        user.setPhoneNumber(registration.getPhoneNumber());
        user.setPassword(registration.getPassword());
        user.setEmail(registration.getEmail());
        user.setGender(registration.getGender());

        if (registration.getGender().equalsIgnoreCase("male")){
            user.setProfileImage("/muska.png");
        } else if (registration.getGender().equalsIgnoreCase("female")){
            user.setProfileImage("/zenska.png");

        }
        UserLog userLog = new UserLog();
        userLog.setUser(user);
        userLog.setRegistrationDate(LocalDateTime.now());
        userRepo.save(user);
        userLogRepo.save(userLog);
        return "Successfully registered";
    }
    public LoginResponse login(LoginCredentials loginCredentials) {
        Optional<User> user = userRepo.findByEmail(loginCredentials.getEmail());
        Optional<UserLog> userLog = userLogRepo.findByUserId(user.get().getId());
        if (user.isPresent()) {
            if (user.get().getPassword().equals(loginCredentials.getPassword())) {
                userLog.get().setLastLoginDate(LocalDateTime.now());
                userLogRepo.save(userLog.get());
                return new LoginResponse(user.get(),"Successfully logged in");
            }
            throw new RuntimeException("Wrong password!!");
        }
        return null;
    }

    public User editUserDetails(UserDetailsEdit userDetailsEdit){
            Optional<User> findUser = userRepo.findById(userDetailsEdit.getId());
            if (findUser.isPresent()) {
                if (userDetailsEdit.getName() != null && !userDetailsEdit.getName().isBlank()) {
                    findUser.get().setName(userDetailsEdit.getName());
                }  if (userDetailsEdit.getLastname() != null && !userDetailsEdit.getLastname().isBlank()) {
                        findUser.get().setLastname(userDetailsEdit.getLastname());
                }  if (userDetailsEdit.getEmail() != null && !userDetailsEdit.getEmail().isBlank()) {
                    findUser.get().setEmail(userDetailsEdit.getEmail());
                }   if (userDetailsEdit.getPhoneNumber() != null && !userDetailsEdit.getPhoneNumber().isBlank()) {
                    findUser.get().setPhoneNumber(userDetailsEdit.getPhoneNumber());
                }
            }
            userRepo.save(findUser.get());
            return findUser.get();
    }
    public List<User> findUserByFilter(Integer userId, String input){
        List<User> users = new ArrayList<>();
         if (userId != null){
             Optional<User> findUserById = userRepo.findById(userId);
             if (findUserById.isPresent()) {
                 users.add(findUserById.get());
             }
         } else if (input != null && !input.isEmpty()) {
                if (isEmail(input)){
                    Optional<User> findUserByEmail = userRepo.findByEmail(input);
                    if (findUserByEmail.isPresent()) {
                        users.add(findUserByEmail.get());
                    }
                } else {
                    List<User> findByNameOrLastname = userRepo.findByNameOrLastname(input,input);
                    if (!findByNameOrLastname.isEmpty()) {
                        for (User user : findByNameOrLastname) {
                            users.add(user);
                        }
                    }
                }
        }
             return users;
    }
    public Integer sumOfUserRegisteredInLastMonth(){
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
        return sum;
    }


    public boolean isEmail(String input){
        return input.contains("@");
    }


    public String createOrder(CreateOrder createOrder){
        User user = userRepo.findById(createOrder.getUserId()).get();
        Order order = new Order();
        order.setUser(user);
        order.setCreatedAt(LocalDateTime.now());
        order.setShippingAddress(createOrder.getShippingAddress());
        order.setTotalPrice(createOrder.getTotalPrice());
        order.setStatus("PENDING");
        orderRepo.save(order);


        for (ProductShippingDetails product : createOrder.getProducts()) {
            Product findProduct = productRepo.findById(product.getProductId()).get();
            OrderedProducts orderedProducts = new OrderedProducts();
            orderedProducts.setOrder(order);
            orderedProducts.setProduct(findProduct);
            orderedProducts.setQuantity(product.getQuantity());
            orderedProducts.setPriceOfProducts(findProduct.getPrice());
            orderedProductsRepo.save(orderedProducts);
        }
        return "Successfully created";
    }
    public List<Order> getOrders(Integer userId) {
        User user = userRepo.findById(userId).get();
        List<Order> getOrders = orderRepo.findByUserAndStatus(user,"PENDING");
        return getOrders;
    }

    public List<OrderedProducts> getProduct(Integer orderId) {
        return  orderedProductsRepo.findByOrderId(orderId);
    }

}
