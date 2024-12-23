package com.monamour.monamour.entities;


import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.LocalDateTime;

@Entity
@Table(name = "product_activity_log")
@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class ProductsActivityLog {

        @Id
        @GeneratedValue(strategy = GenerationType.IDENTITY)
        private Integer id;

        @ManyToOne
        @JoinColumn(name = "user__id")
        private User user;

        @ManyToOne
        @JoinColumn(name = "product__id")
        private Product product;

        @Column(name = "action")
        private String action;

        @Column(name = "timestamp")
        private LocalDateTime timestamp;

        @Column(name = "reason")
        private String reason;
}
