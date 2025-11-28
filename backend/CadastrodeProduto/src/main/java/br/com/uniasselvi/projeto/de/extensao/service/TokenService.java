package br.com.uniasselvi.projeto.de.extensao.service;

import br.com.uniasselvi.projeto.de.extensao.entity.Usuario;
import com.auth0.jwt.JWT;
import com.auth0.jwt.algorithms.Algorithm;
import com.auth0.jwt.exceptions.JWTCreationException;
import com.auth0.jwt.exceptions.JWTVerificationException;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import java.time.Instant;
import java.time.LocalDateTime;
import java.time.ZoneOffset;

@Service
public class TokenService {

    // Essa é a "senha secreta" que só o seu servidor conhece.
    // Se alguém descobrir isso, consegue falsificar tokens!
    // O ideal é ler do application.properties, mas vamos definir um valor padrão caso não tenha.
    @Value("${api.security.token.secret:minha-senha-secreta-123}")
    private String secret;

    // 1. MÉTODO PARA GERAR A "PULSEIRA" (TOKEN)
    public String generateToken(Usuario usuario) {
        try {
            // Define o algoritmo de criptografia (HMAC256 é o padrão de mercado)
            Algorithm algorithm = Algorithm.HMAC256(secret);

            // Cria o token
            return JWT.create()
                    .withIssuer("estoque-api") // Quem emitiu? (Nome da sua API)
                    .withSubject(usuario.getLogin()) // Quem é o dono? (Salvamos o login/email)
                    .withExpiresAt(genExpirationDate()) // Quando vence?
                    .sign(algorithm); // Assina digitalmente

        } catch (JWTCreationException exception) {
            throw new RuntimeException("Erro ao gerar token JWT", exception);
        }
    }

    // 2. MÉTODO PARA LER/VALIDAR A "PULSEIRA"
    public String validateToken(String token) {
        try {
            Algorithm algorithm = Algorithm.HMAC256(secret);

            return JWT.require(algorithm)
                    .withIssuer("estoque-api") // Verifica se foi nossa API que emitiu
                    .build()
                    .verify(token) // Descriptografa e valida
                    .getSubject(); // Devolve o Login que estava escondido no token

        } catch (JWTVerificationException exception) {
            // Se o token for falso ou estiver vencido, retorna vazio
            return "";
        }
    }

    // 3. MÉTODO AUXILIAR PARA CALCULAR O TEMPO (2 HORAS)
    private Instant genExpirationDate() {
        // Pega a hora atual, soma 2 horas e converte para o fuso horário de Brasília (-3)
        return LocalDateTime.now().plusHours(2).toInstant(ZoneOffset.of("-03:00"));
    }
}
