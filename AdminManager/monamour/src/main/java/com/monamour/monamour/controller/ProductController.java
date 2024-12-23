package com.monamour.monamour.controller;


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
    @PostMapping("/createProduct")
    public ResponseEntity<Product> createProduct (@RequestBody ProductCreate productCreate) {
        Product product = productService.createProduct(productCreate);
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
