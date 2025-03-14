package com.monamour.monamour.repository;

import com.monamour.monamour.dto.AppRole;
import com.monamour.monamour.entities.Role;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface RoleRepo extends JpaRepository<Role,Integer> {
    Optional<Role> findByName(String role);
}
