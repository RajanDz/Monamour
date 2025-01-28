package com.monamour.monamour.dto;

import jakarta.persistence.Column;
import lombok.Getter;
import lombok.Setter;
import org.springframework.stereotype.Component;

@Component
@Getter
@Setter
public class UserDetailsEdit {

    private Integer id;
    private String name;
    private String lastname;
    private String email;
    private String password;
    private String phoneNumber;

}
