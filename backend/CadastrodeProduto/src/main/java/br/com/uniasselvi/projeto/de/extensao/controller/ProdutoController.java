package br.com.uniasselvi.projeto.de.extensao.controller;

import br.com.uniasselvi.projeto.de.extensao.entity.Produto;
import br.com.uniasselvi.projeto.de.extensao.repository.ProdutoRepository;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/produtos")
public class ProdutoController {

    private final ProdutoRepository repository;

    public ProdutoController(ProdutoRepository repository) {
        this.repository = repository;
    }

    // Listar todos
    @GetMapping
    public List<Produto> getAll() {
        return repository.findAll();
    }

    // Criar novo
    @PostMapping
    public Produto create(@RequestBody Produto produto) {
        return repository.save(produto);
    }

    // Atualizar
    @PutMapping("/{id}")
    public Produto update(@PathVariable Long id, @RequestBody Produto produtoAtualizado) {
        return repository.findById(id).map(produto -> {
            produto.setNome(produtoAtualizado.getNome());
            produto.setPreco(produtoAtualizado.getPreco());
            produto.setCategoria(produtoAtualizado.getCategoria());
            produto.setQuantidade(produtoAtualizado.getQuantidade());
            return repository.save(produto);
        }).orElseThrow(() -> new RuntimeException("Produto não encontrado"));
    }

    // Deletar
    @DeleteMapping("/{id}")
    public void delete(@PathVariable Long id) {
        repository.deleteById(id);
    }
}

