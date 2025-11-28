package br.com.uniasselvi.projeto.de.extensao.security;


import br.com.uniasselvi.projeto.de.extensao.repository.UsuarioRepository;
import br.com.uniasselvi.projeto.de.extensao.service.TokenService;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;

@Component
public class SecurityFilter extends OncePerRequestFilter {

    @Autowired
    TokenService tokenService;

    @Autowired
    UsuarioRepository userRepository;

    @Override
    protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain filterChain) throws ServletException, IOException {

        // LOG 1: Avisa que a requisição bateu no filtro
        System.out.println("--- [SecurityFilter] Requisição chegando: " + request.getRequestURI());

        var token = this.recoverToken(request);

        if (token != null) {
            // LOG 2: Avisa que achou um token
            System.out.println("--- [SecurityFilter] Token encontrado: " + token);

            var login = tokenService.validateToken(token);

            if (login != null && !login.isEmpty()) {
                // LOG 3: Avisa que o token é válido e de qual usuário
                System.out.println("--- [SecurityFilter] Token válido! Usuário: " + login);

                UserDetails user = userRepository.findByLogin(login);

                if (user != null) {
                    // LOG 4: Avisa que achou o usuário no banco
                    System.out.println("--- [SecurityFilter] Usuário encontrado no banco. Autenticando...");

                    var authentication = new UsernamePasswordAuthenticationToken(user, null, user.getAuthorities());
                    SecurityContextHolder.getContext().setAuthentication(authentication);
                } else {
                    // ERRO A: Token válido, mas usuário sumiu do banco
                    System.out.println("--- [ERRO] Token válido, mas usuário não encontrado no banco (findByLogin retornou null).");
                }
            } else {
                // ERRO B: Token inválido ou expirado
                System.out.println("--- [ERRO] Token inválido ou expirado na validação.");
            }
        } else {
            // AVISO: Requisição sem token (Normal para Login/Register, Erro para Produtos)
            System.out.println("--- [Aviso] Nenhum token encontrado no Header Authorization.");
        }

        filterChain.doFilter(request, response);
    }

    private String recoverToken(HttpServletRequest request) {
        var authHeader = request.getHeader("Authorization");
        if (authHeader == null) return null;
        return authHeader.replace("Bearer ", "");
    }
}
