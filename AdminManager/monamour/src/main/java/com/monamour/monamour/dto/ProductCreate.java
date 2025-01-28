package com.monamour.monamour.dto;

import jakarta.persistence.Column;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import lombok.Getter;
import org.springframework.stereotype.Component;
import org.springframework.web.multipart.MultipartFile;

@Component
@Getter
public class ProductCreate {
    private Integer id;
    private  String name;
    private  String color;
    private  String size;
    private MultipartFile [] images;
    private  Double price;
}
