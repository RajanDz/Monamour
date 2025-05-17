package com.monamour.monamour.dto;

import com.monamour.monamour.entities.Order;
import com.monamour.monamour.entities.User;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDateTime;

@Getter
@AllArgsConstructor
public class OrderDto {
    private Integer id;
    private LocalDateTime createdAt;
    private String shippingAddress;
    private Double totalPrice;
    private String status;



    public static OrderDto formOrder(Order order){
        return new OrderDto(
                order.getId(),
                order.getCreatedAt(),
                order.getShippingAddress(),
                order.getTotalPrice(),
                order.getStatus()
        );
    }
}
