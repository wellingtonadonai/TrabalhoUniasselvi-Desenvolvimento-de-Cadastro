package br.com.uniasselvi.projeto.de.extensao.config;

import br.com.uniasselvi.projeto.de.extensao.entity.Produto;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.http.ResponseEntity;

import java.util.List;

@Tag(name = "Produtos", description = "Gerenciamento de produtos da loja")
public interface ProdutoControllerOpenApi {

    @Operation(summary = "Listar todos", description = "Retorna a lista completa de produtos")
    ResponseEntity<List<Produto>> getAll();

    @Operation(summary = "Criar novo produto", description = "Valida o nome e salva no banco de dados")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "201", description = "Produto criado com sucesso"),
            @ApiResponse(responseCode = "409", description = "Erro: Nome do produto já existe")
    })
    ResponseEntity<Produto> create(Produto produto);

    @Operation(summary = "Atualizar produto")
    ResponseEntity<Produto> update(Long id, Produto produto);

    @Operation(summary = "Excluir produto")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "204", description = "Excluído com sucesso"),
            @ApiResponse(responseCode = "404", description = "Produto não encontrado")
    })
    ResponseEntity<Void> delete(Long id);
}
