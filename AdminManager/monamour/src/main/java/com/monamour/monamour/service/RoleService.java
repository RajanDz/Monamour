package com.monamour.monamour.service;

import com.monamour.monamour.entities.Role;
import com.monamour.monamour.entities.User;
import com.monamour.monamour.repository.RoleRepo;
import com.monamour.monamour.repository.UserRepo;
import org.springframework.stereotype.Service;

import java.util.*;

@Service
public class RoleService {

    private final RoleRepo roleRepo;
    private final UserRepo userRepo;
    public RoleService(RoleRepo roleRepo, UserRepo userRepo) {
        this.roleRepo = roleRepo;
        this.userRepo = userRepo;
    }


    public Map<String,String> addRoleToUser (Integer userId, Integer roleId){
        Optional<User> user = userRepo.findById(userId);
        Optional<Role> role = roleRepo.findById(roleId);
        Map<String,String> map = new HashMap<>();
        if(user.isPresent() && role.isPresent()){
            user.get().getRoles().add(role.get());
            userRepo.save(user.get());
            map.put("Role " + role.get().getName(), " is added to  " + user.get().getName());
        }
        map.put("Error happen with " + user.get().getName(), " role " + role.get().getName());
        return map;
    }

    public Map<String,String> removeRole(Integer userId, Integer roleId ){
        Optional<User> user = userRepo.findById(userId);
        Optional<Role> role = roleRepo.findById(roleId);
        Map<String,String> map = new HashMap<>();
        if(user.isPresent() && role.isPresent()){
            user.get().getRoles().remove(role.get());
            userRepo.save(user.get());
            map.put("Role " + role.get().getName(), " is removed of " + user.get().getName());

        }
        map.put("Error happen with " + user.get().getName(), " role " + role.get().getName());
        return map;
    }

    public List<Role> availableRolesToAdd(Integer id){
        Optional<User> findUser = userRepo.findById(id);
        Set<Role> userRoles = findUser.get().getRoles();
        List<Role> availableRoles = new ArrayList<>();
        for (Role role : roleRepo.findAll()) {
            if (!userRoles.contains(role)) {
                availableRoles.add(role);
            }
        }
        System.out.println(availableRoles);
        return availableRoles;
    }


}
