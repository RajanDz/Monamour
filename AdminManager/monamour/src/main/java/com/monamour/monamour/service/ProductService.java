package com.monamour.monamour.service;


import com.monamour.monamour.dto.ImageResponse;
import com.monamour.monamour.dto.ProductDetails;
import com.monamour.monamour.dto.ProductsDeleteProcces;
import com.monamour.monamour.entities.Product;
import com.monamour.monamour.entities.ProductImage;
import com.monamour.monamour.entities.ProductsActivityLog;
import com.monamour.monamour.entities.User;
import com.monamour.monamour.repository.ProductImagesRepo;
import com.monamour.monamour.repository.ProductRepo;
import com.monamour.monamour.repository.ProductsActivityLogRepo;
import com.monamour.monamour.repository.UserRepo;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.File;
import java.io.FileNotFoundException;
import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.time.LocalDateTime;
import java.util.*;

@Service
public class ProductService {

    private final ProductRepo productRepo;
    private final ProductsActivityLogRepo productsActivityLogRepo;
    private final UserRepo userRepo;
    private final ProductImagesRepo productImagesRepo;
    private final String defaultPath = "C:/Users/Rajan/Desktop/Galerija/productPhotos";
    public ProductService(ProductRepo productRepo, ProductsActivityLogRepo productsActivityLogRepo, UserRepo userRepo, ProductImagesRepo productImagesRepo) {
        this.productRepo = productRepo;
        this.productsActivityLogRepo = productsActivityLogRepo;
        this.userRepo = userRepo;
        this.productImagesRepo = productImagesRepo;
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
    public Product createProduct(String name, String color, String size, Double price, MultipartFile [] images) throws IOException {
        Product product = new Product();
        product.setName(name);
        product.setColor(color);
        product.setSize(size);
        product.setPrice(price);
        product.setIsDeleted(false);
        productRepo.save(product);

        boolean isFirst = true;
        for (MultipartFile file : images){
            String fileName = UUID.randomUUID() + "_" + file.getOriginalFilename();
            Path filePath = Paths.get(defaultPath,fileName);
            Files.copy(file.getInputStream(), filePath);

            ProductImage productImage1 = new ProductImage();
            productImage1.setProduct(product);
            productImage1.setImagePath(filePath.toString());
            if (isFirst){
                productImage1.setMain(true);
                isFirst = false;
            }
            productImagesRepo.save(productImage1);
        }
        return product;

    }
    public List<ImageResponse> getMainImage() throws IOException {
        List<ProductImage> productImage = productImagesRepo.findByIsMain(true);
        List<ImageResponse> base64Images = new ArrayList<>();
        for (ProductImage productImage1: productImage){
                File file = new File(productImage1.getImagePath());
                if (!file.exists()){
                    throw new FileNotFoundException();
                }
                byte [] imageBytes = Files.readAllBytes(file.toPath());
                String base64Image = "data:image/png;base64," + Base64.getEncoder().encodeToString(imageBytes);
                ImageResponse imageResponse = new ImageResponse();
                imageResponse.setBase64Image(base64Image);
                imageResponse.setProductId(productImage1.getProduct().getId());
                base64Images.add(imageResponse);
            }
        return base64Images;
    }
    public List<String> getProductImages(Integer product_id) throws IOException {
        List<ProductImage> productImages = productImagesRepo.findByProductId(product_id);
        List<String> base64Images = new ArrayList<>();
        for (ProductImage productImage2 : productImages){
            File file = new File(productImage2.getImagePath());
            byte[] imageBytes = Files.readAllBytes(file.toPath());
            String base64Image = "data:image/png;base64," + Base64.getEncoder().encodeToString(imageBytes);
            base64Images.add(base64Image);
        }
        return base64Images.isEmpty() ? null : base64Images;
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
