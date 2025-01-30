package com.monamour.monamour.controller;


import com.monamour.monamour.dto.ImageResponse;
import com.monamour.monamour.dto.ProductCreate;
import com.monamour.monamour.dto.ProductDetails;
import com.monamour.monamour.dto.ProductsDeleteProcces;
import com.monamour.monamour.entities.Product;
import com.monamour.monamour.entities.ProductsActivityLog;
import com.monamour.monamour.repository.ProductRepo;
import com.monamour.monamour.service.ProductService;
import org.apache.coyote.Response;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.HashMap;
import java.util.List;
import java.util.Map;


@RestController()
@RequestMapping("/api")
public class ProductController {

    private final ProductService productService;
    private final ProductRepo productRepo;


    public ProductController(ProductService productService, ProductRepo productRepo) {
        this.productService = productService;
        this.productRepo = productRepo;
    }
    @GetMapping("/findProduct/{id}")
    public ResponseEntity<Product> findProduct(@PathVariable Integer id) {
        return ResponseEntity.ok(productRepo.findById(id).orElseThrow());
    }
    @GetMapping("/products")
    public ResponseEntity<List<Product>> getAllProducts() {
        List<Product> product = productService.getAllProducts();
        return ResponseEntity.ok(product);
    }
    @PostMapping("/deleteAllProducts")
    public ResponseEntity<Map<String,String>> deleteAllProducts(@RequestBody ProductsDeleteProcces productsDeleteProcces) {
        Map<String, String> response = productService.deleteAll(productsDeleteProcces); 
        return ResponseEntity.ok(response);
    }
    @PostMapping("/deleteOneProduct")
    public ResponseEntity<Map<String,String>> deleteOneProduct(@RequestBody ProductsDeleteProcces productsDeleteProcces) {
        Map<String,String> response = productService.deleteProductById(productsDeleteProcces);
        return ResponseEntity.ok(response);
    }
    @GetMapping("/productsImage/{id}")
    public ResponseEntity<List<String>> getProductImage(@PathVariable Integer id) throws IOException {
        List<String> image = productService.getProductImages(id);
        return ResponseEntity.ok(image);
    }
    @GetMapping("/productMainImage")
    public ResponseEntity<List<ImageResponse>> getProductMainImage() throws IOException {
        List<ImageResponse> mainImage = productService.getMainImage();
        return ResponseEntity.ok(mainImage);
    }
    @PostMapping("/createProduct")
    public ResponseEntity<Product> createProduct (@RequestParam(name = "name") String name,
                                                  @RequestParam("color") String color,
                                                  @RequestParam(name = "size") String size,
                                                  @RequestParam("price") Double price,
                                                  @RequestParam("images")MultipartFile [] images) throws IOException{
        Product product = productService.createProduct(name,color,size,price,images);
        return ResponseEntity.ok(product);
    }
    @PostMapping("/editProductDetaoils")
    public ResponseEntity<Product> editProductDetails (@RequestBody ProductDetails productDetails) {
        Product product = productService.editProductDetails(productDetails);
        return ResponseEntity.ok(product);
    }
    @GetMapping("/productLogs")
    public ResponseEntity<List<ProductsActivityLog>> getAllProductLogs () {
        List<ProductsActivityLog> logs = productService.getAllProductsActivityLog();
        return ResponseEntity.ok(logs);
    }
}
