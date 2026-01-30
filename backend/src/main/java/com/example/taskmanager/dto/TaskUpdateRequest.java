package com.example.taskmanager.dto;

import com.example.taskmanager.entity.TaskPriority;
import com.example.taskmanager.entity.TaskStatus;
import io.swagger.v3.oas.annotations.media.Schema;

import java.time.LocalDate;

@Schema(description = "Dados para atualização de uma tarefa (campos opcionais)")
public record TaskUpdateRequest(
    @Schema(example = "Configurar Spring Boot (revisto)")
    String title,

    @Schema(example = "Atualizar descrição")
    String description,

    @Schema(example = "DOING")
    TaskStatus status,

    @Schema(example = "MEDIUM")
    TaskPriority priority,

    @Schema(example = "2026-02-20")
    LocalDate dueDate
) {}
