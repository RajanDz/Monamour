package com.monamour.monamour.repository;

import com.monamour.monamour.entities.Order;
import com.monamour.monamour.entities.User;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface OrderRepo extends JpaRepository<Order, Integer> {
    Page<Order> findByUserAndStatus(User user, String status, Pageable pageable);
}
