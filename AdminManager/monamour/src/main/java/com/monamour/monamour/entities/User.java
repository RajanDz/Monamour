package com.monamour.monamour.entities;

import jakarta.persistence.*;
import lombok.*;

import java.util.HashSet;
import java.util.Set;

@Entity
@Table(name = "user")
@Getter
@Setter
@NoArgsConstructor
@ToString
public class User {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    @Column(name = "name")
    private String name;
    @Column(name = "lastname")
    private String lastname;
    @Column(name = "username")
    private String username;
    @Column(name = "email")
    private String email;
    @Column(name = "password")
    private String password;
    @Column(name = "phone_number")
    private String phoneNumber;
    @Column(name = "profile_image")
    private String profileImage;
    @Column(name = "gender")
    private String gender;

        @ManyToMany(fetch = FetchType.EAGER)
        @JoinTable(name = "user_role",
        joinColumns = @JoinColumn(name = "user_id"),
        inverseJoinColumns = @JoinColumn(name = "role_id"))
        Set<Role> roles = new HashSet<>();

    public User(String name, String lastname, String gender,String phoneNumber, String password, String email, String username) {
        this.name = name;
        this.lastname = lastname;
        this.roles = roles;
        this.gender = gender;
        this.profileImage = profileImage;
        this.phoneNumber = phoneNumber;
        this.password = password;
        this.email = email;
        this.username = username;
    }
}
