package com.monamour.monamour.entities;


import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Entity
@Table( name = "productImage")
@Getter
@Setter
@NoArgsConstructor
public class ProductImages {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    @JoinColumn(name = "product_id")
    @ManyToOne
    private Product product;

    @Column(name = "imagePath")
    private String imagePath;
}
