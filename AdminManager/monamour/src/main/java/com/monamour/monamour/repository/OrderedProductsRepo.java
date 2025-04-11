package com.monamour.monamour.repository;

import com.monamour.monamour.entities.OrderedProducts;
import com.monamour.monamour.entities.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface OrderedProductsRepo extends JpaRepository<OrderedProducts, Integer> {

    List<OrderedProducts> findByOrderId(Integer orderId);
}
