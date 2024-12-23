package com.monamour.monamour.repository;

import com.monamour.monamour.entities.ProductsActivityLog;
import org.springframework.data.jpa.repository.JpaRepository;

public interface ProductsActivityLogRepo extends JpaRepository<ProductsActivityLog, Integer> {
}
