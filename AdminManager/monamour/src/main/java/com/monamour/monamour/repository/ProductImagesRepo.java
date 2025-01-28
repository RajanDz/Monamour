package com.monamour.monamour.repository;

import com.monamour.monamour.entities.ProductImages;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface ProductImagesRepo extends JpaRepository<ProductImages, Integer> {
    List<ProductImages> findByProductId(Integer id);
}
