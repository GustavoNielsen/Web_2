package com.web2.Back.service;

import org.springframework.stereotype.Service;

import java.nio.charset.StandardCharsets;
import java.security.MessageDigest;
import java.util.UUID;

@Service
public class SenhaService {

    // 4-digit random password
    public String gerarSenhaAleatoria() {
        int senha = (int) (Math.random() * 9000) + 1000;
        return String.valueOf(senha);
    }

    // random salt
    public String gerarSalt() {
        return UUID.randomUUID().toString().replace("-", "").substring(0, 8);
    }

    // SHA-256 hash (password + salt)
    public String hashSenha(String senha, String salt) {
        try {
            MessageDigest digest = MessageDigest.getInstance("SHA-256");

            String input = senha + salt;
            byte[] hash = digest.digest(input.getBytes(StandardCharsets.UTF_8));

            StringBuilder hex = new StringBuilder();
            for (byte b : hash) {
                hex.append(String.format("%02x", b));
            }

            return hex.toString();

        } catch (Exception e) {
            throw new RuntimeException("Erro ao gerar hash", e);
        }
    }
}