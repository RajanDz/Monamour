package com.monamour.monamour.repository;

import com.monamour.monamour.entities.UserLog;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface UserLogRepo extends JpaRepository<UserLog, Integer> {
    Optional<UserLog> findByUserId(Integer id);
}
