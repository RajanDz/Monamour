package com.monamour.monamour.repository;

import com.monamour.monamour.entities.Product;
import jakarta.transaction.Transactional;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;

import java.util.List;

public interface ProductRepo extends JpaRepository<Product, Integer> {
    List<Product> findByName(String name);
    @Query("SELECT p FROM Product p WHERE p.isDeleted = false")
    List<Product> findAllActiveProduct();


    @Modifying
    @Transactional
    @Query("UPDATE Product p SET p.isDeleted = true WHERE p.isDeleted = false")
    void softDeleteProducts();
}
