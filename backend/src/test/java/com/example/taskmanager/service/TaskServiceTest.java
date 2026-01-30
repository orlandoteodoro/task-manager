package com.example.taskmanager.service;

import com.example.taskmanager.dto.TaskCreateRequest;
import com.example.taskmanager.dto.TaskStatusUpdateRequest;
import com.example.taskmanager.dto.TaskUpdateRequest;
import com.example.taskmanager.entity.Task;
import com.example.taskmanager.entity.TaskPriority;
import com.example.taskmanager.entity.TaskStatus;
import com.example.taskmanager.exception.ResourceNotFoundException;
import com.example.taskmanager.repository.TaskRepository;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.ArgumentCaptor;
import org.mockito.Captor;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

import static org.assertj.core.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class TaskServiceTest {

  @Mock
  TaskRepository repository;

  @InjectMocks
  TaskService service;

  @Captor
  ArgumentCaptor<Task> taskCaptor;

  @Test
  void create_shouldSetTodoAndPersist() {
    when(repository.save(any(Task.class))).thenAnswer(inv -> inv.getArgument(0));

    TaskCreateRequest req = new TaskCreateRequest(
        "  Criar Banco  ",
        "Modelar tabelas",
        LocalDate.now().plusDays(7),
        TaskPriority.HIGH
    );

    Task created = service.create(req);

    verify(repository).save(taskCaptor.capture());
    Task saved = taskCaptor.getValue();

    assertThat(saved.getTitle()).isEqualTo("Criar Banco");
    assertThat(saved.getStatus()).isEqualTo(TaskStatus.TODO);
    assertThat(saved.getPriority()).isEqualTo(TaskPriority.HIGH);
    assertThat(saved.getDueDate()).isEqualTo(req.dueDate());
    assertThat(created.getTitle()).isEqualTo("Criar Banco");
  }

  @Test
  void findAll_whenStatusNull_shouldReturnAll() {
    when(repository.findAll()).thenReturn(List.of(new Task(), new Task()));
    List<Task> list = service.findAll(null);
    assertThat(list).hasSize(2);
    verify(repository).findAll();
    verify(repository, never()).findByStatus(any());
  }

  @Test
  void findAll_whenStatusProvided_shouldFilter() {
    when(repository.findByStatus(TaskStatus.DOING)).thenReturn(List.of(new Task()));
    List<Task> list = service.findAll(TaskStatus.DOING);
    assertThat(list).hasSize(1);
    verify(repository).findByStatus(TaskStatus.DOING);
  }

  @Test
  void update_whenNotFound_shouldThrow404() {
    UUID id = UUID.randomUUID();
    when(repository.findById(id)).thenReturn(Optional.empty());

    assertThatThrownBy(() -> service.update(id, new TaskUpdateRequest("x", null, null, null, null)))
        .isInstanceOf(ResourceNotFoundException.class);

    verify(repository, never()).save(any());
  }

  @Test
  void updateStatus_shouldChangeOnlyStatus() {
    UUID id = UUID.randomUUID();
    Task t = new Task();
    t.setId(id);
    t.setTitle("A");
    t.setStatus(TaskStatus.TODO);

    when(repository.findById(id)).thenReturn(Optional.of(t));
    when(repository.save(any(Task.class))).thenAnswer(inv -> inv.getArgument(0));

    Task updated = service.updateStatus(id, new TaskStatusUpdateRequest(TaskStatus.DONE));

    assertThat(updated.getStatus()).isEqualTo(TaskStatus.DONE);
    verify(repository).save(t);
  }
}
