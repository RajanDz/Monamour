package com.monamour.monamour.dto;

import lombok.Getter;
import lombok.Setter;
import org.springframework.stereotype.Component;

@Component
@Getter
@Setter
public class ProductShippingDetails {

    private Integer productId;
    private Integer quantity;

}
