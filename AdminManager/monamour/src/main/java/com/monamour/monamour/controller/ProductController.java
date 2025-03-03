package com.monamour.monamour.controller;


import com.monamour.monamour.dto.*;
import com.monamour.monamour.entities.Product;
import com.monamour.monamour.entities.ProductImage;
import com.monamour.monamour.entities.ProductsActivityLog;
import com.monamour.monamour.repository.ProductRepo;
import com.monamour.monamour.service.ProductService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import java.io.IOException;
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
    public ResponseEntity<Map<String,String>> deleteAllProducts(@RequestBody ProductsDeleteProcces productsDeleteProcces) throws IOException {
        Map<String, String> response = productService.deleteAll(productsDeleteProcces); 
        return ResponseEntity.ok(response);
    }
    @PostMapping("/deleteOneProduct")
    public ResponseEntity<Map<String,String>> deleteOneProduct(@RequestBody ProductsDeleteProcces productsDeleteProcces) {
        Map<String,String> response = productService.deleteProductById(productsDeleteProcces);
        return ResponseEntity.ok(response);
    }
    @GetMapping("/productsImage/{id}")
    public ResponseEntity<List<ImageResponse>> getProductImage(@PathVariable Integer id) throws IOException {
       List<ImageResponse> image = productService.getProductImages(id);
        return ResponseEntity.ok(image);
    }
    @GetMapping("/productMainImage")
    public ResponseEntity<List<MainImageResponse>> getProductMainImage() throws IOException {
        List<MainImageResponse> mainImage = productService.getMainImage();
        return ResponseEntity.ok(mainImage);
    }
    @DeleteMapping("/deleteImageofProduct/{imageId}")
    public ResponseEntity<ProductImage> deleteImageofProduct(@PathVariable Integer imageId) throws IOException {
        ProductImage deleteImage = productService.deleteImage(imageId);
        return ResponseEntity.ok(deleteImage);
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
    @PostMapping("/editProductDetails")
    public ResponseEntity<Product> editProductDetails ( @RequestParam(name = "id") Integer id
                                                        ,@RequestParam(name = "name") String name,
                                                       @RequestParam("color") String color,
                                                       @RequestParam(name = "size") String size,
                                                       @RequestParam("price") Double price,
                                                       @RequestParam(value = "images", required = false)MultipartFile [] images,
                                                        @RequestParam(value = "replacedImage", required = false) Integer replacedImageId
    ) throws IOException {
        Product product = productService.editProductDetails(id,name,color,size,price,images,replacedImageId);
        return ResponseEntity.ok(product);
    }
    @PostMapping("/uploadPhoto")
    public ResponseEntity<ProductImage> uploadPhoto (@RequestParam(name = "id") Integer id,
                                                @RequestParam(name = "images") MultipartFile [] images) throws IOException {
        ProductImage productImage = productService.uploadPhoto(id, images);
        return ResponseEntity.ok(productImage);
    }
    @GetMapping("/productLogs")
    public ResponseEntity<List<ProductsActivityLog>> getAllProductLogs () {
        List<ProductsActivityLog> logs = productService.getAllProductsActivityLog();
        return ResponseEntity.ok(logs);
    }
    @GetMapping("/setImageAsDefault/{imageId}")
    public ResponseEntity<ProductImage> setImageAsDefault (@PathVariable Integer imageId) throws IOException {
        ProductImage productImage = productService.setImageAsDefault(imageId);
        return ResponseEntity.ok(productImage);
    }
}
