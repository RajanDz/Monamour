package com.monamour.monamour.service;


import com.monamour.monamour.dto.*;
import com.monamour.monamour.entities.*;
import com.monamour.monamour.repository.*;
import jakarta.transaction.Transactional;
import org.aspectj.weaver.ast.Not;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.File;
import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.time.Duration;
import java.time.LocalDateTime;
import java.util.*;
import java.util.stream.Collectors;

@Service
public class UserService {

    private final UserRepo userRepo;
    private final UserLogRepo userLogRepo;
    private final OrderRepo orderRepo;
    private final OrderedProductsRepo orderedProductsRepo;
    private final ProductRepo productRepo;
    private final NotificationRepo notificationRepo;
    private final PaymentsMethodRepo paymentsMethodRepo;
    private final PasswordEncoder passwordEncoder;
    public UserService(UserRepo userRepo, UserLogRepo userLogRepo, OrderRepo orderRepo, OrderedProductsRepo orderedProductsRepo, ProductRepo productRepo, NotificationRepo notificationRepo, PaymentsMethodRepo paymentsMethodRepo, PasswordEncoder passwordEncoder) {
        this.userRepo = userRepo;
        this.userLogRepo = userLogRepo;
        this.orderRepo = orderRepo;
        this.orderedProductsRepo = orderedProductsRepo;
        this.productRepo = productRepo;
        this.notificationRepo = notificationRepo;
        this.paymentsMethodRepo = paymentsMethodRepo;
        this.passwordEncoder = passwordEncoder;
    }
    private final String defaultPath = "C:/Users/Rajan/Desktop/Galerije";
    private final String profileImagePath = "C:/Users/Rajan/Desktop";


    public List<User> getAllUsers() {
        return userRepo.findAll();
    }
    public User findById (Integer id){
        return userRepo.findById(id).get();
    }
    public UserLog userLog (Integer userId){
        return userLogRepo.findByUserId(userId).orElseThrow();
    }
    public NotificationResponse getNotifications(int userId, int pageNo, int pageSize){
            Pageable pageable = PageRequest.of(pageNo,pageSize, Sort.by("dateOfNotication").descending());
            Page<Notification> notifications = notificationRepo.findByUserId(userId,pageable);
            if (pageNo >= notifications.getTotalPages()) {
                throw new RuntimeException("No more pages");
            }
            List<Notification> content = notifications.getContent();
            return new NotificationResponse(
                     content
                    ,notifications.getNumber()
                    ,notifications.getSize()
                    ,notifications.getNumberOfElements()
                    ,notifications.getTotalPages()
                    ,notifications.isLast()
            );
    }
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

