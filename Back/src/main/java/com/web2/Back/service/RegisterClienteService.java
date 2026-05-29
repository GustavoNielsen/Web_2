package com.web2.Back.service;
import com.web2.Back.dto.RegisterClienteDTO;
import com.web2.Back.repository.UsuarioRepository;
import org.springframework.stereotype.Service;

@Service
public class RegisterClienteService {

    private final UsuarioRepository usuarioRepository;

    public RegisterClienteService(
            UsuarioRepository usuarioRepository
    ){
        this.usuarioRepository = usuarioRepository;
    }

    public void registrar(RegisterClienteDTO dto){
        validar(dto);
        // adicionar no banco

    }

    private void validar(RegisterClienteDTO dto){
        if(!validarCPF(dto.cpf())){
            throw new IllegalArgumentException("CPF invalido");
        }

        if(!validarEmail(dto.email())){
            throw new IllegalArgumentException("Email invalido");
        }

        if(!validarTel(dto.telefone())){
            throw new IllegalArgumentException("Telefone invalido");
        }

        if(!validarCEP(dto.cep())){
            throw new IllegalArgumentException("CEP invalido");
        }

        if(usuarioRepository.existsByEmail(dto.email())){
            throw new IllegalArgumentException("Email ja cadastrado");
        }


    }

    private boolean validarCEP(String cep){

        if(cep == null){
            return false;
        }

        cep = cep.trim();

        cep = cep.replaceAll("\\D", "");

        if(!cep.matches("^\\d{8}$")){
            return false;
        }

        if(cep.matches("(\\d)\\1{7}")){
            return false;
        }
        return true;
    }

    private boolean validarTel(String numero){

        if(numero == null){
            return false;
        }

        numero = numero.trim();

        numero = numero.replaceAll("\\D", "");

        if(!numero.matches("^\\d{10,11}$")){
            return false;
        }

        int ddd = Integer.parseInt(numero.substring(0, 2));
        if(ddd < 11 || ddd > 99){
            return false;
        }

        return true;
    }

    private boolean validarEmail(String email){

        if(email == null){
            return false;
        }
        email = email.trim();
        return email.matches(
                "^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\\.[A-Za-z]{2,}$"
        );
    }
    private boolean validarCPF(String cpf){
        if(cpf == null){
            return false;
        }

        cpf = cpf.replaceAll("\\D", ""); //remove o q n é digito

        if(cpf.length() != 11){
            return false;
        }

        if(cpf.matches("(\\d)\\1{10}")){ //rejeita casos onde todos os numero são iguais
            return false;
        }

        // Primeiro dígito verificador
        int soma = 0;

        for(int i = 0; i < 9; i++){
            soma += (cpf.charAt(i) - '0') * (10 - i);
        }

        int digito1 = 11 - (soma % 11);

        if(digito1 >= 10){
            digito1 = 0;
        }


        soma = 0;

        for(int i = 0; i < 10; i++){
            soma += (cpf.charAt(i) - '0') * (11 - i);
        }

        int digito2 = 11 - (soma % 11);

        if(digito2 >= 10){
            digito2 = 0;
        }

        if(digito1 != (cpf.charAt(9) - '0') ||
                digito2 != (cpf.charAt(10) - '0')){

            return false;
        }
        return true;
    }
}
