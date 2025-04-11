package com.monamour.monamour.entities;


import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.LocalDateTime;

@Entity
@Table(name = "user_order")
@Getter
@Setter
@NoArgsConstructor
public class Order {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    @ManyToOne
    @JoinColumn(name = "id_of_user")
    private User user;

    @Column(name = "created_at")
    private LocalDateTime createdAt;

    @Column(name = "shipping_address")
    private String shippingAddress;

    @Column(name = "total_price")
    private Double totalPrice;

    @Column(name = "status")
    private String status;
}
