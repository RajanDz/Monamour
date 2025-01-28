package com.monamour.monamour.entities;


import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.LocalDateTime;

@Entity
@Table(name = "user_log")
@Getter
@Setter
@NoArgsConstructor
public class UserLog {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    @ManyToOne
    @JoinColumn(name = "user_id_")
    private User user;

    @Column(name = "registration_date")
    private LocalDateTime registrationDate;

    @Column(name = "last_login_date")
    private LocalDateTime lastLoginDate;

}
