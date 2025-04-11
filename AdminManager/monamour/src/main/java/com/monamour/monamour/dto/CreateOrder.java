package com.monamour.monamour.dto;


import com.monamour.monamour.entities.Product;
import com.monamour.monamour.entities.User;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.ToString;
import org.springframework.stereotype.Component;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Component
@Getter
@Setter
@NoArgsConstructor
@ToString
public class CreateOrder {

    private Integer userId;
    private List<ProductShippingDetails> products = new ArrayList<>();
    private LocalDateTime createdAt;
    private String shippingAddress;
    private Double totalPrice;

}
