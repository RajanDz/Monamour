package com.monamour.monamour.entities;


import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Entity
@Table(name = "products")
@Getter
@Setter
@NoArgsConstructor
public class Product {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    @Column(name = "name")
    private  String name;

    @Column(name = "color")
    private  String color;

    @Column(name = "size")
    private  String size;

    @Column(name = "price")
    private  Double price;

    @Column(name = "is_deleted")
    private Boolean isDeleted;

}
