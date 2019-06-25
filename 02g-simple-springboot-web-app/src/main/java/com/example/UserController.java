package com.example;

import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.oauth2.core.oidc.user.DefaultOidcUser;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.bind.annotation.RequestMapping;

import java.util.Map;

@RestController
public class UserController {

    @RequestMapping("/api/user")
    public Map<String, Object> user(@AuthenticationPrincipal DefaultOidcUser oidcUser) {
        return oidcUser.getClaims();
    }
}