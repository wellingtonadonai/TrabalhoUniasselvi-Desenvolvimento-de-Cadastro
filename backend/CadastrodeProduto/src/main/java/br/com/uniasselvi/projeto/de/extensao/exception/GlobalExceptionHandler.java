package br.com.uniasselvi.projeto.de.extensao.exception;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;
import org.springframework.web.server.ResponseStatusException;

@RestControllerAdvice // 1. Diz ao Spring: "Essa classe captura erros de todos os Controllers"
public class GlobalExceptionHandler {

    // 2. Diz: "Sempre que estourar um ResponseStatusException, caia aqui"
    @ExceptionHandler(ResponseStatusException.class)
    public ResponseEntity<ErroResposta> handleResponseStatusException(ResponseStatusException ex) {

        // 3. Monta o nosso objeto de erro limpo
        ErroResposta erro = new ErroResposta(ex.getReason(), ex.getStatusCode().value());

        // 4. Devolve o JSON
        return ResponseEntity.status(ex.getStatusCode()).body(erro);
    }
}
