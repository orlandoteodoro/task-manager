package com.example.taskmanager.config;

import io.swagger.v3.oas.annotations.OpenAPIDefinition;
import io.swagger.v3.oas.annotations.info.Contact;
import io.swagger.v3.oas.annotations.info.Info;
import org.springframework.context.annotation.Configuration;

@Configuration
@OpenAPIDefinition(
    info = @Info(
        title = "Task Manager API",
        version = "1.0.0",
        description = "API REST para gerenciamento de tarefas (Kanban).",
        contact = @Contact(name = "Orlando Neto")
    )
)
public class OpenApiConfig {}
