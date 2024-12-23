package com.monamour.monamour.dto;

import lombok.Getter;
import org.springframework.stereotype.Component;

@Component
@Getter
public class ProductDetails {
    private Integer id;
    private  String name;
    private  String color;
    private  String size;
    private  String image;
    private  Double price;
}
