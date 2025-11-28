package br.com.uniasselvi.projeto.de.extensao.controller;

import br.com.uniasselvi.projeto.de.extensao.entity.Produto;
import br.com.uniasselvi.projeto.de.extensao.repository.ProdutoRepository;
import br.com.uniasselvi.projeto.de.extensao.service.ProdutoService; // Importe o Service
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertNotNull;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
public class ProdutoControllerTest {

    // Mock 1: Necessário para o método DELETE (se ele chamar o banco direto)
    @Mock
    private ProdutoRepository repository;

    // Mock 2: Necessário para o método CREATE (que usa a regra de negócio)
    @Mock
    private ProdutoService service;

    @InjectMocks
    private ProdutoController controller;

    @Test
    void temQueExcluirProduto() {
        Long idParaExcluir = 1L;

        // Se o seu controller faz "repository.existsById", precisamos deste when:
        when(repository.existsById(idParaExcluir)).thenReturn(true);

        // Ação
        ResponseEntity<Void> resposta = controller.delete(idParaExcluir);

        // Verificação
        assertEquals(HttpStatus.NO_CONTENT, resposta.getStatusCode());
        verify(repository, times(1)).deleteById(idParaExcluir);
    }

    @Test
    void deveSalvarProdutoComSucesso() {
        // --- ARRANGE ---
        Produto produtoParaSalvar = new Produto();
        produtoParaSalvar.setNome("Teclado Mecânico");
        produtoParaSalvar.setPreco(250.0);
        produtoParaSalvar.setQuantidade(2);
        produtoParaSalvar.setCategoria("Eletronicos");

        Produto produtoSalvo = new Produto();
        produtoSalvo.setId(1L);
        produtoSalvo.setNome("Teclado Mecânico");
        produtoSalvo.setPreco(250.0);
        // ... configure os outros campos se necessário

        // --- MUDANÇA IMPORTANTE AQUI ---
        // O Controller chama o SERVICE, não o repository.
        // Então "ensinamos" o service a responder.
        when(service.criar(produtoParaSalvar)).thenReturn(produtoSalvo);

        // --- ACT ---
        ResponseEntity<Produto> resposta = controller.create(produtoParaSalvar);

        // --- ASSERT ---
        assertEquals(HttpStatus.CREATED, resposta.getStatusCode());
        assertNotNull(resposta.getBody());
        assertEquals(1L, resposta.getBody().getId());
        assertEquals("Teclado Mecânico", resposta.getBody().getNome());
    }
}