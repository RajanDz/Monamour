package com.monamour.monamour.dto;

import com.monamour.monamour.entities.Product;
import com.monamour.monamour.entities.User;
import jakarta.persistence.Column;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import lombok.Getter;

import java.time.LocalDateTime;

@Getter
public class ProductsDeleteProcces {

    private Integer user_id;
    private Integer product_id;
    private String reason;
}
