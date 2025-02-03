package com.monamour.monamour.repository;

import com.monamour.monamour.entities.ProductImage;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface ProductImagesRepo extends JpaRepository<ProductImage, Integer> {
    List<ProductImage> findByProductId(Integer id);
    List<ProductImage> findByIsMain(boolean isMain);

}