                    if (findUser.get().getEmail() != userDetailsEdit.getEmail()) {
                            Optional<User> doesEmailExist = userRepo.findByEmail(userDetailsEdit.getEmail());
                        if (doesEmailExist.isPresent()) {
                        throw new RuntimeException("Email already exists!");
                    } else {
                        findUser.ifPresent(user -> user.setEmail(userDetailsEdit.getEmail()));
                        }
                    }
                }   if (userDetailsEdit.getPassword() != null && !userDetailsEdit.getPassword().isBlank()) {
                    findUser.get().setPassword(passwordEncoder.encode(userDetailsEdit.getPassword()));
                }
            }
            userRepo.save(findUser.get());
            return findUser.get();
    }
    public User changeProfileImage(Integer userId, MultipartFile file) throws IOException {
        Optional<User> findUser = userRepo.findById(userId);
        if (findUser.isPresent()) {
            if (defaultPath != null && !defaultPath.isBlank()) {
                if (file.getOriginalFilename() != null && !file.getOriginalFilename().isBlank()) {
                    String fileName = UUID.randomUUID() + "_" + file.getOriginalFilename();
                    Path filePath = Paths.get(defaultPath,fileName);
                    Files.copy(file.getInputStream(), filePath);

                    findUser.get().setProfileImage("/" + fileName);
                    userRepo.save(findUser.get());

                    Notification notification = new Notification();
                    notification.setUser(findUser.get());
                    notification.setMessage(NotificationMessage.PROFILE_PICTURE.getMessage());
                    notification.setDateOfNotication(LocalDateTime.now());
                    notificationRepo.save(notification);
                }
            }
        }
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


    @Transactional
    public String createOrder(CreateOrder createOrder){
        User user = userRepo.findById(createOrder.getUserId()).orElseThrow(() -> new RuntimeException("User not found"));
        PaymentsMethod paymentsMethod = paymentsMethodRepo.findById(createOrder.getCardId()).get();
            Order order = new Order();
            order.setUser(user);
            order.setPaymentsMethod(paymentsMethod);
            order.setCreatedAt(LocalDateTime.now());
            if (createOrder.getShippingAddress() != null && !createOrder.getShippingAddress().isBlank()) {
                order.setShippingAddress(createOrder.getShippingAddress());
            } else {
                throw new RuntimeException("Shipping address not found!");
            }
            if (createOrder.getPhoneNumber() != null && !createOrder.getPhoneNumber().isBlank()) {
                order.setContactNumber(createOrder.getPhoneNumber());
            } else {
                order.setContactNumber(user.getPhoneNumber());
            }
            order.setTotalPrice(createOrder.getTotalPrice());
            order.setStatus("PENDING");
            orderRepo.save(order);

            if(createOrder.getProducts().isEmpty()){
                throw new RuntimeException("Product list is empty!");
            }
            for (ProductShippingDetails product : createOrder.getProducts()) {
                Product findProduct = productRepo.findById(product.getProductId()).orElseThrow(() -> new RuntimeException("Product not found"));
                OrderedProducts orderedProducts = new OrderedProducts();
                orderedProducts.setOrder(order);
                orderedProducts.setUser(user);
                orderedProducts.setProduct(findProduct);
                orderedProducts.setQuantity(product.getQuantity());
                orderedProductsRepo.save(orderedProducts);
        }

            Notification notification = new Notification();
            notification.setUser(user);
            notification.setMessage(NotificationMessage.ORDER.getMessage());
            notification.setDateOfNotication(LocalDateTime.now());
            notificationRepo.save(notification);

        return "Successfully created";
    }
    public OrderResponse getOrders(int userId,int pageNo, int pageSize) {
        Pageable pageable = PageRequest.of(pageNo,pageSize);
        User user = userRepo.findById(userId).orElseThrow(() -> new RuntimeException("User not found"));
        Page<Order> getOrders = orderRepo.findByUserAndStatus(user,"PENDING", pageable);
        if (pageNo >= getOrders.getTotalPages()) {
            throw new RuntimeException("Out of pages");
        }
        List<OrderDto> orderDto = getOrders.stream().map(order -> OrderDto.formOrder(order)).toList();
        return new OrderResponse(orderDto,getOrders.getNumber(),getOrders.getSize(),getOrders.getNumberOfElements(),getOrders.getTotalPages(),getOrders.isLast());
    }

    public List<Product> getProduct(Integer orderId) {
        return  orderedProductsRepo.findByOrderId(orderId).stream().map(orderedProducts -> orderedProducts.getProduct()).collect(Collectors.toList());
    }
    public PaymentsMethod addPaymentMethod(CreatePayment createPayment){
        User user = userRepo.findById(createPayment.getUserId()).get();

        PaymentsMethod paymentsMethod = new PaymentsMethod();

        paymentsMethod.setCardHolderName(createPayment.getCardHolderName());
        paymentsMethod.setCardNumber(createPayment.getCardNumber());
        paymentsMethod.setExDate(createPayment.getExDate());
        paymentsMethod.setTypeOfCard(createPayment.getTypeOfCard());
        paymentsMethod.setCvv(createPayment.getCvv());
        paymentsMethod.setUser(user);
        paymentsMethodRepo.save(paymentsMethod);

        Notification notification = new Notification();
        notification.setUser(user);
        notification.setMessage(NotificationMessage.ADDED_CARD.getMessage());
        notification.setDateOfNotication(LocalDateTime.now());
        notificationRepo.save(notification);

        return paymentsMethod;
    }

    public List<PaymentsMethod> getYourPayments(Integer userId) {
        User user = userRepo.findById(userId).get();
        return paymentsMethodRepo.findByUserId(user.getId());
   }

    public PaymentsMethod removeCreditCard( int cardId, int userId) {
        PaymentsMethod paymentsMethod = paymentsMethodRepo.findByIdAndUserId(cardId,userId)
                .orElseThrow(() -> new RuntimeException("Card not found"));
        paymentsMethodRepo.delete(paymentsMethod);
        return paymentsMethod;
    }
}
