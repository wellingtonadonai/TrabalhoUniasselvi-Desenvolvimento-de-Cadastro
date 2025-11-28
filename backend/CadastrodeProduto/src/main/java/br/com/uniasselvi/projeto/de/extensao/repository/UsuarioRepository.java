package br.com.uniasselvi.projeto.de.extensao.repository;

import br.com.uniasselvi.projeto.de.extensao.entity.Usuario; // <--- Importante: É a entidade USUARIO
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Repository;

@Repository
public interface UsuarioRepository extends JpaRepository<Usuario, Long> {

    // Agora sim! O Spring vai olhar na tabela 'tb_usuarios' e vai achar o campo 'login'.
    UserDetails findByLogin(String login);
}
