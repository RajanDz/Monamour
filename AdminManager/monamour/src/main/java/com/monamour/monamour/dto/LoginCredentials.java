package com.monamour.monamour.dto;

import lombok.Getter;
import org.springframework.stereotype.Component;

@Component
@Getter
public class LoginCredentials {

    private String email;
    private String password;

}
