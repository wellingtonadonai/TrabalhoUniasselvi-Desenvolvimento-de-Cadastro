package br.com.uniasselvi.projeto.de.extensao.controller;


import br.com.uniasselvi.projeto.de.extensao.dto.AuthenticationDTO;
import br.com.uniasselvi.projeto.de.extensao.dto.LoginResponseDTO;
import br.com.uniasselvi.projeto.de.extensao.dto.RegisterDTO;
import br.com.uniasselvi.projeto.de.extensao.entity.Usuario;
import br.com.uniasselvi.projeto.de.extensao.repository.UsuarioRepository;
import br.com.uniasselvi.projeto.de.extensao.service.TokenService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("auth")
public class AuthenticationController {

    @Autowired
    private AuthenticationManager authenticationManager; // O "Gerente" que sabe validar senhas

    @Autowired
    private UsuarioRepository repository;

    @Autowired
    private TokenService tokenService; // Nossa máquina de pulseiras

    // 1. ROTA DE LOGIN (Troca Login/Senha por Token)
    @PostMapping("/login")
    public ResponseEntity login(@RequestBody @Valid AuthenticationDTO data) {
        // Cria um objeto de autenticação com login e senha (ainda não validado)
        var usernamePassword = new UsernamePasswordAuthenticationToken(data.login(), data.senha());

        // O Spring vai no banco, acha o usuário, checa o hash da senha e valida tudo
        var auth = this.authenticationManager.authenticate(usernamePassword);

        // Se deu certo, geramos o token
        var token = tokenService.generateToken((Usuario) auth.getPrincipal());

        // Devolvemos o token para o usuário
        return ResponseEntity.ok(new LoginResponseDTO(token));
    }

    // 2. ROTA DE REGISTRO (Cria usuário novo)
    @PostMapping("/register")
    public ResponseEntity register(@RequestBody @Valid RegisterDTO data) {
        // Verifica se já existe alguém com esse login
        if (this.repository.findByLogin(data.login()) != null) return ResponseEntity.badRequest().build();

        // --- O PULO DO GATO: CRIPTOGRAFIA ---
        // Jamais salvamos senha pura ("123456"). Transformamos em hash.
        String encryptedPassword = new BCryptPasswordEncoder().encode(data.senha());

        // Cria o usuário com a senha criptografada
        Usuario newUser = new Usuario(data.login(), encryptedPassword, data.role());

        this.repository.save(newUser);

        return ResponseEntity.ok().build();
    }
}
