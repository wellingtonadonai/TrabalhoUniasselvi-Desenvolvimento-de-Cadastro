package br.com.uniasselvi.projeto.de.extensao.entity;

import jakarta.persistence.*;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;

import java.util.Collection;
import java.util.List;
import java.util.Objects;

@Table(name = "tb_usuarios")
@Entity(name = "usuarios")
public class Usuario implements UserDetails {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String login;

    private String senha;

    private String role; // Ex: ADMIN, USER

    // --- 1. CONSTRUTORES ---

    // Construtor Vazio (Obrigatório para o JPA/Hibernate conseguir ler o banco)
    public Usuario() {
    }

    // Construtor para criar um usuário novo (Útil quando formos fazer o cadastro)
    public Usuario(String login, String senha, String role) {
        this.login = login;
        this.senha = senha;
        this.role = role;
    }

    // --- 2. GETTERS E SETTERS MANUAIS ---

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getLogin() {
        return login;
    }

    public void setLogin(String login) {
        this.login = login;
    }

    public String getSenha() {
        return senha;
    }

    public void setSenha(String senha) {
        this.senha = senha;
    }

    public String getRole() {
        return role;
    }

    public void setRole(String role) {
        this.role = role;
    }

    // --- 3. IMPLEMENTAÇÃO DA INTERFACE USERDETAILS (O "Crachá" de Segurança) ---

    @Override
    public Collection<? extends GrantedAuthority> getAuthorities() {
        // Aqui definimos os poderes do usuário.
        // Se for ADMIN, ele ganha permissão de ADMIN e de USER.
        // Se for comum, ganha apenas permissão de USER.
        if (this.role.equals("ADMIN")) {
            return List.of(
                    new SimpleGrantedAuthority("ROLE_ADMIN"),
                    new SimpleGrantedAuthority("ROLE_USER")
            );
        } else {
            return List.of(new SimpleGrantedAuthority("ROLE_USER"));
        }
    }

    @Override
    public String getPassword() {
        return senha; // O Spring usa isso para validar a senha
    }

    @Override
    public String getUsername() {
        return login; // O Spring usa isso para achar o usuário
    }

    @Override
    public boolean isAccountNonExpired() {
        return true; // A conta nunca expira
    }

    @Override
    public boolean isAccountNonLocked() {
        return true; // A conta nunca é bloqueada
    }

    @Override
    public boolean isCredentialsNonExpired() {
        return true; // A senha nunca expira
    }

    @Override
    public boolean isEnabled() {
        return true; // O usuário está sempre ativo
    }

    // --- 4. EQUALS E HASHCODE (Baseado no ID) ---
    // Importante para o Hibernate não se perder nas comparações

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (o == null || getClass() != o.getClass()) return false;
        Usuario usuario = (Usuario) o;
        return Objects.equals(id, usuario.id);
    }

    @Override
    public int hashCode() {
        return Objects.hash(id);
    }
}