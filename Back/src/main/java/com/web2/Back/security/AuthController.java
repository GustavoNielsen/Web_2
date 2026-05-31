package com.web2.Back.security;

import com.web2.Back.dto.LoginDTO;
import com.web2.Back.dto.LoginResponseDTO;
import com.web2.Back.dto.RegisterClienteDTO;
import com.web2.Back.service.AuthService;
import com.web2.Back.service.RegisterClienteService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseCookie;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/auth")
public class AuthController {

    private final AuthService authService;
    private final RegisterClienteService registerClienteService;

    public AuthController(
            AuthService authService,
            RegisterClienteService registerClienteService
    ) {
        this.authService = authService;
        this.registerClienteService = registerClienteService;
    }

    @PostMapping("/login")
    public ResponseEntity<LoginResponseDTO> userLogin(
            @RequestBody LoginDTO dto
    ) {


        try {

            String token = authService.login(dto);

            ResponseCookie cookie = ResponseCookie.from("jwt", token)
                    .httpOnly(true)
                    .secure(false) // true in production with HTTPS
                    .path("/")
                    .maxAge(60 * 60 * 24)
                    .sameSite("Lax")
                    .build();

            LoginResponseDTO response =
                    authService.getResponseDTO(dto);

            return ResponseEntity.ok()
                    .header("Set-Cookie", cookie.toString())
                    .body(response);

        } catch (RuntimeException e) {

            return ResponseEntity.badRequest().build();
        }
    }

    @PostMapping("/registrar")
    public ResponseEntity<?> userRegister(
            @RequestBody RegisterClienteDTO dto
    ) {

        try {

            registerClienteService.registrar(dto);

            return ResponseEntity
                    .status(HttpStatus.CREATED)
                    .build();

        } catch (RuntimeException e) {

            return ResponseEntity
                    .badRequest()
                    .body(e.getMessage());
        }
    }
}