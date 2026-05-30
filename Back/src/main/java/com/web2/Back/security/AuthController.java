package com.web2.Back.security;
import com.web2.Back.dto.LoginDTO;
import com.web2.Back.dto.LoginResponseDTO;
import com.web2.Back.dto.RegisterClienteDTO;
import com.web2.Back.service.AuthService;
import com.web2.Back.service.RegisterClienteService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.http.HttpStatus;

@RestController
@RequestMapping("/auth")
public class AuthController {

    private final AuthService authService;
    private final RegisterClienteService registerClienteService;

    public AuthController(AuthService authService, RegisterClienteService registerClienteService) {
        this.authService = authService;
        this.registerClienteService = registerClienteService;
    }

    @PostMapping("/login")
    public ResponseEntity<LoginResponseDTO> userLogin(@RequestBody LoginDTO dto) {
        System.out.println("1");
        try {
            LoginResponseDTO response = authService.login(dto);
            return ResponseEntity.ok(response);
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().build();
        }
    }

    @PostMapping("/registrar")
    public ResponseEntity<?> userRegister(@RequestBody RegisterClienteDTO dto) {
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
