package com.monamour.monamour.dto;

import lombok.Getter;
import lombok.Setter;
import org.springframework.stereotype.Component;

@Component
@Getter
@Setter
public class Registration {
    private String name;
    private String lastname;
    private String email;
    private String password;
    private String phoneNumber;
}
