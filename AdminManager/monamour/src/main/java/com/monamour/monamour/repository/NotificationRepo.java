package com.monamour.monamour.repository;

import com.monamour.monamour.entities.Notification;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface NotificationRepo extends JpaRepository<Notification, Integer> {

    Page<Notification> findByUserId(Integer userId, Pageable pageable);
}
