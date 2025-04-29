package com.monamour.monamour.repository;

import com.monamour.monamour.entities.Notification;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface NotificationRepo extends JpaRepository<Notification, Integer> {

    List<Notification> findByUserId(Integer userId);
}
