package com.example.taskmanager.dto;

import com.example.taskmanager.entity.TaskStatus;
import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.NotNull;

@Schema(description = "Atualização de status (usado para drag & drop)")
public record TaskStatusUpdateRequest(
    @Schema(example = "DONE")
    @NotNull(message = "Status é obrigatório")
    TaskStatus status
) {}
