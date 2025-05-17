package com.monamour.monamour.dto;


import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.Data;

import java.util.Date;

@Data
public class CreatePayment {

    @NotNull
    private Integer userId;
    @NotNull
    private String cardHolderName;
    @NotNull
    private String cardNumber;
    @NotNull
    private Date exDate;
    @NotNull
    private String typeOfCard;
    @Size(min = 3, max = 3, message = "CVV need to have 3 numbers")
    private String cvv;
}
