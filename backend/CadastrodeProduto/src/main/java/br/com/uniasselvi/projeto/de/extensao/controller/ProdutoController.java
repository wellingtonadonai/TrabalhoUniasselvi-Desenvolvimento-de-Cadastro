package br.com.uniasselvi.projeto.de.extensao.controller;

import br.com.uniasselvi.projeto.de.extensao.config.ProdutoControllerOpenApi;
import br.com.uniasselvi.projeto.de.extensao.dto.DashboardDTO;
import br.com.uniasselvi.projeto.de.extensao.entity.Produto;
import br.com.uniasselvi.projeto.de.extensao.repository.ProdutoRepository;
import br.com.uniasselvi.projeto.de.extensao.service.ProdutoService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/produtos")
public class ProdutoController implements ProdutoControllerOpenApi {

    private final ProdutoRepository repository;
    private final ProdutoService service;

    public ProdutoController(ProdutoRepository repository, ProdutoService service) {
        this.repository = repository;
        this.service = service;
    }


    // Listar todos
    @GetMapping
    public ResponseEntity<List<Produto>> getAll() {
        List<Produto> lista = repository.findAll();
        return ResponseEntity.ok(lista);
    }

    @GetMapping("/dashboard")
    public ResponseEntity<List<DashboardDTO>> getDashboardData() {
        // Nota: O ideal é passar pelo Service, mas para simplificar aqui chamo direto
        return ResponseEntity.ok(repository.contarProdutosPorCategoria());
    }

    // Criar novo
    @PostMapping
    public ResponseEntity<Produto> create(@RequestBody Produto produto) {
        // Chama o serviço (que tem a validação)
        Produto novoProduto = service.criar(produto);

        return ResponseEntity.status(HttpStatus.CREATED).body(novoProduto);
    }

    // Atualizar
    @PutMapping("/{id}")
    public ResponseEntity<Produto> update(@PathVariable Long id, @RequestBody Produto produtoAtualizado) {
        Produto produtoSalvo = service.atualizar(id, produtoAtualizado);

        // Retorna status 200 (OK) com o corpo do produto
        return ResponseEntity.ok(produtoSalvo);
    }

    // Deletar
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id) {

        // Uma boa prática é verificar se existe antes de tentar deletar
        if (!repository.existsById(id)) {
            return ResponseEntity.notFound().build(); // Retorna 404 se o ID não existir
        }

        repository.deleteById(id);
        return ResponseEntity.noContent().build();
    }
}

