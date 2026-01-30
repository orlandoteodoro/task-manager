package com.example.taskmanager.controller;

import com.example.taskmanager.dto.*;
import com.example.taskmanager.entity.TaskStatus;
import com.example.taskmanager.mapper.TaskMapper;
import com.example.taskmanager.service.TaskService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.media.Content;
import io.swagger.v3.oas.annotations.media.Schema;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/tasks")
@Tag(name = "Tasks", description = "Gerenciamento de tarefas (Kanban)")
@CrossOrigin(origins = {"http://localhost:5173"})
public class TaskController {

  private final TaskService service;

  public TaskController(TaskService service) {
    this.service = service;
  }

  @Operation(summary = "Criar tarefa", description = "Cria uma tarefa com status inicial TODO.")
  @ApiResponses({
      @ApiResponse(responseCode = "201", description = "Tarefa criada"),
      @ApiResponse(responseCode = "400", description = "Dados inválidos", content = @Content)
  })
  @PostMapping
  public ResponseEntity<TaskResponse> create(@Valid @RequestBody TaskCreateRequest dto) {
    var created = service.create(dto);
    return ResponseEntity.status(HttpStatus.CREATED).body(TaskMapper.toResponse(created));
  }

  @Operation(summary = "Listar tarefas", description = "Lista todas as tarefas, com filtro opcional por status.")
  @GetMapping
  public ResponseEntity<List<TaskResponse>> list(
      @Parameter(description = "Filtro por status (TODO, DOING, DONE)")
      @RequestParam(required = false) TaskStatus status
  ) {
    var list = service.findAll(status).stream().map(TaskMapper::toResponse).toList();
    return ResponseEntity.ok(list);
  }

  @Operation(summary = "Buscar tarefa por ID")
  @ApiResponses({
      @ApiResponse(responseCode = "200", description = "Ok"),
      @ApiResponse(responseCode = "404", description = "Não encontrada", content = @Content)
  })
  @GetMapping("/{id}")
  public ResponseEntity<TaskResponse> getById(@PathVariable UUID id) {
    return ResponseEntity.ok(TaskMapper.toResponse(service.findById(id)));
  }

  @Operation(summary = "Atualizar tarefa", description = "Atualiza campos (título/descrição/status/prioridade/data).")
  @ApiResponses({
      @ApiResponse(responseCode = "200", description = "Atualizada"),
      @ApiResponse(responseCode = "404", description = "Não encontrada", content = @Content)
  })
  @PutMapping("/{id}")
  public ResponseEntity<TaskResponse> update(@PathVariable UUID id, @RequestBody TaskUpdateRequest dto) {
    return ResponseEntity.ok(TaskMapper.toResponse(service.update(id, dto)));
  }

  @Operation(summary = "Atualizar status", description = "Atualiza apenas o status (ideal para drag & drop).")
  @ApiResponses({
      @ApiResponse(responseCode = "200", description = "Atualizada"),
      @ApiResponse(responseCode = "400", description = "Dados inválidos", content = @Content),
      @ApiResponse(responseCode = "404", description = "Não encontrada", content = @Content)
  })
  @PatchMapping("/{id}/status")
  public ResponseEntity<TaskResponse> updateStatus(@PathVariable UUID id, @Valid @RequestBody TaskStatusUpdateRequest dto) {
    return ResponseEntity.ok(TaskMapper.toResponse(service.updateStatus(id, dto)));
  }

  @Operation(summary = "Excluir tarefa", description = "Remove a tarefa do banco (remoção física).")
  @ApiResponses({
      @ApiResponse(responseCode = "204", description = "Removida"),
      @ApiResponse(responseCode = "404", description = "Não encontrada", content = @Content)
  })
  @DeleteMapping("/{id}")
  public ResponseEntity<Void> delete(@PathVariable UUID id) {
    service.delete(id);
    return ResponseEntity.noContent().build();
  }
}
