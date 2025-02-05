package com.monamour.monamour.service;


import com.monamour.monamour.dto.ImageResponse;
import com.monamour.monamour.dto.MainImageResponse;
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
import org.springframework.http.HttpStatus;
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
import java.util.stream.Stream;

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
    public Map<String,String> deleteAll(ProductsDeleteProcces productsDeleteProcces) throws IOException {
        ProductsActivityLog activityLog = new ProductsActivityLog();
        User user = userRepo.findById(productsDeleteProcces.getUser_id()).orElseThrow();
            if (user != null) {
                activityLog.setUser(user);
                activityLog.setProduct(null);
                activityLog.setAction("Delete all");
                activityLog.setTimestamp(LocalDateTime.now());
                activityLog.setReason(productsDeleteProcces.getReason());
                productsActivityLogRepo.save(activityLog);
                productRepo.softDeleteProducts();
                productImagesRepo.deleteAll();


                Path folderPath = Paths.get(defaultPath);
                try (Stream<Path> files = Files.list(folderPath) ){
                    files.filter(Files::isRegularFile)
                            .forEach(path -> {
                                try {
                                    Files.delete(path);
                                } catch (IOException e) {
                                    throw new RuntimeException(e);
                                }
                            });
                     }
            }

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
    public List<MainImageResponse> getMainImage() throws IOException {
        List<ProductImage> productImage = productImagesRepo.findByIsMain(true);
        List<MainImageResponse> base64Images = new ArrayList<>();
        for (ProductImage productImage1: productImage){
                File file = new File(productImage1.getImagePath());
                if (!file.exists()){
                    throw new FileNotFoundException();
                }
                byte [] imageBytes = Files.readAllBytes(file.toPath());
                String base64Image = "data:image/png;base64," + Base64.getEncoder().encodeToString(imageBytes);
            MainImageResponse imageResponse = new MainImageResponse();
            imageResponse.setProductId(productImage1.getProduct().getId());
            imageResponse.setBase64Image(base64Image);
                base64Images.add(imageResponse);
            }
        return base64Images;
    }
    public List<ImageResponse> getProductImages(Integer product_id) throws IOException {
        List<ProductImage> productImages = productImagesRepo.findByProductId(product_id);
        Set<String> uniqueBase64Images = new HashSet<>();  // Koristi Set da izbegneš duplikate
        List<ImageResponse> imageResponses = new ArrayList<>();

        for (ProductImage productImage2 : productImages) {
            File file = new File(productImage2.getImagePath());
            byte[] imageBytes = Files.readAllBytes(file.toPath());
            String base64Image = "data:image/png;base64," + Base64.getEncoder().encodeToString(imageBytes);

            // Ako je slika već dodata, preskoči je
            if (uniqueBase64Images.add(base64Image)) {
                imageResponses.add(new ImageResponse(productImage2.getId(), base64Image));
            }
        }

        return imageResponses;
    }

    public Product editProductDetails (Integer id,String name, String color, String size, Double price, MultipartFile [] images, Integer replacedImageId) throws IOException {
        Optional<Product> findProduct = productRepo.findById(id);
        if (findProduct.isPresent()) {
            Product product = findProduct.get();
            if (name != null && !name.isEmpty()){
                product.setName(name);
            }
            if (color != null && !color.isEmpty()){
                product.setColor(color);
            }
            if (size != null && !size.isEmpty()){
                product.setSize(size);
            } else {
                throw new RuntimeException("Size can not be null");
            }
            if (price != null){
                product.setPrice(price);
            }
            if (images != null && images.length > 0){
                for (MultipartFile image: images){
                    if (image != null && !image.isEmpty()){
                        String fileName = UUID.randomUUID() + "_" + image.getOriginalFilename();
                        Path filePath = Paths.get(defaultPath,fileName);
                        Files.copy(image.getInputStream(), filePath);

                        ProductImage productImage = new ProductImage();
                        productImage.setProduct(product);
                        productImage.setImagePath(filePath.toString());
                        productImage.setMain(false);
                        productImagesRepo.save(productImage);
                        productImagesRepo.deleteById(replacedImageId);
                    }
                }
            }

            return productRepo.save(product);
        }
        return null;
    }
    public ProductImage uploadPhoto (Integer productId,MultipartFile [] image) throws IOException {
        Optional<Product> findProduct = productRepo.findById(productId);
        if (findProduct.isPresent()) {
            if (image != null && image.length > 0){
                for (MultipartFile file : image){
                    String fileName = UUID.randomUUID() + "_" + file.getOriginalFilename();
                    Path filePath = Paths.get(defaultPath,fileName);
                    Files.copy(file.getInputStream(),filePath);

                    ProductImage productImage = new ProductImage();
                    productImage.setProduct(findProduct.get());
                    productImage.setImagePath(filePath.toString());
                    productImage.setMain(false);
                    productImagesRepo.save(productImage);
                    return  productImage;
                }
            } else{
                throw new RuntimeException("Image can not be added!");

            }
        } else  {
            throw new RuntimeException("Product does not exist!");
        }
        return null;
    }
    public ProductImage deleteImage(Integer imageId) throws IOException {
        ProductImage productImage = productImagesRepo.findById(imageId).get();
        if (productImage != null) {
            productImagesRepo.deleteById(productImage.getId());
        }
        return productImage;
    }
    public List<ProductsActivityLog> getAllProductsActivityLog(){
        return productsActivityLogRepo.findAll();
    }
}
