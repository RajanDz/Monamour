package com.monamour.monamour.service;


import com.monamour.monamour.dto.ProductCreate;
import com.monamour.monamour.dto.ProductDetails;
import com.monamour.monamour.dto.ProductsDeleteProcces;
import com.monamour.monamour.entities.Product;
import com.monamour.monamour.entities.ProductsActivityLog;
import com.monamour.monamour.entities.User;
import com.monamour.monamour.repository.ProductRepo;
import com.monamour.monamour.repository.ProductsActivityLogRepo;
import com.monamour.monamour.repository.UserRepo;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.*;

@Service
public class ProductService {

    private final ProductRepo productRepo;
    private final ProductsActivityLogRepo productsActivityLogRepo;
    private final UserRepo userRepo;
    public ProductService(ProductRepo productRepo, ProductsActivityLogRepo productsActivityLogRepo, UserRepo userRepo) {
        this.productRepo = productRepo;
        this.productsActivityLogRepo = productsActivityLogRepo;
        this.userRepo = userRepo;
    }
    public List<Product> getAllProducts() {
        return productRepo.findAllActiveProduct();
    }
    public Map<String,String> deleteProductById(ProductsDeleteProcces productsDeleteProcces){
        Product product = productRepo.findById(productsDeleteProcces.getProduct_id()).get();
        Optional<User> findUser = userRepo.findById(productsDeleteProcces.getUser_id());
        Map<String,String> map = new HashMap<>();
        if(findUser.isPresent()){
            User user = findUser.get();
            if (product != null) {
                ProductsActivityLog  activityLog = new ProductsActivityLog();
                activityLog.setUser(user);
                activityLog.setProduct(product);
                activityLog.setAction("One product is deleted");
                activityLog.setReason("None");
                activityLog.setTimestamp(LocalDateTime.now());
                product.setIsDeleted(true);
                productRepo.save(product);
                productsActivityLogRepo.save(activityLog);
                map.put("status", "success");
            }
        }

        map.put("status", "failed");
        return map;
    }
    public Map<String,String> deleteAll(ProductsDeleteProcces productsDeleteProcces){
        ProductsActivityLog activityLog = new ProductsActivityLog();
        User user = userRepo.findById(productsDeleteProcces.getUser_id()).orElseThrow();
        activityLog.setUser(user);
        activityLog.setProduct(null);
        activityLog.setAction("Delete all");
        activityLog.setTimestamp(LocalDateTime.now());
        activityLog.setReason(productsDeleteProcces.getReason());
        productsActivityLogRepo.save(activityLog);
        productRepo.softDeleteProducts();
        Map<String, String> response = new HashMap<>();
        response.put("message", "Products are deleted");
        return response;
    }
    public Product createProduct(ProductCreate productCreate){
        Product product = new Product();
        product.setName(productCreate.getName());
        product.setColor(productCreate.getColor());
        product.setSize(productCreate.getSize());
        product.setImage(productCreate.getImage());
        product.setPrice(productCreate.getPrice());
        product.setIsDeleted(false);
        return productRepo.save(product);
    }

    public Product editProductDetails (ProductDetails productDetails){
        Optional<Product> findProduct = productRepo.findById(productDetails.getId());
        if (findProduct.isPresent()) {
            Product product = findProduct.get();
            if (productDetails.getName() != null && !productDetails.getName().isEmpty()){
                product.setName(productDetails.getName());
            }
            if (productDetails.getColor() != null && !productDetails.getColor().isEmpty()){
                product.setColor(productDetails.getColor());
            }
            if (productDetails.getSize() != null && !productDetails.getSize().isEmpty()){
                product.setSize(productDetails.getSize());
            } else {
                throw new RuntimeException("Size can not be null");
            }
            if (productDetails.getImage() != null && !productDetails.getImage().isEmpty()){
                product.setImage(productDetails.getImage());
            }
            if (productDetails.getPrice() != null){
                product.setPrice(productDetails.getPrice());
            }
            return productRepo.save(product);
        }
        return null;
    }

    public List<ProductsActivityLog> getAllProductsActivityLog(){
        return productsActivityLogRepo.findAll();
    }
}
