package com.example.taskmanager.dto;

import com.example.taskmanager.entity.TaskPriority;
import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

import java.time.LocalDate;

@Schema(description = "Dados para criação de uma tarefa")
public record TaskCreateRequest(
    @Schema(example = "Configurar Spring Boot")
    @NotBlank(message = "Título é obrigatório")
    String title,

    @Schema(example = "Criar projeto, configurar dependências e camadas")
    String description,

    @Schema(example = "2026-02-15", description = "Data limite (YYYY-MM-DD)")
    @NotNull(message = "Data limite é obrigatória")
    LocalDate dueDate,

    @Schema(example = "HIGH")
    @NotNull(message = "Prioridade é obrigatória")
    TaskPriority priority
) {}
