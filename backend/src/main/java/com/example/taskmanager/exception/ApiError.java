package com.example.taskmanager.exception;

import io.swagger.v3.oas.annotations.media.Schema;

import java.time.LocalDateTime;
import java.util.Map;

@Schema(description = "Erro padrão da API")
public record ApiError(
    int status,
    String message,
    LocalDateTime timestamp,
    Map<String, String> fieldErrors
) {}
