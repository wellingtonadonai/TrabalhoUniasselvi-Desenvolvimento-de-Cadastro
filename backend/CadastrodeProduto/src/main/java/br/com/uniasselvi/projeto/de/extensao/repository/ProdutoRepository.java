package br.com.uniasselvi.projeto.de.extensao.repository;

import br.com.uniasselvi.projeto.de.extensao.dto.DashboardDTO;
import br.com.uniasselvi.projeto.de.extensao.entity.Produto;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ProdutoRepository extends JpaRepository<Produto, Long> {

    boolean existsByNome(String nome);

    @Query("SELECT new br.com.uniasselvi.projeto.de.extensao.dto.DashboardDTO(p.categoria, COUNT(p)) FROM Produto p GROUP BY p.categoria")
    List<DashboardDTO> contarProdutosPorCategoria();
}

