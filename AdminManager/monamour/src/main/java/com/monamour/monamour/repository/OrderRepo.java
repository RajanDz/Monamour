package com.monamour.monamour.repository;

import com.monamour.monamour.entities.Order;
import com.monamour.monamour.entities.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface OrderRepo extends JpaRepository<Order, Integer> {
    List<Order> findByUserAndStatus(User user, String status);
}
