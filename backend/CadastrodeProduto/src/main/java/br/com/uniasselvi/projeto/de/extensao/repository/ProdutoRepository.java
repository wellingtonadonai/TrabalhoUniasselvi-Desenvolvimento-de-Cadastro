package br.com.uniasselvi.projeto.de.extensao.repository;

import br.com.uniasselvi.projeto.de.extensao.entity.Produto;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface ProdutoRepository extends JpaRepository<Produto, Long> {
    // já vem com métodos como save, findAll, findById, deleteById
}

