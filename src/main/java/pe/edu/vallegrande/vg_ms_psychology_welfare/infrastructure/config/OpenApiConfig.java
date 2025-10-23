package pe.edu.vallegrande.vg_ms_psychology_welfare.infrastructure.config;

import io.swagger.v3.oas.models.OpenAPI;
import io.swagger.v3.oas.models.info.Contact;
import io.swagger.v3.oas.models.info.Info;
import io.swagger.v3.oas.models.info.License;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class OpenApiConfig {

    @Bean
    public OpenAPI customOpenAPI() {
        return new OpenAPI()
                .info(new Info()
                        .title("Psychology Welfare Microservice API")
                        .description("API para la gestión de evaluaciones psicológicas en instituciones educativas")
                        .version("1.0.0")
                        .contact(new Contact()
                                .name("Valle Grande University")
                                .email("support@vallegrande.edu.pe")
                                .url("https://www.vallegrande.edu.pe"))
                        .license(new License()
                                .name("MIT License")
                                .url("https://opensource.org/licenses/MIT")));
    }
}