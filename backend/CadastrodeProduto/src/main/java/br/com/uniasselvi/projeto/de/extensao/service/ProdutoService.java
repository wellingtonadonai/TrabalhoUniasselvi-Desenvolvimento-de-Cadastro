package br.com.uniasselvi.projeto.de.extensao.service;

import br.com.uniasselvi.projeto.de.extensao.entity.Produto;
import br.com.uniasselvi.projeto.de.extensao.repository.ProdutoRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

@Service // Indica ao Spring que esta classe contém regras de negócio
public class ProdutoService {

    @Autowired
    private ProdutoRepository repository;

    public Produto criar(Produto criarProduto){
        boolean existe = repository.existsByNome(criarProduto.getNome());

        if (existe) {
            throw new ResponseStatusException(HttpStatus.CONFLICT, "Produto já cadastrado");
        }
        return repository.save(criarProduto);
    }

    public Produto atualizar(Long id, Produto produtoAtualizado) {

        // Tenta buscar o produto, ou lança erro se não achar
        Produto produtoExistente = repository.findById(id)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND,
                "Produto não encontrado"));

        // Aqui fazemos a atualização dos dados
        updateData(produtoExistente, produtoAtualizado);

        // Salva no banco
        return repository.save(produtoExistente);
    }


    private void updateData(Produto existente, Produto atualizado) {
        existente.setNome(atualizado.getNome());
        existente.setPreco(atualizado.getPreco());
        existente.setCategoria(atualizado.getCategoria());
        existente.setQuantidade(atualizado.getQuantidade());
    }
}
