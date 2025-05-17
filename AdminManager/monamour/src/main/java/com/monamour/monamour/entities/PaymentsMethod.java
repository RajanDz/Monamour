package com.monamour.monamour.entities;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.util.Date;

@Table(name = "payments")
@Entity
@Getter
@Setter
@NoArgsConstructor
public class PaymentsMethod {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    @ManyToOne
    @JoinColumn(name = "user_id")
    private User user;
    @Column(name = "card_holder_name")
    private String cardHolderName;

    @Column(name = "card_number")
    private String cardNumber;

    @Column(name = "type_of_card")
    private String typeOfCard;

    @Column(name = "ex_date")
    private Date exDate;

    @Column(name = "cvv")
    private String cvv;



}
