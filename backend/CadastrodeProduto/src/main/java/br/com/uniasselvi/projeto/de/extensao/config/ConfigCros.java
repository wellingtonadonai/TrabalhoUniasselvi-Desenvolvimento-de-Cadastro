package br.com.uniasselvi.projeto.de.extensao.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.CorsRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

@Configuration
public class ConfigCros {

    @Bean
    public WebMvcConfigurer corsConfigurer() {
        return new WebMvcConfigurer() {

    @Override
    public void addCorsMappings(CorsRegistry registry) {
                    registry.addMapping("/**")
                            .allowedOrigins("https://meu-estoque-ten.vercel.app/")
                            .allowedMethods("GET", "POST", "PUT", "DELETE");
                }
            };
        }
}

