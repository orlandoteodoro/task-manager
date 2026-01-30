package com.example.taskmanager.controller;

import com.example.taskmanager.dto.TaskCreateRequest;
import com.example.taskmanager.dto.TaskStatusUpdateRequest;
import com.example.taskmanager.dto.TaskUpdateRequest;
import com.example.taskmanager.entity.Task;
import com.example.taskmanager.entity.TaskPriority;
import com.example.taskmanager.entity.TaskStatus;
import com.example.taskmanager.exception.GlobalExceptionHandler;
import com.example.taskmanager.service.TaskService;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.context.annotation.Import;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.boot.test.mock.mockito.MockBean;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

import static org.mockito.ArgumentMatchers.*;
import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@WebMvcTest(controllers = TaskController.class)
@Import(GlobalExceptionHandler.class)
class TaskControllerTest {

  @Autowired
  MockMvc mvc;

  @Autowired
  ObjectMapper mapper;

  @MockBean
  TaskService service;

  private Task sampleTask(UUID id, TaskStatus status) {
    Task t = new Task();
    t.setId(id);
    t.setTitle("Configurar Spring Boot");
    t.setDescription("Criar camadas e endpoints");
    t.setStatus(status);
    t.setPriority(TaskPriority.HIGH);
    t.setDueDate(LocalDate.of(2026, 2, 15));
    t.setCreatedAt(LocalDateTime.of(2026, 1, 1, 10, 0));
    return t;
  }

  @Test
  void postTasks_shouldReturn201() throws Exception {
    UUID id = UUID.randomUUID();
    when(service.create(any(TaskCreateRequest.class))).thenReturn(sampleTask(id, TaskStatus.TODO));

    var body = new TaskCreateRequest("T", "D", LocalDate.of(2026, 2, 15), TaskPriority.MEDIUM);

    mvc.perform(post("/api/tasks")
            .contentType(MediaType.APPLICATION_JSON)
            .content(mapper.writeValueAsString(body)))
        .andExpect(status().isCreated())
        .andExpect(jsonPath("$.id").value(id.toString()))
        .andExpect(jsonPath("$.status").value("TODO"));
  }

  @Test
  void getTasks_shouldReturnList() throws Exception {
    when(service.findAll(isNull())).thenReturn(List.of(
        sampleTask(UUID.randomUUID(), TaskStatus.TODO),
        sampleTask(UUID.randomUUID(), TaskStatus.DONE)
    ));

    mvc.perform(get("/api/tasks"))
        .andExpect(status().isOk())
        .andExpect(jsonPath("$.length()").value(2));
  }

  @Test
  void patchStatus_shouldReturn200() throws Exception {
    UUID id = UUID.randomUUID();
    when(service.updateStatus(eq(id), any(TaskStatusUpdateRequest.class)))
        .thenReturn(sampleTask(id, TaskStatus.DONE));

    var body = new TaskStatusUpdateRequest(TaskStatus.DONE);

    mvc.perform(patch("/api/tasks/{id}/status", id)
            .contentType(MediaType.APPLICATION_JSON)
            .content(mapper.writeValueAsString(body)))
        .andExpect(status().isOk())
        .andExpect(jsonPath("$.status").value("DONE"));
  }

  @Test
  void putTasks_shouldReturn200() throws Exception {
    UUID id = UUID.randomUUID();
    when(service.update(eq(id), any(TaskUpdateRequest.class))).thenReturn(sampleTask(id, TaskStatus.DOING));

    var body = new TaskUpdateRequest("Novo", null, TaskStatus.DOING, null, null);

    mvc.perform(put("/api/tasks/{id}", id)
            .contentType(MediaType.APPLICATION_JSON)
            .content(mapper.writeValueAsString(body)))
        .andExpect(status().isOk())
        .andExpect(jsonPath("$.status").value("DOING"));
  }
}
