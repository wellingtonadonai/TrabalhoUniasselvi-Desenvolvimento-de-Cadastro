package br.com.uniasselvi.projeto.de.extensao.service;



import br.com.uniasselvi.projeto.de.extensao.entity.Produto;
import br.com.uniasselvi.projeto.de.extensao.repository.ProdutoRepository;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.web.server.ResponseStatusException;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class ProdutoServiceTest {

    @Mock
    private ProdutoRepository repository;

    @InjectMocks
    private ProdutoService service;

    @Test
    void deveCriarProdutoComSucesso() {

        // --- ARRANGE (Cenário) ---
        Produto produto = new Produto();
        produto.setQuantidade(2);
        produto.setNome("Mouse Gamer");
        produto.setPreco(100.0);

        when(repository.existsByNome("Mouse Gamer")).thenReturn(false);
        when(repository.save(produto)).thenReturn(produto);
        Produto resultado = service.criar(produto);
        assertNotNull(resultado);
        verify(repository).save(produto);
    }
    @Test
    void naoDeveCriarProdutoComNomeDuplicado() {

        Produto produto = new Produto();
        produto.setNome("Mouse Gamer");

        when(repository.existsByNome("Mouse Gamer")).thenReturn(true);
        assertThrows(ResponseStatusException.class, () -> {
            service.criar(produto);
        });

        verify(repository, never()).save(any());
    }
}
