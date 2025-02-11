package com.monamour.monamour.repository;

import com.monamour.monamour.entities.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface UserRepo extends JpaRepository<User, Integer> {

    Optional<User> findByEmail(String email);

    List<User> findByNameOrLastname(String name, String lastname);
}
