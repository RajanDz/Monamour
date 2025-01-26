package com.monamour.monamour.controller;


import com.monamour.monamour.entities.Role;
import com.monamour.monamour.repository.RoleRepo;
import com.monamour.monamour.service.RoleService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api")
public class RoleController {

    private final RoleRepo roleRepo;
    private final RoleService roleService;
    public RoleController(RoleRepo roleRepo, RoleService roleService) {
        this.roleRepo = roleRepo;
        this.roleService = roleService;
    }

    @GetMapping("/roles")
    public ResponseEntity<List<Role>> getAllRoles() {
        return ResponseEntity.ok(roleRepo.findAll());
    }

    @GetMapping("/availableRoles/{id}")
    public ResponseEntity<List<Role>> getAvailableRoles(@PathVariable Integer id) {
        List<Role> roles = roleService.availableRolesToAdd(id);
        return ResponseEntity.ok(roles);
    }
    @GetMapping("/removeRole/{userId}/{roleId}")
    public ResponseEntity<Map<String,String>> removeRole(@PathVariable Integer userId, @PathVariable Integer roleId) {
        Map<String,String> removeRole = roleService.removeRole(userId, roleId);
        return ResponseEntity.ok(removeRole);
    }
    @GetMapping("/addRoleToUser/{userId}/{roleId}")
    public ResponseEntity<Map<String,String>> addRoleToUser(@PathVariable Integer userId, @PathVariable Integer roleId) {
        Map<String,String> addRole = roleService.addRoleToUser(userId, roleId);
        return ResponseEntity.ok(addRole);
    }
}
